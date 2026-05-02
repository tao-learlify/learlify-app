import { Router } from 'express'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { AWSController } from './aws.controller'
import { AmazonWebServices } from './aws.service'
import { pipe } from './aws.pipe'
import { MODE } from 'common/process'
import { isRunningOnProductionOrDevelopment } from 'functions'
import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import type { AWSControllerOptions } from './aws.types'

class AWSRouter {
  private aws: ExpressRouter
  private options: AWSControllerOptions
  private controller: AWSController
  private fileInterceptor: AmazonWebServices['fileInterceptor']
  private logger: typeof Logger.Service

  constructor() {
    this.aws = Router()
    this.options = {
      bucket:
        process.env.NODE_ENV === MODE.development
          ? 'aptispruebas'
          : 'aptisgo/speakings'
    }
    this.controller = new AWSController({ bucket: this.options.bucket })
    this.fileInterceptor = new AmazonWebServices().fileInterceptor
    this.logger = Logger.Service
    this.httpConsumer = this.httpConsumer.bind(this)
  }

  httpConsumer(): HttpConsumer {
    const { bucket } = this.options

    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /aws')
    }

    this.aws.get(
      '/',
      [Middleware.authenticate, pipe.getFile, Middleware.usePipe] as RequestHandler[],
      Middleware.secure(this.controller.getFile) as RequestHandler
    )

    this.aws.post(
      '/upload',
      [
        Middleware.authenticate,
        pipe.upload,
        Middleware.usePipe,
        this.fileInterceptor({ bucket })
      ] as RequestHandler[],
      Middleware.secure(this.controller.uploadSpeaking) as RequestHandler
    )

    return {
      route: '/aws',
      handlers: this.aws
    }
  }
}

export default new AWSRouter().httpConsumer()
