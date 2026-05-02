import request from 'superagent'
import type { GetChannelVideosParams } from './youtube.types'

class YoutubeService {
  private channelId: string

  constructor() {
    this.channelId = 'UCNlCF9dH_nGvpap6ROdlQuQ'
  }

  async getChannelVideos({ items }: GetChannelVideosParams): Promise<unknown> {
    return new Promise((resolve, reject) => {
      request
        .get('https://www.googleapis.com/youtube/v3/search')
        .query({
          channelId: this.channelId,
          key: process.env.GOOGLE_API_KEY,
          maxResults: items ?? 10,
          order: 'date',
          part: 'snippet,id'
        })
        .end((err, res) => {
          if (err) {
            return reject(err)
          }

          return resolve(
            JSON.parse(res?.text ?? '{}')
          )
        })
    })
  }
}

export { YoutubeService }
