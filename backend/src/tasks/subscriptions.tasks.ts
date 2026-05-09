import { CronSchedule, Bind } from 'decorators'
import type { CronTrigger } from 'decorators'
import { Logger } from 'api/logger'
import { SubscriptionsService } from 'api/subscriptions/subscriptions.service'

@CronSchedule
class SubscriptionsTasks {
  private readonly logger: typeof Logger.Service
  private readonly subscriptionsService: SubscriptionsService
  trigger!: CronTrigger

  constructor() {
    this.logger = Logger.Service
    this.subscriptionsService = new SubscriptionsService()
  }

  @Bind
  async expireOverdue(): Promise<void> {
    this.trigger.schedule(
      '0 */12 * * *',
      async (): Promise<void> => {
        try {
          const expired = await this.subscriptionsService.expireOverdue()
          this.logger.info('subscriptions.tasks.expireOverdue.done', {
            expired
          })
        } catch (err) {
          const error = err as { name?: unknown; stack?: unknown }
          this.logger.error('subscriptions.tasks.expireOverdue.error', {
            name: error.name,
            stack: error.stack
          })
        }
      }
    )
  }
}

export default SubscriptionsTasks
