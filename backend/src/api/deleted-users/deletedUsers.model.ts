import { Model, JSONSchema } from 'objection'

class DeletedUser extends Model {
  id!: number
  userId!: number
  email!: string
  firstName!: string
  lastName!: string

  static get tableName(): string {
    return 'deleted_users'
  }

  static get idColumn(): string {
    return 'id'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['userId', 'email', 'firstName', 'lastName'],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        email: { type: 'string', maxLength: 255 },
        firstName: { type: 'string', minLength: 1, maxLength: 30 },
        lastName: { type: 'string', minLength: 1, maxLength: 30 }
      }
    }
  }
}

export default DeletedUser
