import { Model, JSONSchema, RelationMappings } from 'objection'
import User from 'api/users/users.model'

class Role extends Model {
  id!: number
  name!: string

  static get tableName(): string {
    return 'roles'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      id: { type: 'integer' },
      name: { type: 'string' }
    } as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'roles.name',
          to: 'users.roleId'
        }
      }
    }
  }

  static get modifiers() {
    return {
      name(builder: { select(cols: string[]): void }) {
        builder.select(['name'])
      }
    }
  }
}

export default Role
