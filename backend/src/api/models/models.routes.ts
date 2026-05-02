import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Bind, Router } from 'decorators'
import { Logger } from 'api/logger'
import { ModelsController } from './models.controller'
import { isRunningOnProductionOrDevelopment } from 'functions'
import { Middleware } from 'middlewares'
import { pipe } from './models.pipe'

@Router({
  alias: 'models',
  route: '/models'
})
class ModelsRouter {
  declare models: ExpressRouter
  declare consumer: HttpConsumer
  private controller: ModelsController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new ModelsController()
    this.logger = Logger.Service
  }

  @Bind
  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /models')
    }

    ;(this.models.get as unknown as (
      path: string,
      ...handlers: RequestHandler[]
    ) => void)(
      '/',
      ...[Middleware.authenticate, pipe.getOne, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.getAll) as unknown as RequestHandler,
      Middleware.secure(this.controller.getOne) as unknown as RequestHandler
    )

    this.models.patch(
      '/',
      [Middleware.authenticate, pipe.patch, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.patch)
    )

    return this.consumer
  }
}

const { httpConsumer } = new ModelsRouter()
const consumer = httpConsumer()
export default consumer
