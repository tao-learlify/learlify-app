import { Model } from 'objection'
import type { JSONSchema, RelationMappings, ModelClass } from 'objection'
import type { BillingCycle, SubscriptionStatus } from 'metadata/plans'

class Subscription extends Model {
  id!: number
  user_id!: number
  plan_id!: number
  plan_price_id!: number
  status!: SubscriptionStatus
  billing_cycle!: BillingCycle
  started_at!: string
  current_period_start!: string
  current_period_end!: string
  cancel_at_period_end!: boolean
  canceled_at?: string | null
  stripe_charge_id?: string | null
  stripe_customer_id?: string | null
  payment_method_id?: string | null
  idempotency_key!: string
  created_at?: string
  updated_at?: string

  static get tableName(): string {
    return 'subscriptions'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'user_id',
        'plan_id',
        'plan_price_id',
        'billing_cycle',
        'current_period_start',
        'current_period_end',
        'idempotency_key'
      ],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        plan_id: { type: 'integer' },
        plan_price_id: { type: 'integer' },
        status: {
          type: 'string',
          enum: ['active', 'canceled', 'expired', 'past_due']
        },
        billing_cycle: {
          type: 'string',
          enum: ['monthly', 'quarterly', 'yearly']
        },
        started_at: { type: 'string' },
        current_period_start: { type: 'string' },
        current_period_end: { type: 'string' },
        cancel_at_period_end: { type: 'boolean' },
        canceled_at: { type: ['string', 'null'] },
        stripe_charge_id: { type: ['string', 'null'] },
        stripe_customer_id: { type: ['string', 'null'] },
        payment_method_id: { type: ['string', 'null'] },
        idempotency_key: { type: 'string' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Plan = require('api/plans/plans.model').default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PlanPrice = require('api/plan-prices/plan-prices.model').default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const User = require('api/users/users.model').default
    return {
      user: {
        modelClass: User as ModelClass<Model>,
        relation: Model.BelongsToOneRelation,
        join: { from: 'subscriptions.user_id', to: 'users.id' }
      },
      plan: {
        modelClass: Plan as ModelClass<Model>,
        relation: Model.BelongsToOneRelation,
        join: { from: 'subscriptions.plan_id', to: 'plans.id' }
      },
      price: {
        modelClass: PlanPrice as ModelClass<Model>,
        relation: Model.BelongsToOneRelation,
        join: { from: 'subscriptions.plan_price_id', to: 'plan_prices.id' }
      }
    }
  }
}

export default Subscription
