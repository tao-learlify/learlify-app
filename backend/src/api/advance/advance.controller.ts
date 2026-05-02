import { AdvanceService } from './advance.service'
import { PlansService } from 'api/plans/plans.service'
import { PackagesService } from 'api/packages/packages.service'
import { NotFoundException, PaymentException } from 'exceptions'
import { Logger } from 'api/logger'
import feature from 'api/access/access.features'
import type { Request, Response } from 'express'

export class AdvanceController {
  private defaultContent: Record<string, unknown>
  private advanceService: AdvanceService
  private plansService: PlansService
  private packagesService: PackagesService
  private logger: typeof Logger.Service

  constructor() {
    this.defaultContent = {}
    this.advanceService = new AdvanceService()
    this.plansService = new PlansService()
    this.packagesService = new PackagesService()
    this.logger = Logger.Service
  }

  async create(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const data = req.body

    const advance = await this.advanceService.create({
      ...data,
      content: this.defaultContent,
      userId: user.id
    })

    return res.json({
      message: 'Advance has been created',
      response: advance,
      statusCode: 200
    })
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const advance = await this.advanceService.getOne({
      courseId: req.query.courseId as unknown as number,
      userId: user.id
    })

    const isSubscribed = await this.packagesService.getSubscriptions(
      {
        isActive: true,
        userId: user.id
      },
      [feature.COURSES]
    )

    if (isSubscribed) {
      if (advance) {
        return res.status(200).json({
          message: 'Advance obtained succesfully',
          response: advance,
          statusCode: 200
        })
      }

      throw new NotFoundException(res.__('errors.Advance Not Found'))
    }

    this.logger.warn('Requires Payment')

    throw new PaymentException()
  }

  async updateOne(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const data = req.body

    const advance = await this.advanceService.getOne({
      courseId: data.courseId,
      userId: user.id
    })

    if (advance) {
      const { content } = advance

      if (data.completed) {
        Object.assign(content, {
          [data.unit]: {
            completed: content[data.unit] && (content[data.unit] as Record<string, unknown>).completed ? true : data.completed,
            general: data.last,
            last: true
          }
        })
      } else {
        Object.assign(content, {
          [data.unit]: {
            completed: content[data.unit] ? (content[data.unit] as Record<string, unknown>).completed : false,
            general: data.last,
            last: true
          }
        })
      }

      Object.keys(content).forEach(key => {
        if (key !== data.unit.toString()) {
          Object.assign(content, {
            [key]: {
              ...(content[key] as Record<string, unknown>),
              last: false
            }
          })
        }
      })

      const update = await this.advanceService.updateOne({
        id: advance.id,
        content
      })

      return res.json({
        response: update,
        statusCode: 201
      })
    }

    throw new NotFoundException(res.__('errors.Advance Not Found'))
  }
}
