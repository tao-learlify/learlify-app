import { Router as ExpressRouter, RequestHandler } from 'express'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { ReportController } from './report.controller'
import { pipe } from './report.pipe'
import { isRunningOnProductionOrDevelopment } from 'functions'
import type { HttpConsumer } from '@types'

class ReportRouter {
  private controller: ReportController
  private logger: typeof Logger.Service
  private report: ExpressRouter

  constructor() {
    this.controller = new ReportController()
    this.logger = Logger.Service
    this.report = ExpressRouter()
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /report')
    }

    this.report.post(
      '/',
      [Middleware.authenticate, ...pipe.create, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.create) as RequestHandler
    )

    this.report.post(
      '/quality',
      [Middleware.authenticate, ...pipe.quality, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.quality) as RequestHandler
    )

    return {
      route: '/report',
      handlers: this.report
    }
  }
}

export default new ReportRouter().httpConsumer()
