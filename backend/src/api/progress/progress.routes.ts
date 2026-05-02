import { Router } from 'express'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { ProgressController } from './progress.controller'
import { pipe } from './progress.pipe'
import { isRunningOnProductionOrDevelopment } from 'functions'
import { updateProgressValidationJSON } from './progress.validation'
import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'

class ProgressRouter {
  private progress: ExpressRouter
  private logger: typeof Logger.Service
  private controller: ProgressController

  constructor() {
    this.progress = Router()
    this.logger = Logger.Service
    this.controller = new ProgressController()
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /progress')
    }

    this.progress.get(
      '/',
      [
        Middleware.authenticate,
        pipe.getOne,
        Middleware.usePipe,
        Middleware.noDemoReferrer
      ] as RequestHandler[],
      Middleware.secure(this.controller.getOne) as RequestHandler
    )

    this.progress.post(
      '/',
      [Middleware.authenticate, pipe.create, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.create) as RequestHandler
    )

    this.progress.put(
      '/',
      [
        Middleware.authenticate,
        Middleware.noDemoReferrer,
        Middleware.memoryStorage,
        updateProgressValidationJSON
      ] as RequestHandler[],
      Middleware.secure(this.controller.updateOne) as RequestHandler
    )

    this.progress.patch(
      '/',
      [
        Middleware.authenticate,
        pipe.patchOne,
        Middleware.usePipe,
        Middleware.noDemoReferrer
      ] as RequestHandler[],
      Middleware.secure(this.controller.patchOne) as RequestHandler
    )

    return {
      route: '/progress',
      handlers: this.progress
    }
  }
}

export default new ProgressRouter().httpConsumer()
