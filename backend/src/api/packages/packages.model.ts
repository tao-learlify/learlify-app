import { Model, JSONSchema, RelationMappings } from 'objection'
import User from 'api/users/users.model'
import Plan from 'api/plans/plans.model'

class Package extends Model {
  id!: number
  total!: number
  isActive!: boolean
  expirationDate!: string
  stripeChargeId!: string
  userId!: number
  planId!: number
  speakings!: number
  writings!: number
  classes!: number
  isNotified!: boolean

  static get tableName(): string {
    return 'packages'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['userId', 'planId', 'expirationDate', 'writings', 'speakings'],
      properties: {
        id: { type: 'integer' },
        total: { type: 'integer' },
        isActive: { type: 'boolean' },
        expirationDate: { type: 'string' },
        stripeChargeId: { type: 'string' },
        userId: { type: 'integer' },
        planId: { type: 'integer' },
        speakings: { type: 'integer' },
        writings: { type: 'integer' }
      }
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'packages.userId',
          to: 'users.id'
        }
      },
      plan: {
        relation: Model.HasOneRelation,
        modelClass: Plan,
        join: {
          from: 'packages.planId',
          to: 'plans.id'
        }
      }
    }
  }
}

export default Package
