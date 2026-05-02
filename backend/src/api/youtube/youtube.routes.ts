import { Router } from 'express'
import { Middleware } from 'middlewares'
import { pipe } from './youtube.pipe'
import { YoutubeController } from './youtube.controller'
import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'

class YoutubeRouter {
  private provider: ExpressRouter
  private controller: YoutubeController

  constructor() {
    this.provider = Router()
    this.controller = new YoutubeController()
  }

  httpConsumer(): HttpConsumer {
    this.provider.get(
      '/',
      [Middleware.authenticate, pipe.getAll, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.getAll) as RequestHandler
    )

    return {
      route: '/youtube',
      handlers: this.provider
    }
  }
}

export default new YoutubeRouter().httpConsumer()
