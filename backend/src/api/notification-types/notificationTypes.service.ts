import type { Logger as WinstonLogger } from 'winston'
import { Bind } from 'decorators'
import NotificationType from './notificationTypes.model'
import { Logger } from 'api/logger'

export class NotificationTypesService {
  private logger: WinstonLogger

  constructor() {
    this.logger = Logger.Service
  }

  @Bind
  create(access: Record<string, unknown>) {
    return NotificationType.query().insertAndFetch(access as Partial<NotificationType>)
  }

  @Bind
  getAll() {
    return NotificationType.query()
  }

  @Bind
  async getOne(type: Record<string, unknown>): Promise<NotificationType | undefined> {
    const [result] = await NotificationType.query().where(type).limit(1)
    return result
  }

  @Bind
  updateOne(id: number, data: Record<string, unknown>) {
    return NotificationType.query().patchAndFetchById(id, data)
  }
}
