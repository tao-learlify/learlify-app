import { Model, JSONSchema } from 'objection'

export default class NotificationType extends Model {
  id!: number
  name!: string
  template!: string

  static get tableName(): string {
    return 'notification_types'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        template: { type: 'string' }
      }
    }
  }
}
