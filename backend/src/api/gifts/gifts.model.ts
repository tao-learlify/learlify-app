import { Model } from 'objection'
import type { JSONSchema, RelationMappings, ModelClass } from 'objection'
import User from 'api/users/users.model'
import Plan from 'api/plans/plans.model'

class Gift extends Model {
  id!: number
  email?: string
  gifter?: number
  planId?: number
  serial?: string
  expired?: boolean

  static get tableName(): string {
    return 'gifts'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',

      properties: {
        id: { type: 'intger' },
        email: { type: 'string' },
        gifter: { type: 'integer ' },
        planId: { type: 'integer' },
        serial: { type: 'string ' },
        expired: { type: 'boolean' }
      }
    } as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      users: {
        modelClass: User as unknown as ModelClass<Model>,
        relation: Model.HasOneRelation,
        join: {
          from: 'gifts.gifter',
          to: 'users.id'
        }
      },

      plans: {
        modelClass: Plan as unknown as ModelClass<Model>,
        relation: Model.HasOneRelation,
        join: {
          from: 'gifts.planId',
          to: 'plans.id'
        }
      }
    }
  }
}

export default Gift
