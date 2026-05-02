import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Logger } from 'api/logger'
import { Router } from 'decorators'
import { isRunningOnProductionOrDevelopment } from 'functions'
import { Middleware } from 'middlewares'
import { GiftsController } from './gifts.controller'
import { pipe } from './gifts.pipe'

@Router({
  alias: 'gifts',
  route: '/gifts'
})
class GiftsRouter {
  declare gifts: ExpressRouter
  declare consumer: HttpConsumer
  private controller: GiftsController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new GiftsController()
    this.logger = Logger.Service
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /gifts')
    }

    this.gifts.post(
      '/',
      [Middleware.authenticate, pipe.create, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.create) as RequestHandler
    )

    this.gifts.put(
      '/',
      [Middleware.authenticate, pipe.exchange, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.exchangeGift) as RequestHandler
    )

    return this.consumer
  }
}

export default new GiftsRouter().httpConsumer()
