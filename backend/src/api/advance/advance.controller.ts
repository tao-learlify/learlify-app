import { AdvanceService } from './advance.service'
import { PlansService } from 'api/plans/plans.service'
import { PackagesService } from 'api/packages/packages.service'
import { NotFoundException, ForbiddenException } from 'exceptions'
import { Logger } from 'api/logger'
import { Bind } from 'decorators'
import feature from 'api/access/access.features'
import type { Request, Response } from 'express'

const MAX_COURSE_UNITS = 15

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

  @Bind
  async create(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const data = req.body
    this.logger.info(`[advance] POST create — userId=${user.id} body=${JSON.stringify(data)}`)

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

  @Bind
  async getAll(req: Request, res: Response): Promise<Response> {
    const user = req.user!
    const courseId = parseInt(req.query.courseId as string, 10)
    this.logger.info(`[advance] GET getAll — userId=${user.id} courseId=${courseId}`)

    const [advance, isSubscribed] = await Promise.all([
      this.advanceService.getOne({ courseId, userId: user.id }),
      this.packagesService.getSubscriptions(
        { isActive: true, userId: user.id },
        [feature.COURSES]
      )
    ])

    const unlockedUnits: number[] = isSubscribed
      ? Array.from({ length: MAX_COURSE_UNITS }, (_, i) => i + 1)
      : [1]

    if (advance) {
      return res.status(200).json({
        message: 'Advance obtained succesfully',
        response: { ...advance, unlockedUnits },
        statusCode: 200
      })
    }

    // No advance record yet — return minimal response so frontend can render the path
    return res.status(200).json({
      message: 'Advance obtained succesfully',
      response: { unlockedUnits },
      statusCode: 200
    })
  }

  @Bind
  async getByUnit(req: Request, res: Response): Promise<Response> {
    const user = req.user!
    const unitId = parseInt(req.params.unitId, 10)
    const courseId = parseInt(req.query.courseId as string, 10)

    const [advance, isSubscribed] = await Promise.all([
      this.advanceService.getOne({ courseId, userId: user.id }),
      this.packagesService.getSubscriptions(
        { isActive: true, userId: user.id },
        [feature.COURSES]
      )
    ])

    const isUnlocked = isSubscribed || unitId === 1
    if (!isUnlocked) {
      throw new ForbiddenException()
    }

    const unitProgress = advance?.content
      ? (advance.content as Record<string, unknown>)[String(unitId)] ?? null
      : null

    return res.status(200).json({
      message: 'Unit advance obtained successfully',
      response: { unitId, courseId, progress: unitProgress },
      statusCode: 200
    })
  }

  @Bind
  async updateOne(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const data = req.body
    this.logger.info(`[advance] PUT updateOne — userId=${user.id} body=${JSON.stringify(data)}`)

    // Enforce paywall at write time: non-subscribers can only update unit 1
    const isSubscribed = await this.packagesService.getSubscriptions(
      { isActive: true, userId: user.id },
      [feature.COURSES]
    )

    if (!isSubscribed && Number(data.unit) > 1) {
      throw new ForbiddenException()
    }

    const advance = await this.advanceService.getOne({
      courseId: data.courseId,
      userId: user.id
    })

    this.logger.info(`[advance] PUT updateOne — advanceFound=${!!advance} isSubscribed=${!!isSubscribed}`)

    if (advance) {
      const { content } = advance
      const existingUnit = content[data.unit] as Record<string, unknown> | undefined

      // Build the new unit entry, preserving any existing v2 block-level progress.
      // v2 from the request body takes precedence; fall back to whatever was saved.
      const incomingV2 = (data as Record<string, unknown>).v2 ?? existingUnit?.v2 ?? undefined

      const newUnitEntry: Record<string, unknown> = {
        completed: data.completed
          ? (existingUnit?.completed ? true : data.completed)
          : (existingUnit?.completed ?? false),
        general: data.last,
        last: true,
        ...(incomingV2 !== undefined ? { v2: incomingV2 } : {})
      }

      Object.assign(content, { [data.unit]: newUnitEntry })

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

    this.logger.warn(`[advance] PUT updateOne — no advance record for userId=${user.id} courseId=${data.courseId}, throwing NotFoundException`)
    throw new NotFoundException(res.__('errors.Advance Not Found'))
  }
}
