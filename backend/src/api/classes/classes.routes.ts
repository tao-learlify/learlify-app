import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Logger } from 'api/logger'
import { Router } from 'decorators'
import { ClassesController } from './classes.controller'
import { Middleware } from 'middlewares'
import { pipe } from './classes.pipe'
import { isRunningOnProductionOrDevelopment } from 'functions'

@Router({
  alias: 'classes',
  route: '/classes'
})
class Classes {
  declare classes: ExpressRouter
  declare consumer: HttpConsumer
  private controller: ClassesController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new ClassesController()
    this.logger = Logger.Service
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /classes')
    }

    this.classes.post(
      '/',
      [
        Middleware.authenticate,
        Middleware.noDemoReferrer,
        pipe.create,
        Middleware.usePipe,
        Middleware.timezone
      ] as RequestHandler[],
      Middleware.secure(this.controller.create)
    )

    this.classes.get(
      '/',
      [
        Middleware.authenticate,
        pipe.getOne,
        Middleware.usePipe,
        Middleware.timezone
      ] as RequestHandler[],
      Middleware.secure(this.controller.getOne)
    )

    this.classes.get(
      '/confirmed',
      [Middleware.authenticate, Middleware.timezone],
      Middleware.secure(this.controller.getAll)
    )

    this.classes.get(
      '/history',
      [Middleware.authenticate, Middleware.timezone],
      Middleware.secure(this.controller.getAll)
    )

    return this.consumer
  }
}

export default new Classes().httpConsumer()
