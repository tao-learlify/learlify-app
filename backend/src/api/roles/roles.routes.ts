import type { Router as ExpressRouter, RequestHandler } from 'express'
import type { HttpConsumer } from '@types'
import { Router } from 'decorators'
import { Logger } from 'api/logger'
import { Middleware } from 'middlewares'
import { Roles as Rol } from 'metadata/roles'
import { RolesController } from './roles.controller'
import { isRunningOnProductionOrDevelopment } from 'functions'

@Router({
  alias: 'roles',
  route: '/roles'
})
class Roles {
  declare roles: ExpressRouter
  declare consumer: HttpConsumer
  private controller: RolesController
  private logger: typeof Logger.Service

  constructor() {
    this.controller = new RolesController()
    this.logger = Logger.Service
  }

  httpConsumer(): HttpConsumer {
    if (isRunningOnProductionOrDevelopment()) {
      this.logger.info('http: /roles')
    }

    this.roles.get(
      '/',
      [Middleware.authenticate, Middleware.RolesGuard([Rol.Admin])] as RequestHandler[],
      this.controller.getAll
    )

    return this.consumer
  }
}

export default new Roles().httpConsumer()
