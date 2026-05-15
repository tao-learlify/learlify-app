import Subscription from './subscriptions.model'
import PlanPrice from 'api/plan-prices/plan-prices.model'
import Package from 'api/packages/packages.model'
import User from 'api/users/users.model'
import { StripeService } from 'api/stripe/stripe.service'
import { ConflictException } from 'exceptions'
import { Bind } from 'decorators'
import { Logger } from 'api/logger'
import moment from 'moment-timezone'
import type {
  CreateSubscriptionInput,
  CancelSubscriptionInput,
  ReactivateSubscriptionInput,
  SubscriptionRow,
  MySubscriptionResult
} from './subscriptions.types'
import type { BillingCycle } from 'metadata/plans'

const stripePrivateKey = Symbol('stripePrivateKey')

type PrivateStore = {
  [stripePrivateKey]: StripeService
}

const PERIOD_MONTHS: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12
}

const PERIOD_DAYS: Record<BillingCycle, number> = {
  monthly: 30,
  quarterly: 90,
  yearly: 365
}

class SubscriptionsService {
  private logger: typeof Logger.Service

  constructor() {
    const store = (this as unknown) as PrivateStore
    store[stripePrivateKey] = new StripeService()
    this.logger = Logger.Service
  }

  private get stripe(): StripeService {
    return ((this as unknown) as PrivateStore)[stripePrivateKey]
  }

  @Bind
  async getActive(userId: number): Promise<SubscriptionRow[]> {
    return (Subscription.query()
      .where({ user_id: userId, status: 'active' })
      .withGraphFetched({ plan: true, price: true })
      .orderBy('created_at', 'desc') as unknown) as Promise<SubscriptionRow[]>
  }

  @Bind
  async getOne(
    id: number,
    userId: number
  ): Promise<SubscriptionRow | undefined> {
    return (Subscription.query()
      .findOne({ id, user_id: userId })
      .withGraphFetched({ plan: true, price: true }) as unknown) as Promise<
      SubscriptionRow | undefined
    >
  }

  @Bind
  async create(input: CreateSubscriptionInput): Promise<SubscriptionRow> {
    const knexInstance = Subscription.knex()

    const existing = await Subscription.query().findOne({
      idempotency_key: input.idempotencyKey
    })
    if (existing) {
      this.logger.info('subscriptions.create.duplicate', {
        idempotencyKey: input.idempotencyKey
      })
      return (existing as unknown) as SubscriptionRow
    }

    const planPrice = await PlanPrice.query().findById(input.planPriceId)

    if (!planPrice || !planPrice.active) {
      throw new Error('Plan price not found or inactive')
    }

    const planRecord = ((await planPrice
      .$relatedQuery('plan')
      .first()) as unknown) as {
      id: number
      name: string
      speaking: number
      writing: number
      classes: number
      currency: string
      price: number
    }

    const plan = planRecord
    if (!plan) {
      throw new Error('Plan not found')
    }

    // Prevent duplicate active purchase for the same plan
    const [activeSub, activePkg] = await Promise.all([
      Subscription.query().findOne({
        user_id: input.userId,
        plan_id: plan.id,
        status: 'active'
      }),
      Package.query().findOne({
        userId: input.userId,
        planId: plan.id,
        isActive: true
      })
    ])
    if (activeSub || activePkg) {
      throw new ConflictException(
        'You already have an active package for this plan'
      )
    }

    const user = ((await User.query().findById(input.userId)) as unknown) as {
      id: number
      email: string
      firstName: string
      lastName: string
      stripeCustomerId: string
    }
    if (!user) {
      throw new Error('User not found')
    }

    const stripe = (this.stripe as unknown) as {
      addCustomer(opts: {
        email: string
        firstName: string
        lastName: string
        source: string
        stripeCustomerId: string
      }): Promise<{ exist: boolean; membership: { id: string } }>
      addIntentPayment(opts: {
        email: string
        paymentMethodId: string
        currency: string
        amount: number
        name: string
        customer: string
      }): Promise<{ id: string; status: string }>
    }

    const customer = await stripe.addCustomer({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      source: input.stripeToken ?? input.paymentMethodId,
      stripeCustomerId: user.stripeCustomerId
    })

    const stripeCustomerId = customer.exist
      ? user.stripeCustomerId
      : customer.membership.id

    if (!customer.exist) {
      await User.query().patchAndFetchById(user.id, { stripeCustomerId })
    }

    const intent = await stripe.addIntentPayment({
      email: user.email,
      paymentMethodId: input.paymentMethodId,
      currency: planPrice.currency,
      amount: planPrice.final_price,
      name: plan.name,
      customer: stripeCustomerId
    })

    const now = moment.utc()
    const periodStart = now.clone()
    const periodEnd = now
      .clone()
      .add(PERIOD_MONTHS[planPrice.billing_cycle], 'months')

    const result = await knexInstance.transaction(async trx => {
      const subscription = await Subscription.query(trx).insertAndFetch({
        user_id: input.userId,
        plan_id: plan.id,
        plan_price_id: planPrice.id,
        status: 'active',
        billing_cycle: planPrice.billing_cycle,
        started_at: now.format('YYYY-MM-DD HH:mm:ss'),
        current_period_start: periodStart.format('YYYY-MM-DD HH:mm:ss'),
        current_period_end: periodEnd.format('YYYY-MM-DD HH:mm:ss'),
        cancel_at_period_end: false,
        stripe_charge_id: intent.id,
        stripe_customer_id: stripeCustomerId,
        payment_method_id: input.paymentMethodId,
        idempotency_key: input.idempotencyKey
      })

      await Package.query(trx).insert({
        userId: input.userId,
        planId: plan.id,
        isActive: true,
        expirationDate: now
          .clone()
          .add(PERIOD_DAYS[planPrice.billing_cycle], 'days')
          .format('YYYY-MM-DD'),
        stripeChargeId: intent.id,
        speakings: plan.speaking ?? 0,
        writings: plan.writing ?? 0,
        classes: plan.classes ?? 0,
        total: planPrice.final_price,
        isNotified: false
      })

      return subscription
    })

    return (result as unknown) as SubscriptionRow
  }

  @Bind
  async cancel(input: CancelSubscriptionInput): Promise<SubscriptionRow> {
    const subscription = await Subscription.query().findOne({
      id: input.subscriptionId,
      user_id: input.userId
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    if (subscription.status === 'canceled') {
      return (subscription as unknown) as SubscriptionRow
    }

    if (input.immediately) {
      await Subscription.query().patchAndFetchById(subscription.id, {
        status: 'canceled',
        canceled_at: moment.utc().format('YYYY-MM-DD HH:mm:ss')
      })

      await Package.query()
        .where({
          userId: input.userId,
          stripeChargeId: subscription.stripe_charge_id
        })
        .patch({ isActive: false })
    } else {
      await Subscription.query().patchAndFetchById(subscription.id, {
        cancel_at_period_end: true
      })
    }

    return (Subscription.query()
      .findById(subscription.id)
      .withGraphFetched({ plan: true, price: true }) as unknown) as Promise<
      SubscriptionRow
    >
  }

  @Bind
  async expireOverdue(): Promise<number> {
    const now = moment.utc().format('YYYY-MM-DD HH:mm:ss')

    const rows = await Subscription.query()
      .where('status', 'active')
      .where('current_period_end', '<=', now)
      .select('id', 'user_id', 'stripe_charge_id', 'cancel_at_period_end')

    for (const row of (rows as unknown) as Array<SubscriptionRow>) {
      await Subscription.query().patchAndFetchById(row.id, {
        status: 'expired'
      })

      await Package.query()
        .where({ userId: row.user_id, stripeChargeId: row.stripe_charge_id })
        .patch({ isActive: false })
    }

    this.logger.info('subscriptions.expireOverdue', { expired: rows.length })
    return rows.length
  }

  @Bind
  async getMine(userId: number): Promise<MySubscriptionResult | null> {
    const subscription = ((await Subscription.query()
      .where({ user_id: userId, status: 'active' })
      .withGraphFetched({ plan: true, price: true })
      .orderBy('created_at', 'desc')
      .first()) as unknown) as SubscriptionRow | undefined

    if (!subscription) return null

    const pkg = ((await Package.query().findOne({
      userId,
      stripeChargeId: subscription.stripe_charge_id,
      isActive: true
    })) as unknown) as
      | {
          isActive: boolean
          expirationDate: string
          speakings: number
          writings: number
          classes: number
        }
      | undefined

    const cancelAtEnd = Boolean(subscription.cancel_at_period_end)
    const canCancel = !cancelAtEnd
    const canReactivate = cancelAtEnd

    const periodEnd = subscription.current_period_end
    const dateLabel = periodEnd
      ? new Date(periodEnd).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : ''

    const description = cancelAtEnd
      ? `Tu plan finalizará el ${dateLabel}`
      : `Tu plan se renovará el ${dateLabel}`

    return {
      subscription: {
        ...subscription,
        canCancel,
        canReactivate,
        canUpdatePaymentMethod: true
      },
      package: pkg
        ? {
            isActive: pkg.isActive,
            expirationDate: pkg.expirationDate,
            credits: {
              speaking: pkg.speakings ?? 0,
              writing: pkg.writings ?? 0,
              classes: pkg.classes ?? 0
            }
          }
        : null,
      ui: {
        primaryLabel: 'Plan actual',
        description,
        showUpgrade: false,
        purchaseDisabled: true
      }
    }
  }

  @Bind
  async cancelAtPeriodEnd(
    subscriptionId: number,
    userId: number
  ): Promise<SubscriptionRow> {
    const subscription = await Subscription.query().findOne({
      id: subscriptionId,
      user_id: userId,
      status: 'active'
    })

    if (!subscription) {
      throw new Error('Active subscription not found')
    }

    await Subscription.query().patchAndFetchById(subscriptionId, {
      cancel_at_period_end: true
    })

    return (Subscription.query()
      .findById(subscriptionId)
      .withGraphFetched({ plan: true, price: true }) as unknown) as Promise<
      SubscriptionRow
    >
  }

  @Bind
  async reactivate(
    input: ReactivateSubscriptionInput
  ): Promise<SubscriptionRow> {
    const subscription = await Subscription.query().findOne({
      id: input.subscriptionId,
      user_id: input.userId,
      status: 'active',
      cancel_at_period_end: true
    })

    if (!subscription) {
      throw new Error('No cancellable subscription found to reactivate')
    }

    await Subscription.query().patchAndFetchById(input.subscriptionId, {
      cancel_at_period_end: false,
      canceled_at: null
    })

    return (Subscription.query()
      .findById(input.subscriptionId)
      .withGraphFetched({ plan: true, price: true }) as unknown) as Promise<
      SubscriptionRow
    >
  }

  @Bind
  async activateByChargeId(stripeChargeId: string): Promise<void> {
    await Subscription.query()
      .where({ stripe_charge_id: stripeChargeId, status: 'past_due' })
      .patch({ status: 'active' })
  }

  @Bind
  async getBilling(userId: number): Promise<{
    paymentMethod: {
      id: string
      card: { brand: string; last4: string; exp_month: number; exp_year: number } | null
    } | null
    invoices: Array<{
      id: string
      created: number
      amount_paid: number
      currency: string
      status: string
      hosted_invoice_url: string | null
    }>
  }> {
    const subscription = ((await Subscription.query()
      .where({ user_id: userId, status: 'active' })
      .orderBy('created_at', 'desc')
      .first()) as unknown) as SubscriptionRow | undefined

    if (!subscription) {
      return { paymentMethod: null, invoices: [] }
    }

    const [pm, invoices] = await Promise.all([
      subscription.payment_method_id
        ? this.stripe.getPaymentMethod(subscription.payment_method_id)
        : Promise.resolve(null),
      subscription.stripe_customer_id
        ? this.stripe.listCustomerInvoices(subscription.stripe_customer_id)
        : Promise.resolve([])
    ])

    return {
      paymentMethod: pm ?? null,
      invoices: invoices ?? []
    }
  }
}

export { SubscriptionsService }
