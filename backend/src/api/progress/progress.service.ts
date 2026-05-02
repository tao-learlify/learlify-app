import { Bind } from 'decorators'
import { Logger } from 'api/logger'
import { generateDateFileName } from 'functions'
import { Categories } from 'metadata/categories'
import { EvaluationCompleted, Feedback } from 'metadata/notifications'
import { Socket } from 'modules'

import CloudStorage from 'api/cloudstorage/cloudstorage.model'
import Evaluation from 'api/evaluations/evaluations.model'
import Notification from 'api/notifications/notifications.model'
import Package from 'api/packages/packages.model'
import Progress from './progress.model'
import Stats from 'api/stats/stats.model'

import STATUS from 'api/evaluations/evaluations.status'

import { AmazonWebServices } from 'api/aws/aws.service'
import { ConfigService } from 'api/config/config.service'
import { NotificationContext } from 'api/notifications/notification.context'
import { NOTIFICATION } from 'gateways/events'

import type { ConfigurationProvider } from '@types'
import type {
  EagerRelationConfig,
  FeedbackTransactionParams,
  FeedbackTransactionResult,
  UpdateScoreParams,
  UpdateScoreResult
} from './progress.types'

class ProgressService {
  clientAttributes: string[]
  private eagerRelation: EagerRelationConfig
  aws: AmazonWebServices
  config: ConfigurationProvider
  context: NotificationContext
  logger: typeof Logger.Service

  constructor() {
    this.clientAttributes = ['id', 'data', 'createdAt', 'updatedAt']
    this.eagerRelation = {
      create: {
        exam: true
      },
      getOne: {
        exam: {
          $modify: ['clientAttributes'],
          model: {
            $modify: ['clientAttributes']
          }
        }
      },
      updateOne: {
        exam: true
      }
    }
    this.aws = new AmazonWebServices()
    this.config = new ConfigService().provider
    this.context = new NotificationContext()
    this.logger = Logger.Service
  }

  @Bind
  create(progress: Record<string, unknown>) {
    const relation = this.eagerRelation.create

    return Progress.query().insertAndFetch(progress).withGraphFetched(relation)
  }

  @Bind
  getOne(progress: Record<string, unknown>) {
    const relation = this.eagerRelation.getOne

    return Progress.query()
      .findOne(progress)
      .withGraphFetched(relation)
      .select(this.clientAttributes)
  }

  @Bind
  updateOne(progress: Record<string, unknown> & { id: number }) {
    const relation = this.eagerRelation.updateOne

    return Progress.query()
      .patchAndFetchById(progress.id, progress)
      .withGraphFetched(relation)
  }

  @Bind
  async createFeedbackTransaction({ applySubscriptionDiscount, ref }: FeedbackTransactionParams): Promise<FeedbackTransactionResult> {
    const state = {
      requiresPayment: false,
      bucket: process.env.AWS_BUCKET as string,
      upload: false,
      charges: null as string | null
    }

    const SQL = Progress.knex()

    ref.category.name.includes(Categories.Speaking) &&
      Object.assign(state, { charges: 'speakings' })

    ref.category.name.includes(Categories.Writing) &&
      Object.assign(state, { charges: 'writings' })

    const feedback = await SQL.transaction(async T => {
      try {
        if (applySubscriptionDiscount) {
          const pack = await Package.query(T)
            .withGraphJoined('plan')
            .findOne(ref.package)
            .where(state.charges as string, '>', 0)
            .andWhere({ isActive: true })
            .andWhere('plan.modelId', ref.model.id)

          if (pack) {
            const charge = await Package.query(T).patchAndFetchById(pack.id, {
              [state.charges as string]: (pack as unknown as Record<string, number>)[state.charges as string] - 1
            })

            this.logger.info(`Speakings update: ${(charge as unknown as Record<string, unknown>).speakings}`)

            this.logger.info(`Writings update: ${(charge as unknown as Record<string, unknown>).writings}`)
          } else {
            state.requiresPayment = true
            throw new Error('Payment')
          }
        }

        if (ref.category.name === Categories.Speaking) {
          const requests = ref.recordings.map(recording =>
            this.aws.upload({
              Body: recording.buffer,
              Key: `speakings/${generateDateFileName(recording.originalname)}`,
              Bucket: state.bucket
            })
          )

          const uploads = (await Promise.all(requests)).map((recording) => {
            return {
              bucket: (recording as unknown as Record<string, unknown>).Bucket,
              ETag: (recording as unknown as Record<string, unknown>).ETag,
              key: ((recording as unknown as Record<string, unknown>).key as string).replace('speakings/', ''),
              location: (recording as unknown as Record<string, unknown>).Location,
              userId: ref.user.id
            }
          })

          state.upload = true

          const storage = await CloudStorage.query(T).insertGraphAndFetch(
            uploads as unknown as Record<string, unknown>[]
          )

          const keys = ref.progress.data[ref.category.name] as unknown as {
            completed: boolean
            cloudStorageRef: number[][]
            lastIndex: number
          }

          const ids = (storage as unknown as Array<{ id: number }>).map(({ id }) => id)

          keys.completed = applySubscriptionDiscount || false

          keys.cloudStorageRef.push(ids)

          keys.lastIndex = ref.lastIndex

          const { exam } = await Progress.query(T)
            .patchAndFetchById(ref.progress.id, {
              data: ref.progress.data as unknown as Record<string, unknown>
            })
            .where({ id: ref.progress.id })
            .withGraphFetched({ exam: true }) as unknown as { exam: Record<string, unknown> }

          if (applySubscriptionDiscount) {
            const evaluation = await Evaluation.query(T).insertAndFetch({
              examId: exam.id,
              categoryId: ref.category.id,
              data: {
                cloudStorageRef: keys.cloudStorageRef
              },
              STATUS: STATUS.PENDING,
              userId: ref.user.id,
              refVersion: exam.version
            } as unknown as Record<string, unknown>)

            const type = await this.context.getContextIdentifier(
              {
                name: EvaluationCompleted
              },
              T
            )

            const stream = new Socket()

            const notification = await Notification.query(T)
              .insertAndFetch({
                message: 'Default Evalaution Notification',
                read: false,
                userId: ref.user.id,
                type: type!.id
              } as unknown as Record<string, unknown>)
              .withGraphFetched({ notificationType: true })

            stream.socket.to(ref.user.email).emit(NOTIFICATION, notification)

            return {
              evaluation: evaluation as unknown as Record<string, unknown>,
              feedback: true
            }
          }

          return true
        }

        if (ref.category.name === Categories.Writing) {
          const keys = ref.progress.data[ref.category.name] as unknown as {
            completed: boolean
            feedback: unknown[]
            lastIndex: number
          }

          keys.completed = applySubscriptionDiscount || false
          keys.feedback.push(ref.feedback)
          keys.lastIndex = ref.lastIndex

          const { exam } = await Progress.query(T)
            .patchAndFetchById(ref.progress.id, {
              data: ref.progress.data as unknown as Record<string, unknown>
            })
            .where({ id: ref.progress.id })
            .withGraphFetched({ exam: true }) as unknown as { exam: Record<string, unknown> }

          if (applySubscriptionDiscount) {
            const evaluation = await Evaluation.query(T).insertAndFetch({
              examId: exam.id,
              categoryId: ref.category.id,
              data: {
                feedback: keys.feedback
              },
              STATUS: STATUS.PENDING,
              userId: ref.user.id,
              refVersion: exam.version
            } as unknown as Record<string, unknown>)
            const stream = new Socket()

            const type = await this.context.getContextIdentifier(
              {
                name: Feedback
              },
              T
            )

            const notification = await Notification.query(T)
              .insertAndFetch({
                message: 'Default Feedback Notification',
                read: false,
                userId: ref.user.id,
                type: type!.id
              } as unknown as Record<string, unknown>)
              .withGraphFetched({ notificationType: true })

            stream.socket.to(ref.user.email).emit(NOTIFICATION, notification)

            return {
              evaluation: evaluation as unknown as Record<string, unknown>,
              feedback: true
            }
          }

          return true
        }
      } catch (err) {
        this.logger.error('Transaction Error', err)
        if (state.upload) {
          const stored = ref.recordings.map(recording => ({
            Key: recording.originalname
          }))

          await this.aws.deleteObjects({
            Bucket: state.bucket,
            Delete: {
              Objects: stored
            }
          })
        }

        return {
          transactionError: true,
          requiresPayment: state.requiresPayment
        }
      }
    })

    return feedback as FeedbackTransactionResult
  }

  @Bind
  async updateScoreWithProgress({ context, data, score }: UpdateScoreParams): Promise<UpdateScoreResult> {
    const stream = new Socket()

    const SQL = Progress.knex()

    const transaction = await SQL.transaction(async T => {
      try {
        this.logger.info('context', { value: context })

        if (context) {
          const progress = await Progress.query(T)
            .updateAndFetchById(data.id, data)
            .select(this.clientAttributes)

          const stats = await Stats.query(T)
            .insertAndFetch({
              ...score.ref,
              ...score.user
            })
            .withGraphFetched({ category: true })

          const type = await this.context.getContextIdentifier(
            {
              name: Feedback
            },
            T
          )

          const notification = await Notification.query(T)
            .insertAndFetch({
              message: 'Default Feedback Notification',
              read: false,
              userId: score.user.userId,
              type: type!.id
            } as unknown as Record<string, unknown>)
            .withGraphFetched({ notificationType: true })

          stream.socket.to(score.email).emit(NOTIFICATION, notification)

          return {
            notification: notification as unknown as Record<string, unknown>,
            progress: progress as unknown as Record<string, unknown>,
            stats: stats as unknown as Record<string, unknown>
          }
        }

        const progress = await Progress.query(T)
          .updateAndFetchById(data.id, data)
          .select(this.clientAttributes)

        return {
          progress: progress as unknown as Record<string, unknown>,
          stats: null
        }
      } catch (err) {
        this.logger.error('transactionDetails', err)

        return {
          transactionError: true
        }
      }
    })

    return transaction as UpdateScoreResult
  }
}

export { ProgressService }
