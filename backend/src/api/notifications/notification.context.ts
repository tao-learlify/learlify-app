import NotificationType from 'api/notification-types/notificationTypes.model'

class NotificationContext {
  getContextIdentifier({ name }: { name: string }, transaction?: unknown) {
    return NotificationType.query(transaction as Parameters<typeof NotificationType.query>[0]).findOne({ name })
  }
}

export { NotificationContext }
