import type { Request, Response } from 'express'
import { Bind } from 'decorators'
import { NotificationsService } from './notifications.service'
import { NotFoundException } from 'exceptions'
import { createPaginationStack } from 'functions'
import type {
  NotificationData,
  UpdateNotificationData
} from './notifications.types'

export class NotificationsController {
  private notificationsService: NotificationsService

  constructor() {
    this.notificationsService = new NotificationsService()
  }

  @Bind
  async create(req: Request, res: Response): Promise<Response> {
    const { senderId, userId, message, read, deleted, type } = req.body as NotificationData

    const notification = await this.notificationsService.create({
      senderId,
      userId,
      message,
      read,
      deleted,
      type
    })

    return res.status(200).json({
      message: 'Notification created succesfully',
      response: notification,
      statusCode: 201
    })
  }

  @Bind
  async getAll(req: Request, res: Response): Promise<Response> {
    const notifications = await this.notificationsService.getAll({
      userId: req.user!.id,
      page: req.query.page as unknown as number
    })

    if (req.query.page) {
      const paged = notifications as unknown as { results: unknown[]; total: number }
      return res.status(200).json({
        message: 'Notifications obtained successfully',
        response: { notifications: paged.results },
        pagination: createPaginationStack({
          limit: 10,
          page: Number(req.query.page),
          total: paged.total
        }),
        statusCode: 200
      })
    }

    if (req.query.unreads) {
      const [unreads] = await this.notificationsService.getAll({
        userId: req.user!.id,
        unreads: true
      }) as unknown as Array<{ total: number } | undefined>

      const unreadNotifications = await this.notificationsService.getAll({
        read: false,
        userId: req.user!.id,
        page: req.query.page as unknown as number
      })

      return res.status(200).json({
        message: 'Notifications obtained succesfully',
        response: {
          notifications: unreadNotifications,
          unreads: unreads?.total ?? 0
        },
        statusCode: 200
      })
    }

    return res.status(200).json({
      message: 'Notifications obtained succesfully',
      response: notifications,
      statusCode: 200
    })
  }

  @Bind
  async getOne(req: Request, res: Response): Promise<Response> {
    const notification = await this.notificationsService.getOne(req.params.id)

    if (notification) {
      return res.status(200).json({
        message: 'Notification obtained successfully',
        response: notification,
        statusCode: 200
      })
    }

    throw new NotFoundException('Notification Not Found')
  }

  @Bind
  async updateOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const data = req.body as UpdateNotificationData

    const updated = await this.notificationsService.updateOne(id, data)

    return res.status(200).json({
      message: 'Notification updated succesfully',
      response: updated,
      statusCode: 200
    })
  }

  @Bind
  async markAllAsRead(req: Request, res: Response): Promise<Response> {
    const notifications = await this.notificationsService.updateAllAsRead({
      userId: req.user!.id
    })

    return res.status(201).json({
      response: notifications,
      statusCode: 201
    })
  }

  @Bind
  async deleteExpired(_req: Request, res: Response): Promise<Response> {
    const numDeleted = await this.notificationsService.deleteExpired()

    return res.status(200).json({
      message: 'Expired notifications deleted successfully',
      response: numDeleted,
      statusCode: 200
    })
  }
}
