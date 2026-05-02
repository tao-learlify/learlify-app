import type { Request, Response } from 'express'
import { Bind } from 'decorators'
import { RolesService } from './roles.services'

export class RolesController {
  private rolesService: RolesService

  constructor() {
    this.rolesService = new RolesService()
  }

  @Bind
  async getAll(_req: Request, res: Response): Promise<Response> {
    const roles = await this.rolesService.getAll()

    return res.status(200).json({
      message: 'Roles obtained succesfully',
      response: roles,
      statusCode: 200
    })
  }
}
