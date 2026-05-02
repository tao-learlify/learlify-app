/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Request, Response } from 'express'
import { ConfigService } from 'api/config/config.service'
import { CategoriesService } from 'api/categories/categories.service'
import { StripeService } from 'api/stripe/stripe.service'
import { PackagesService } from './packages.service'
import { PlansService } from 'api/plans/plans.service'
import { MailService } from 'api/mails/mails.service'
import { UsersService } from 'api/users/users.service'
import { ProgressService } from 'api/progress/progress.service'
import { NotFoundException, PaymentException, TransactionError } from 'exceptions'
import { Logger } from 'api/logger'
import { mailConfig } from 'api/mails'
import { Bind } from 'decorators'
import type { TransactionablePackageResult } from './packages.types'

class PackagesController {
  private logger: typeof Logger.Service
  private categoriesService: CategoriesService
  private packagesService: PackagesService
  private configService: ConfigService
  private plansService: PlansService
  private mailService: MailService
  private usersService: UsersService
  private progressService: ProgressService

  constructor() {
    this.logger = Logger.Service
    this.categoriesService = new CategoriesService()
    this.packagesService = new PackagesService()
    this.configService = new ConfigService()
    this.plansService = new PlansService()
    this.mailService = new MailService()
    this.usersService = new UsersService()
    this.progressService = new ProgressService()
  }

  @Bind
  async assign(req: Request, res: Response): Promise<Response> {
    const { userId, planId } = req.query as unknown as { userId: number; planId: number }

    const user = await this.usersService.getOne({ id: userId }) as unknown as {
      id: number; email: string; firstName: string
    } | undefined

    if (user) {
      const plan = await (this.plansService.getOne as unknown as (a: unknown) => Promise<unknown>)({ id: planId }) as unknown as {
        id: number; writing: number; speaking: number; classes: number; name: string
      } | undefined

      if (plan) {
        const expirationDate = (this.configService as unknown as {
          getPackageExpirationDate(): string
        }).getPackageExpirationDate()

        const pack = await this.packagesService.create({
          isActive: true,
          writings: plan.writing,
          speakings: plan.speaking,
          classes: plan.classes,
          planId,
          userId,
          expirationDate
        })

        if (pack) {
          await this.mailService.sendMail({
            to: user.email,
            from: (this.configService.provider as unknown as { SES_FROM_EMAIL: string }).SES_FROM_EMAIL,
            subject: res.__('mails.services.assignPackage.subject'),
            text: res.__('mails.services.assignPackage.text', { user: user.firstName }),
            html: res.__('mails.services.assignPackage.html.enjoy', { plan: plan.name })
          })

          return res.status(201).json({
            message: 'Package assigned succesfully',
            response: pack,
            statusCode: 201
          })
        }

        throw new NotFoundException(res.__('errors.Plan Not Found'))
      }
      throw new NotFoundException(res.__('errors.Plan Not Found'))
    }
    throw new NotFoundException(res.__('errors.User Not Found'))
  }

  @Bind
  async create(req: Request, res: Response): Promise<Response> {
    const { planId } = req.query as unknown as { planId: number }
    const { paymentMethodId, requiresAction, cancel } = req.body as {
      paymentMethodId: string
      requiresAction: boolean
      cancel: boolean
    }

    const expirationDate = (this.configService as unknown as {
      getPackageExpirationDate(): string
    }).getPackageExpirationDate()

    const data = await this.packagesService.createTransactionablePackage(
      {
        code: { paymentMethodId },
        plan: { id: planId },
        user: req.user as unknown as { id: number; email: string; firstName: string; lastName: string; stripeCustomerId: string },
        expirationDate
      },
      requiresAction,
      cancel
    ) as TransactionablePackageResult & { plan?: { name: string } }

    if (data.cancelled) {
      this.logger.error('PaymentIntentController', { cancelled: true })

      return res.status(500).json({
        response: { ...data, details: 'Payment process has been cancelled' },
        statusCode: 500
      })
    }

    if (data.error) {
      this.logger.error('PaymentIntentController', { error: true })

      return res.status(500).json({ response: data, statusCode: 500 })
    }

    const user = req.user!

    if (data.plan) {
      await this.mailService.sendMail({
        from: mailConfig.email,
        to: user.email,
        subject: res.__('mails.services.createPackage.subject'),
        text: res.__('mails.services.createPackage.text', { user: user.firstName }),
        html: `
          <div>
            ${res.__('mails.services.createPackage.html.confirm')} ${data.plan.name}
            ${res.__('mails.services.createPackage.html.practice')}
            ${res.__('mails.services.createPackage.html.access')} <a href="${mailConfig.domain}">${mailConfig.domain}</a>
            ${res.__('mails.services.createPackage.html.must')}
            <strong>B1B2Top AptisGo</strong>
          </div>`
      })
    }

    return res.status(201).json({
      message: 'Package created succesfully',
      response: {
        ...data,
        intent: requiresAction
          ? undefined
          : (StripeService as unknown as {
              generatePaymentResponse(i: unknown): unknown
            }).generatePaymentResponse(data.intent)
      },
      statusCode: 201
    })
  }

  @Bind
  async getAll(req: Request, res: Response): Promise<Response> {
    const { active } = req.query as unknown as { active: boolean }

    const packages = await this.packagesService.getAll({
      isActive: active,
      userId: req.user!.id
    })

    return res.status(200).json({
      message: 'Packages obtained succesfully',
      response: packages,
      statusCode: 200
    })
  }

  @Bind
  async update(req: Request, res: Response): Promise<Response> {
    const { type, category: value } = req.query as { type: string; category: string }
    const { progress, needsRevision } = req.body as {
      progress: { id: number; progressUpdated: unknown }
      needsRevision: boolean
    }

    const user = req.user!

    if (!['writings', 'speakings'].includes(type.toLowerCase())) {
      throw new NotFoundException('Bad request: type must be speakings or writings only')
    }

    const category = await this.categoriesService.getOne({ name: value }) as unknown as {
      id: number; name: string
    } | undefined

    const packages = await this.packagesService.getAll({
      userId: user.id,
      isActive: true
    })

    const examJSON = JSON.stringify(progress.progressUpdated)

    if (category) {
      if (needsRevision) {
        const active = await this.packagesService.getActiveSubscription({
          userId: user.id,
          competence: type
        }) as unknown as { id: number; speakings: number; writings: number; [key: string]: unknown } | undefined

        if (active) {
          const context = await this.packagesService.updateAndCreateEvaluation({
            user,
            category,
            progress: { id: progress.id, examJSON },
            package: active,
            type
          })

          if (context.transactionError) {
            throw new TransactionError(context.details as string)
          }

          return res.status(201).json({
            packages,
            response: {
              packages,
              evaluation: context.evaluation,
              package: context.update
            },
            statusCode: 201
          })
        } else {
          throw new PaymentException({ response: { feedback: true } })
        }
      }

      const update = await this.progressService.updateOne({
        id: progress.id,
        examJSON
      } as unknown as Parameters<typeof this.progressService.updateOne>[0])

      return res.status(200).json({
        response: { packages, progress: update }
      })
    }

    return res.status(400).json({ statusCode: 400 })
  }
}

export { PackagesController }
