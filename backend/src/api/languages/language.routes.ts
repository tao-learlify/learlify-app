import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Router } from 'decorators'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { LanguageController } from './language.controller'
import { isRunningOnProductionOrDevelopment } from 'functions'

@Router({
  alias: 'languages',
  route: '/languages'
})
class LanguagesRouter {
  declare languages: ExpressRouter
  declare consumer: HttpConsumer
  private controller: LanguageController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new LanguageController()
    this.logger = Logger.Service
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /languages')
    }

    this.languages.get(
      '/',
      [Middleware.authenticate] as RequestHandler[],
      Middleware.secure(this.controller.getAll)
    )

    return this.consumer
  }
}

export default new LanguagesRouter().httpConsumer()
