import type { Request, Response, NextFunction } from 'express'
import type { Logger as WinstonLogger } from 'winston'
import { Bind } from 'decorators'
import { ModelsService } from './models.service'
import { NotFoundException } from 'exceptions'
import { UsersService } from 'api/users/users.service'
import { Logger } from 'api/logger'
import { AuthenticationService } from 'api/authentication/authentication.service'
import demo from 'metadata/demo'

class ModelsController {
  private auth: AuthenticationService
  private models: ModelsService
  private users: UsersService
  private logger: WinstonLogger

  constructor() {
    this.auth = new AuthenticationService()
    this.models = new ModelsService()
    this.users = new UsersService() as unknown as UsersService
    this.logger = Logger.Service
  }

  @Bind
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    if (req.query?.name) {
      return next()
    }

    const models = await this.models.getAll()

    return res.json({
      response: models,
      statusCode: 200
    })
  }

  @Bind
  async getOne(req: Request, res: Response): Promise<Response> {
    const model = await this.models.getOne({
      name: req.query.name as string
    })

    if (model) {
      return res.json({
        response: model,
        statusCode: 200
      })
    }

    throw new NotFoundException('Model Not Found')
  }

  @Bind
  async patch(req: Request, res: Response): Promise<Response> {
    const { name } = req.query as { name: string }

    const model = await this.models.getOne({ name })

    if ((demo as unknown as { isDemoUser(email: string): boolean }).isDemoUser(req.user!.email)) {
      return res.status(200).json({
        response: {
          token: (this.auth as unknown as {
            encrypt(payload: unknown, opts: unknown): string
          }).encrypt(
            { ...req.user, isVerified: true, model },
            { clientConfig: true }
          )
        },
        statusCode: 200
      })
    }

    if (model) {
      const update = await (this.users as unknown as {
        updateOne(data: { id: number; modelId: number }): Promise<{ email: string }>
      }).updateOne({
        id: req.user!.id,
        modelId: model.id
      })

      this.logger.info(`model ${model.name}`)
      this.logger.info(`update ${update.email}`)

      return res.status(200).json({
        response: {
          token: (this.auth as unknown as {
            encrypt(payload: unknown, opts: unknown): string
          }).encrypt({ ...req.user, model }, { clientConfig: true })
        },
        statusCode: 200
      })
    }

    throw new NotFoundException('Model Not Found')
  }
}

export { ModelsController }
