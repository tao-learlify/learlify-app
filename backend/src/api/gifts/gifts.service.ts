import { randomUUID } from 'crypto'
import moment from 'moment-timezone'

import { Logger } from 'api/logger'
import { StripeService } from 'api/stripe/stripe.service'
import { ConfigService } from 'api/config/config.service'
import Gift from 'api/gifts/gifts.model'
import User from 'api/users/users.model'
import Package from 'api/packages/packages.model'
import type { TransactionableGiftInput, GiftGetOneParams, GiftUpdateInput } from './gifts.types'

export class GiftsService {
  private stripeService: StripeService
  private configService: ConfigService
  private logger: typeof Logger.Service

  constructor() {
    this.stripeService = new StripeService()
    this.configService = new ConfigService()
    this.logger = Logger.Service
    this.createTransactionableGift = this.createTransactionableGift.bind(this)
  }

  createRandomGiftCode(): string {
    const { provider } = this.configService as unknown as Record<string, Record<string, unknown>>

    return `${provider.uniqid}${randomUUID()}`
  }

  async createTransactionableGift(giftInfo: TransactionableGiftInput, requiresAction = false): Promise<Record<string, unknown>> {
    const { gifter, user, plan, stripe } = giftInfo

    try {
      const returnValue = await Gift.knex().transaction(async trx => {
        this.logger.debug('createTransactionableGift Start')

        const customer = await this.stripeService.addCustomer({
          email: gifter.email,
          firstName: gifter.firstName,
          lastName: gifter.lastName,
          source: stripe.source,
          stripeCustomerId: gifter.stripeCustomerId
        } as unknown as Parameters<typeof this.stripeService.addCustomer>[0])

        this.logger.debug('customer', customer)

        if (!(customer as unknown as Record<string, unknown>).exist) {
          await User.query(trx).patchAndFetchById(gifter.id as number, {
            stripeCustomerId: ((customer as unknown as Record<string, unknown>).membership as Record<string, unknown>).id
          } as unknown as Record<string, unknown>)
        }


        if (requiresAction) {
          const intent = await this.stripeService.confirmIntentPayment(giftInfo.stripe.paymentMethodId as string)

          this.logger.debug('intent', intent)

          const serial = this.createRandomGiftCode()

          const gift = await Gift.query(trx).insertAndFetch({
            email: user.email,
            planId: plan.id,
            gifter: gifter.id,
            serial: serial
          } as unknown as Record<string, unknown>)

          return {
            gift,
            customer,
          }
        }

        const intent = await this.stripeService.addIntentPayment({
          paymentMethodId: stripe.paymentMethod,
          amount: plan.price,
          currency: plan.currency,
          name: plan.name,
          customer: (customer as unknown as Record<string, unknown>).exist
            ? gifter.stripeCustomerId
            : ((customer as unknown as Record<string, unknown>).membership as Record<string, unknown>).id
        } as unknown as Parameters<typeof this.stripeService.addIntentPayment>[0])

        this.logger.debug('intent', intent)


        const response = StripeService.generatePaymentResponse(intent)

        if ((response as unknown as Record<string, unknown>).requiresAction) {
          return {
            gift: null,
            intent
          }
        }

        const serial = this.createRandomGiftCode()

        const gift = await Gift.query(trx).insertAndFetch({
          email: user.email,
          planId: plan.id,
          gifter: gifter.id,
          serial: serial
        } as unknown as Record<string, unknown>)

        this.logger.debug('serial', serial)

        return {
          customer,
          intent,
          serial,
          gift
        }
      })

      return returnValue as unknown as Record<string, unknown>
    } catch (error) {
      this.logger.error('createTransactionableGift Error', error)

      return {
        transactionError: true,
        details: error
      }
    }
  }

  async giftExchangeTransaction(gift: Record<string, unknown>, user: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const transaction = await Gift.knex().transaction(async trx => {
        this.logger.debug('giftExchangeTransaction Start')

        const giftUpdate = await Gift.query(trx)
          .patchAndFetchById(gift.id as number, {
            expired: true
          })
          .withGraphFetched({
            plans: true
          })

        this.logger.debug('giftUpdate', giftUpdate)

        const plans = (giftUpdate as unknown as Record<string, unknown>).plans as Record<string, unknown>

        const expirationDate = moment()
          .tz((this.configService as unknown as Record<string, Record<string, unknown>>).provider.TZ as string)
          .add(30, 'days')
          .format('YYYY-MM-DD')

        const userPackage = await Package.query(trx).insertAndFetch({
          total: plans.price,
          speakings: plans.speaking,
          writings: plans.writing,
          isActive: true,
          planId: plans.id,
          expirationDate,
          userId: user.id
        } as unknown as Record<string, unknown>)
        this.logger.debug('userPackage', userPackage)

        this.logger.debug('giftExchangeTransaction End')

        return userPackage
      })

      return transaction as unknown as Record<string, unknown>
    } catch (error) {
      this.logger.error('giftExchangeTransaction Error', error)

      return {
        transactionError: true,
        details: error
      }
    }
  }

  getOne(gift: GiftGetOneParams): Promise<Gift | undefined> {
    if (gift.id) {
      return Gift.query().findById(gift.id).select(['id', 'email', 'expired']) as unknown as Promise<Gift | undefined>
    }

    return Gift.query().findOne(gift).select(['id', 'email', 'expired']) as unknown as Promise<Gift | undefined>
  }

  updateOne({ id, ...data }: GiftUpdateInput): Promise<Gift> {
    if (id) {
      return Gift.query().patchAndFetchById(id, data).withGraphFetched({
        plans: true
      }) as unknown as Promise<Gift>
    }

    return Gift.query().patchAndFetch(data as unknown as Record<string, unknown>).withGraphFetched({
      plans: true
    }) as unknown as Promise<Gift>
  }
}
