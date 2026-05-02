import { YoutubeService } from './youtube.service'
import type { Request, Response } from 'express'

class YoutubeController {
  private youtubeService: YoutubeService

  constructor() {
    this.youtubeService = new YoutubeService()
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    return res.json({
      statusCode: 404
    })
  }
}

export { YoutubeController }
