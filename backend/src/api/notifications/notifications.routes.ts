import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Router } from 'decorators'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { NotificationsController } from './notifications.controller'
import { pipe } from './notifications.pipe'
import { isRunningOnProductionOrDevelopment } from 'functions'
import { Roles } from 'metadata/roles'
import { OWNER } from 'metadata/owners'

@Router({
  alias: 'notifications',
  route: '/notifications'
})
class NotificationsRouter {
  declare notifications: ExpressRouter
  declare consumer: HttpConsumer
  private controller: NotificationsController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new NotificationsController()
    this.logger = Logger.Service
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /notifications')
    }

    this.notifications.post(
      '/',
      [
        Middleware.authenticate,
        Middleware.RolesGuard([Roles.Admin]),
        pipe.create,
        Middleware.usePipe
      ] as RequestHandler[],
      Middleware.secure(this.controller.create)
    )

    this.notifications.get(
      '/all',
      [Middleware.authenticate, pipe.getAll, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.getAll)
    )

    this.notifications.get(
      '/:id',
      [
        Middleware.authenticate,
        Middleware.isResourceOwner({ context: OWNER.NOTIFICATION }),
        pipe.getOne,
        Middleware.usePipe
      ] as RequestHandler[],
      Middleware.secure(this.controller.getOne)
    )

    this.notifications.put(
      '/:id',
      [
        Middleware.authenticate,
        Middleware.isResourceOwner({ context: OWNER.NOTIFICATION }),
        pipe.updateOne,
        Middleware.usePipe
      ] as RequestHandler[],
      Middleware.secure(this.controller.updateOne)
    )

    this.notifications.put(
      '/all',
      [Middleware.authenticate, pipe.getAll, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.markAllAsRead)
    )

    this.notifications.delete(
      '/',
      [
        Middleware.authenticate,
        Middleware.RolesGuard([Roles.Admin])
      ] as RequestHandler[],
      Middleware.secure(this.controller.deleteExpired)
    )

    return this.consumer
  }
}

export default new NotificationsRouter().httpConsumer()
