import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Router } from 'decorators'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { SubscriptionsController } from './subscriptions.controller'
import { pipe } from './subscriptions.pipe'
import { isRunningOnProductionOrDevelopment } from 'functions'

@Router({
  alias: 'subscriptions',
  route: '/subscriptions'
})
class SubscriptionsRouter {
  declare subscriptions: ExpressRouter
  declare consumer: HttpConsumer
  private controller: SubscriptionsController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new SubscriptionsController()
    this.logger = Logger.Service
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /subscriptions')
    }

    this.subscriptions.get(
      '/',
      [Middleware.authenticate] as RequestHandler[],
      Middleware.secure(this.controller.getAll)
    )

    this.subscriptions.post(
      '/',
      [
        Middleware.authenticate,
        Middleware.noDemoReferrer,
        Middleware.LanguageGuard,
        pipe.create,
        Middleware.usePipe
      ] as RequestHandler[],
      Middleware.secure(this.controller.create)
    )

    this.subscriptions.delete(
      '/:id',
      [
        Middleware.authenticate,
        Middleware.noDemoReferrer,
        pipe.cancel,
        Middleware.usePipe
      ] as RequestHandler[],
      Middleware.secure(this.controller.cancel)
    )

    return this.consumer
  }
}

export default new SubscriptionsRouter().httpConsumer()
