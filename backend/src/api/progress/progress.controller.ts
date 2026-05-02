import { Bind } from 'decorators'
import {
  ConflictException,
  NotFoundException,
  PaymentException,
  TransactionError
} from 'exceptions'
import { Logger } from 'api/logger'

import { StatsFunctions } from 'api/stats/stats.functions'
import { Categories } from 'metadata/categories'

import { AmazonWebServices } from 'api/aws/aws.service'
import { CategoriesService } from 'api/categories/categories.service'
import { ExamsService } from 'api/exams/exams.service'
import { EvaluationsService } from 'api/evaluations/evaluations.services'
import { PackagesService } from 'api/packages/packages.service'
import { PlansService } from 'api/plans/plans.service'
import { ProgressService } from './progress.service'

import { cloudfrontURL, parseContent } from 'functions'
import { v4 as UUID } from 'uuid'

import type { Request, Response } from 'express'
import type { ProgressStructure } from './progress.types'

class ProgressController {
  aws: AmazonWebServices
  categoryService: CategoriesService
  packagesService: PackagesService
  progressService: ProgressService
  plansService: PlansService
  examsService: ExamsService
  evaluationsService: EvaluationsService
  logger: typeof Logger.Service

  constructor() {
    this.aws = new AmazonWebServices()
    this.categoryService = new CategoriesService()
    this.packagesService = new PackagesService()
    this.progressService = new ProgressService()
    this.plansService = new PlansService()
    this.examsService = new ExamsService()
    this.evaluationsService = new EvaluationsService()
    this.logger = Logger.Service
  }

  get structure(): ProgressStructure {
    return {
      'Grammar & Vocabulary': {
        feedback: [],
        lastIndex: 0,
        points: 0,
        score: 0
      },
      Listening: {
        feedback: [],
        lastIndex: 0,
        points: 0,
        score: 0
      },
      Reading: {
        feedback: [],
        lastIndex: 0,
        points: 0,
        score: 0
      },
      Speaking: {
        cloudStorageRef: [],
        lastIndex: 0
      },
      Writing: {
        feedback: [],
        lastIndex: 0
      }
    }
  }

  @Bind
  async create(req: Request, res: Response) {
    const exists = await this.progressService.getOne({
      examId: req.body.examId,
      userId: req.user!.id
    })

    if (exists) {
      this.logger.warn('Progress Conflict Already Exist')

      throw new ConflictException()
    }

    const progress = await this.progressService.create({
      examId: req.body.examId,
      userId: req.user!.id,
      data: {
        uuid: UUID(),
        ...this.structure
      }
    })

    this.logger.info('progress', { created: true })

    res.status(201).json({
      message: 'Progress created successfully',
      response: progress,
      statusCode: 201
    })
  }

  @Bind
  async getOne(req: Request, res: Response) {
    const progress = await this.progressService.getOne({
      examId: req.query.examId,
      userId: req.user!.id
    })

    if (progress) {
      return res.status(200).json({
        message: 'Progress obtained successfully',
        response: progress,
        statusCode: 200
      })
    }

    throw new NotFoundException()
  }

  @Bind
  async updateOne(req: Request, res: Response) {
    const { id, key, score, uuid, lastIndex, feedback, points } = req.body

    const name = decodeURIComponent(key)

    const category = await this.categoryService.getOne({
      name
    })

    const progress = await this.progressService.getOne({
      id
    })

    if (progress && category) {
      const { data } = progress as unknown as { data: ProgressStructure }

      if (data.uuid === uuid && name in data) {
        const { dir, model } = (progress as unknown as Record<string, unknown>).exam as Record<string, unknown>

        const body = await this.aws.getObjectBody({
          Bucket: process.env.AWS_BUCKET as string,
          Key: cloudfrontURL(dir as string)
        })

        const { exercises } = parseContent({
          data: (body as Buffer).toString() as unknown as JSON,
          key: name
        })

        const requiresFeedback = exercises?.length === lastIndex

        this.logger.info('RequiresFeedback', requiresFeedback)

        if (key === Categories.Speaking || key === Categories.Writing) {
          const user = req.user!

          const response = await this.progressService.createFeedbackTransaction(
            {
              ref: {
                package: {
                  userId: user.id,
                  isActive: true
                },
                user: user as unknown as { id: number; email: string; [key: string]: unknown },
                category: category as unknown as { id: number; name: string; [key: string]: unknown },
                progress: progress as unknown as { id: number; data: ProgressStructure; exam?: Record<string, unknown> },
                feedback,
                lastIndex,
                recordings: req.files as Express.Multer.File[],
                model: model as { id: number; name?: string }
              },
              applySubscriptionDiscount: requiresFeedback
            }
          )

          if (response && (response as unknown as Record<string, unknown>).requiresPayment) {
            this.logger.warn('Cannot be updated due to payment requirements')

            throw new PaymentException()
          } else if (response) {
            this.logger.info('progress', response)

            return res.status(201).json({
              response: {
                id: (progress as unknown as { id: number }).id,
                ...response as unknown as Record<string, unknown>
              },
              statusCode: 201
            })
          }

          if ((response as unknown as Record<string, unknown>).transactionError) {
            this.logger.error('error', response)

            throw new TransactionError()
          }
        } else {
          const sync = data[category.name as keyof ProgressStructure] as unknown as Record<string, unknown>

          sync.completed = requiresFeedback

          sync.lastIndex = lastIndex

          sync.score = (sync.score as number) + score

          if (points) {
            sync.points = (sync.points as number) + points
          }

          this.logger.info('Progress Sync', sync)

          const transaction = await this.progressService.updateScoreWithProgress({
            context: requiresFeedback,
            data: progress as unknown as { id: number },
            score: {
              ref: StatsFunctions.score({
                category: category.name,
                model: (model as { name: string }).name,
                value: sync.score as number
              }) as unknown as Record<string, unknown>,
              user: {
                categoryId: category.id,
                examId: ((progress as unknown as Record<string, unknown>).exam as Record<string, unknown>).id as number,
                userId: req.user!.id,
              },
              email: req.user!.email
            }
          })

          if ((transaction as unknown as Record<string, unknown>).transactionError) {
            throw new TransactionError()
          }

          this.logger.info('updated', transaction)

          if ((transaction as unknown as Record<string, unknown>).notification) {
            this.logger.info('Notification Sended')
          }

          return res.status(201).json({
            message: 'Progress Updated Successfully',
            response: {
              id: (progress as unknown as { id: number }).id,
              ...transaction as unknown as Record<string, unknown>,
              feedback: requiresFeedback
            },
            statusCode: 201
          })
        }
      }

      throw new NotFoundException('Resource Not Found, Must Be Key or Progress')
    }
    throw new NotFoundException('Resource Not Found, Must Be Key or Progress')
  }

  @Bind
  async patchOne(req: Request, res: Response) {
    const name = req.query.category as string

    const category = await this.categoryService.getOne({
      name: decodeURIComponent(name)
    })

    if (category) {
      const progress = await this.progressService.getOne({
        id: req.query.id,
        userId: req.user!.id
      })

      if (progress) {
        const data = (progress as unknown as { data: Record<string, unknown> }).data

        data[category.name] = this.structure[category.name as keyof ProgressStructure]

        await this.progressService.updateOne({
          id: (progress as unknown as { id: number }).id,
          data
        })

        return res.status(201).json({
          message: 'Patch Completed',
          response: data,
          statusCode: 201
        })
      }

      throw new NotFoundException('Progress Not Found')
    }

    throw new NotFoundException('Category Not Found')
  }
}

export { ProgressController }
