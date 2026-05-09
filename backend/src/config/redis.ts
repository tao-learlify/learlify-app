import Redis from 'ioredis'
import logger from 'utils/logger'

let client: Redis | null = null

function createRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    return null
  }

  const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy(times): number | null {
      if (times >= 5) {
        logger.warn('redis.retries.exhausted')
        return null
      }
      return Math.min(times * 500, 3000)
    }
  })

  redis.on('connect', () => logger.info('redis.connect'))
  redis.on('error', err =>
    logger.error('redis.error', { message: err.message })
  )
  redis.on('close', () => logger.warn('redis.close'))

  redis
    .connect()
    .catch(err =>
      logger.error('redis.connect.failed', { message: err.message })
    )

  return redis
}

function getRedisClient(): Redis | null {
  if (client === null) {
    client = createRedisClient()
  }
  return client
}

async function closeRedisClient(): Promise<void> {
  if (client) {
    await client.quit()
    client = null
  }
}

export { getRedisClient, closeRedisClient }
