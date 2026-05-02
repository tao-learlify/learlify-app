import type { Request, Response } from 'express'
import { Bind } from 'decorators'
import { LanguageService } from './languages.services'

class LanguageController {
  private languagesService: LanguageService

  constructor() {
    this.languagesService = new LanguageService()
  }

  @Bind
  async getAll(_req: Request, res: Response): Promise<Response> {
    const languages = await this.languagesService.getAll()

    return res.status(200).json({
      message: 'Languages obtained succesfully',
      response: languages,
      statusCode: 200
    })
  }
}

export { LanguageController }
