import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { Logger as WinstonLogger } from 'winston'
import { MODE } from 'common/process'
import { Logger } from 'api/logger'
import { ConfigService } from 'api/config/config.service'

export interface MailOptions {
  from?: string
  to: string | string[] | undefined
  subject: string
  text?: string
  html?: string
  replyTo?: string
  [key: string]: unknown
}

export class MailService {
  private logger: WinstonLogger
  private configService: ConfigService
  private client: SESClient

  constructor() {
    this.configService = new ConfigService()
    this.sendMail = this.sendMail.bind(this)
    this.logger = Logger.Service

    const { provider } = this.configService
    this.client = new SESClient({
      region: provider.AWS_REGION,
      credentials: {
        accessKeyId: provider.AWS_ACCESS_KEY,
        secretAccessKey: provider.AWS_SECRET_KEY
      }
    })
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      const { provider } = this.configService

      const from = options.from ?? provider.SES_FROM_EMAIL
      const to =
        process.env.NODE_ENV === MODE.development
          ? (process.env.EMAIL_DEVELOPMENT ?? options.to)
          : options.to

      if (!to) {
        this.logger.warn('sendMail called with no recipient — skipping')
        return
      }
      const toAddresses = Array.isArray(to) ? to : [to as string]

      const command = new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: toAddresses },
        ReplyToAddresses: options.replyTo
          ? [options.replyTo]
          : [provider.SES_REPLY_TO_EMAIL],
        Message: {
          Subject: { Data: options.subject, Charset: 'UTF-8' },
          Body: {
            ...(options.text && {
              Text: { Data: options.text, Charset: 'UTF-8' }
            }),
            ...(options.html && {
              Html: { Data: options.html, Charset: 'UTF-8' }
            })
          }
        }
      })

      const result = await this.client.send(command)
      this.logger.debug('sendMail MessageId', result.MessageId)
    } catch (error) {
      this.logger.error('sendMail Error', error)
    }
  }
}
