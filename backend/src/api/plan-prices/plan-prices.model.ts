import { Model } from 'objection'
import type { JSONSchema, RelationMappings, ModelClass } from 'objection'
import type { BillingCycle } from 'metadata/plans'

class PlanPrice extends Model {
  id!: number
  plan_id!: number
  billing_cycle!: BillingCycle
  currency!: string
  base_price!: number
  discount_percentage!: number
  final_price!: number
  active!: boolean
  created_at?: string
  updated_at?: string

  static get tableName(): string {
    return 'plan_prices'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'plan_id',
        'billing_cycle',
        'currency',
        'base_price',
        'final_price'
      ],
      properties: {
        id: { type: 'integer' },
        plan_id: { type: 'integer' },
        billing_cycle: {
          type: 'string',
          enum: ['monthly', 'quarterly', 'yearly']
        },
        currency: { type: 'string', maxLength: 3 },
        base_price: { type: 'integer' },
        discount_percentage: { type: 'number' },
        final_price: { type: 'integer' },
        active: { type: 'boolean' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Plan = require('api/plans/plans.model').default
    return {
      plan: {
        modelClass: Plan as ModelClass<Model>,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'plan_prices.plan_id',
          to: 'plans.id'
        }
      }
    }
  }
}

export default PlanPrice
