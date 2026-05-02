import type { Request, Response } from 'express'
import { MailService } from 'api/mails/mails.service'
import { Bind } from 'decorators'
import { Logger } from 'api/logger'
import { GiftsService } from './gifts.service'
import { UsersService } from 'api/users/users.service'
import { PlansService } from 'api/plans/plans.service'
import { StripeService } from 'api/stripe/stripe.service'
import { NotFoundException, TransactionError } from 'exceptions'

export class GiftsController {
  private giftsService: GiftsService
  private usersService: UsersService
  private plansService: PlansService
  private mailService: MailService
  private logger: typeof Logger.Service

  constructor() {
    this.giftsService = new GiftsService()
    this.usersService = new UsersService()
    this.plansService = new PlansService()
    this.mailService = new MailService()

    this.logger = Logger.Service
  }

  @Bind
  async create(req: Request, res: Response): Promise<Response> {
    const { email, paymentMethod, requiresAction } = req.body

    const { planId } = req.query

    const plan = await (this.plansService as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>).getOne({ id: planId })

    const friend = await this.usersService.getOne({ id: req.user!.id } as unknown as Parameters<typeof this.usersService.getOne>[0])

    if (friend && plan) {
      const gift = await this.giftsService.createTransactionableGift(
        {
          gifter: friend as unknown as Record<string, unknown>,
          plan: plan as unknown as Record<string, unknown>,
          user: {
            email
          },
          stripe: {
            paymentMethod
          }
        },
        requiresAction
      )

      if (gift.transactionError) {
        throw new TransactionError()
      }

      await this.mailService.sendMail({
        to: (gift.gift as Record<string, unknown>).email as string,
        subject: res.__('mails.services.gift.to.subject'),
        text: res.__('mails.services.gift.to.text', { user: gift.email } as Record<string, unknown>),
        html: `
        <div>
        
          <p>
            ${res.__('mails.services.gift.to.html.invite', {
              user: (friend as unknown as Record<string, unknown>).firstName
            } as Record<string, unknown>)}
            
            ${res.__('mails.services.gift.to.html.steps.1')}
            ${res.__('mails.services.gift.to.html.steps.2')}
            ${res.__('mails.services.gift.to.html.steps.3')}
            ${res.__('mails.services.gift.to.html.steps.4')}
            <br>
            ${res.__('mails.services.gift.to.html.code')}
            <strong style="font-size: 20px">
              ${gift.serial}
            </strong>
            ${res.__('mails.services.gift.to.html.steps.5')}
          </p>
          ${res.__('mails.services.gift.to.html.team')}
        </div>
      `
      } as unknown as Parameters<typeof this.mailService.sendMail>[0])

      await this.mailService.sendMail({
        to: (friend as unknown as Record<string, unknown>).email as string,
        subject: res.__('mails.services.gift.from.subject'),
        text: res.__('mails.services.gift.from.text', {
          user: (friend as unknown as Record<string, unknown>).firstName
        } as Record<string, unknown>),
        html: `
        <div>
          <p>
            ${res.__('mails.services.gift.from.html.gift')}
            ${res.__('mails.services.gift.from.html.community')}
          </p>
        </div>
      `
      } as unknown as Parameters<typeof this.mailService.sendMail>[0])

      return res.status(201).json({
        message: 'Gift created succesfully',
        response: {
          ...gift,
          intent: requiresAction ? undefined : StripeService.generatePaymentResponse(gift.intent as unknown as Parameters<typeof StripeService.generatePaymentResponse>[0])
        },
        statusCode: 201
      })
    }

    throw new NotFoundException(res.__('errors.User or plan not found'))
  }

  @Bind
  async exchangeGift(req: Request, res: Response): Promise<Response> {
    const { code } = req.query

    const gift = await this.giftsService.getOne({ serial: code } as Record<string, unknown>)
    this.logger.debug('gift', gift)

    if (!gift) {
      throw new NotFoundException(
        res.__('errors.The Serial is invalid or the Gift does not exist')
      )
    }

    if (gift.expired) {
      return res.status(410).json({
        message:
          res.__('errors.The code has expired and the resource is no longer available'),
        statusCode: 410
      })
    }

    const user = await this.usersService.getOne({ email: gift.email } as unknown as Parameters<typeof this.usersService.getOne>[0])
    this.logger.debug('user', user)

    if (!user) {
      this.logger.debug('User not found')
      throw new NotFoundException(res.__('errors.The user is invalid or does not exist'))
    }

    const userPackage = await this.giftsService.giftExchangeTransaction(
      gift as unknown as Record<string, unknown>,
      user as unknown as Record<string, unknown>
    )

    if (userPackage.transactionError) {
      throw new TransactionError()
    }

    return res.status(201).json({
      message: 'Gift has been exchanged succesfully',
      response: userPackage,
      statusCode: 201
    })
  }
}
