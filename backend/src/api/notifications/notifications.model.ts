import { Model, JSONSchema, RelationMappings } from 'objection'
import NotificationType from 'api/notification-types/notificationTypes.model'

class Notification extends Model {
  id!: number
  senderId!: number
  userId!: number
  message!: string
  read!: boolean
  deleted!: boolean
  type!: number

  static get tableName(): string {
    return 'notifications'
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['userId'],
      properties: {
        id: { type: 'integer' },
        senderId: { type: 'integer' },
        userId: { type: 'integer' },
        message: { type: 'string' },
        read: { type: 'boolean' },
        deleted: { type: 'boolean' },
        type: { type: 'integer' }
      }
    }
  }

  static relationMappings: RelationMappings = {
    notificationType: {
      relation: Model.BelongsToOneRelation,
      modelClass: NotificationType,
      join: {
        from: 'notifications.type',
        to: 'notification_types.id'
      }
    }
  }
}

export default Notification
