import { StripeService } from 'api/stripe/stripe.service'
import Package from './packages.model'
import Plan from 'api/plans/plans.model'
import User from 'api/users/users.model'
import Progress from 'api/progress/progress.model'
import Evaluation from 'api/evaluations/evaluations.model'
import STATUS from 'api/evaluations/evaluations.status'
import { exist } from 'functions'
import { Bind } from 'decorators'
import { Logger } from 'api/logger'
import Notification from 'api/notifications/notifications.model'
import { NotificationContext } from 'api/notifications/notification.context'
import { AdminPrivateMessage } from 'metadata/notifications'
import { Socket } from 'modules'
import { NOTIFICATION } from 'gateways/events'
import type {
  CreatePackageInput,
  TransactionablePackageInput,
  TransactionablePackageResult,
  GetAllPackagesParams,
  GetOnePackageParams,
  GetActiveSubscriptionParams,
  UpdateOneInput,
  UpdateAndCreateEvaluationInput,
  UpdateAndCreateEvaluationResult,
  SubscriptionStatus,
  RelationshipConfig,
  WritingsAndSpeakingsCount
} from './packages.types'

const stripePrivateKey = Symbol('stripePrivateKey')
const relationShip = Symbol('relationShip')

type PrivateStore = {
  [stripePrivateKey]: StripeService
  [relationShip]: RelationshipConfig
}

export class PackagesService {
  private logger: typeof Logger.Service
  context: NotificationContext
  createTransactionablePackage: PackagesService['_createTransactionablePackage']

  constructor() {
    const store = this as unknown as PrivateStore
    store[stripePrivateKey] = new StripeService()
    store[relationShip] = {
      plan: {
        plan: {
          access: true
        }
      },
      users: {
        plan: {
          access: true
        },
        user: {
          $modify: ['withName']
        }
      }
    }
    this.logger = Logger.Service
    this.context = new NotificationContext()
    this.createTransactionablePackage = this._createTransactionablePackage.bind(this)
  }

  static getActiveSubscriptions(packages: unknown[][]): SubscriptionStatus[] {
    return packages.reduce<SubscriptionStatus[]>((current, next) => {
      if (next && next.length > 0) {
        return current.concat({ active: true })
      }
      return current.concat({ inactive: true })
    }, [])
  }

  @Bind
  async create(packageSource: CreatePackageInput): Promise<Package> {
    const store = this as unknown as PrivateStore
    const { users } = store[relationShip]

    const stream = new Socket()

    const pack = await Package.query()
      .select([
        'id', 'isActive', 'writings', 'speakings', 'classes',
        'createdAt', 'updatedAt', 'expirationDate', 'total', 'isNotified'
      ])
      .insertAndFetch(packageSource)
      .withGraphFetched(users)

    const type = await this.context.getContextIdentifier({
      name: AdminPrivateMessage
    }) as unknown as { id: number }

    const notification = await Notification.query()
      .insertAndFetch({
        message: 'Default Package Notification',
        read: false,
        type: type.id,
        userId: packageSource.userId
      })
      .withGraphFetched({ notificationType: true })

    stream.socket.to((pack as unknown as { user: { email: string } }).user.email).emit(NOTIFICATION, notification)

    return pack
  }

  @Bind
  private async _createTransactionablePackage(
    data: TransactionablePackageInput,
    requiresAction: boolean,
    cancel: boolean
  ): Promise<TransactionablePackageResult> {
    const store = this as unknown as PrivateStore
    const { users } = store[relationShip]
    const stripe = store[stripePrivateKey] as unknown as {
      addCustomer(opts: unknown): Promise<{ exist: boolean; membership: { id: string } }>
      cancelPaymentIntent(id: string): Promise<unknown>
      confirmIntentPayment(id: string): Promise<{ id: string }>
      addIntentPayment(opts: unknown): Promise<{ id: string }>
    }
    const knexInstance = Package.knex()

    try {
      const result = await knexInstance.transaction(async trx => {
        const user = await User.query(trx).findOne({ id: data.user.id }) as unknown as {
          id: number; email: string; firstName: string; lastName: string; stripeCustomerId: string
        }

        const plan = await Plan.query(trx).findOne({ id: data.plan.id }) as unknown as {
          id: number; speaking: number; writing: number; classes: number
          currency: string; price: number; name: string; modelId: number
        }

        if ((exist as unknown as (args: unknown[]) => boolean)([user, plan])) {
          const customer = await stripe.addCustomer({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            source: data.code.stripeToken
          })

          if (!customer.exist) {
            await User.query(trx).patchAndFetchById(user.id, {
              stripeCustomerId: customer.membership.id
            })
          }

          if (cancel) {
            const intent = await stripe.cancelPaymentIntent(data.code.paymentMethodId!)
            return { plan, package: null, cancelled: true, intent }
          }

          if (requiresAction) {
            const intent = await stripe.confirmIntentPayment(data.code.paymentMethodId!)
            const pack = await Package.query(trx)
              .insertAndFetch({
                expirationDate: data.expirationDate,
                stripeChargeId: intent.id,
                isActive: true,
                userId: user.id,
                planId: plan.id,
                speakings: plan.speaking,
                writings: plan.writing,
                classes: plan.classes
              })
              .withGraphFetched(store[relationShip].plan)

            return { package: { ...pack }, plan }
          }

          const intent = await stripe.addIntentPayment({
            email: user.email,
            paymentMethodId: data.code.paymentMethodId,
            currency: plan.currency,
            amount: plan.price,
            name: plan.name,
            customer: customer.exist ? user.stripeCustomerId : customer.membership.id
          })

          const response = (StripeService as unknown as {
            generatePaymentResponse(i: unknown): { requiresAction: boolean }
          }).generatePaymentResponse(intent)

          if (response.requiresAction) {
            return { package: null, intent }
          }

          const pack = await Package.query(trx)
            .insertAndFetch({
              expirationDate: data.expirationDate,
              stripeChargeId: intent.id,
              isActive: true,
              userId: user.id,
              planId: plan.id,
              speakings: plan.speaking,
              writings: plan.writing,
              classes: plan.classes
            })
            .withGraphFetched(users)

          return { package: { ...pack, plan }, plan, intent }
        } else {
          throw new Error('User or Plan not found')
        }
      })

      return result as TransactionablePackageResult
    } catch (err) {
      this.logger.error('createTransactionablePackage', {
        message: (err as Error).message,
        stack: (err as Error).stack
      })
      return {
        details: (err as Error).message,
        stack: (err as Error).stack,
        error: true
      }
    }
  }

  @Bind
  getAll({ date, modelId, ...source }: GetAllPackagesParams) {
    const store = this as unknown as PrivateStore
    const { plan, users } = store[relationShip]

    if (modelId) {
      return Package.query()
        .withGraphJoined(plan)
        .where(source as Record<string, unknown>)
        .andWhere('plan.modelId', modelId)
    }

    if (date) {
      return date.ranges
        ? Package.query()
            .whereBetween('expirationDate', date.ranges)
            .andWhere({ isActive: true })
            .andWhere({ isNotified: false })
            .withGraphFetched(users)
        : Package.query()
            .where('expirationDate', '<', date.today!)
            .andWhere({ isActive: true })
            .withGraphFetched(users)
    }

    return Package.query().where(source as Record<string, unknown>).withGraphFetched(plan)
  }

  getActiveSubscription({ userId, competence }: GetActiveSubscriptionParams) {
    if (competence) {
      return Package.query()
        .findOne({ isActive: true, userId })
        .andWhere(`${competence}`, '>', 0)
    }

    return Package.query()
      .findOne({ isActive: true, userId })
      .withGraphFetched('plan')
  }

  getOne({ id, modelId, access, ...data }: GetOnePackageParams) {
    if (id) {
      return Package.query().findById(id)
    }

    if (modelId) {
      return Package.query()
        .findOne(data)
        .withGraphJoined('plan.access')
        .where('plan.modelId', modelId)
        .andWhere('plan:access.feature', access ?? 'EXAMS')
    }

    return Package.query().findOne(data)
  }

  updateOne({ id, ...data }: UpdateOneInput) {
    if (id) {
      return Package.query().patchAndFetchById(id, data)
    }
    return (Package.query() as unknown as { patchAndFetchBy(d: Record<string, unknown>): Promise<Package> }).patchAndFetchBy(data as Record<string, unknown>)
  }

  async updateAndCreateEvaluation(data: UpdateAndCreateEvaluationInput): Promise<UpdateAndCreateEvaluationResult> {
    try {
      const transaction = await Package.knex().transaction(async trx => {
        const update = await Package.query(trx).patchAndFetchById(
          data.package.id,
          { [data.type]: (data.package[data.type] as number) - 1 }
        )

        this.logger.warn('update', {
          speakings: update.speakings,
          writings: update.writings,
          id: update.id
        })

        await Progress.query(trx).patchAndFetchById(data.progress.id, {
          examJSON: data.progress.examJSON
        } as unknown as Record<string, unknown>)

        const evaluation = await Evaluation.query(trx).insertAndFetch({
          userId: data.user.id,
          progressId: data.progress.id,
          categoryId: data.category.id,
          status: STATUS.PENDING
        })

        this.logger.info('evaluation', evaluation)

        return { update, evaluation }
      })

      return transaction as UpdateAndCreateEvaluationResult
    } catch (err) {
      return { details: err, transactionError: true }
    }
  }

  async getSubscriptions(data: GetAllPackagesParams, features: string[]): Promise<boolean> {
    const packages = await this.getAll(data) as unknown as Array<{
      plan: { access: Array<{ feature: string }> }
    }>

    const plans = packages.filter(({ plan }) =>
      plan.access.find(({ feature }) => features.includes(feature))
    )

    return plans.length > 0
  }

  async getWritingsAndSpeakings({ userId }: { userId: number }): Promise<WritingsAndSpeakingsCount> {
    const count: WritingsAndSpeakingsCount = {}

    const speakings = await Package.query()
      .count('speakings as speakings')
      .where({ userId, isActive: true })

    const writings = await Package.query()
      .count('writings as writings')
      .where({ userId, isActive: true })

    if (speakings && speakings[0]) {
      count.speakings = (speakings[0] as unknown as Record<string, unknown>).speakings
    }

    if (writings && writings[0]) {
      count.writings = (writings[0] as unknown as Record<string, unknown>).writings
    }

    return count
  }
}
