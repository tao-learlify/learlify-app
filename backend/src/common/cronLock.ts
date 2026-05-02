import Redlock from 'redlock'
import { getRedisClient } from 'config/redis'
import logger from 'utils/logger'

let redlock: Redlock | null = null

function getRedlock(): Redlock | null {
  if (redlock) return redlock

  const client = getRedisClient()
  if (!client) return null

  redlock = new Redlock([client], {
    driftFactor: 0.01,
    retryCount: 0,
    retryDelay: 200,
    retryJitter: 0,
    automaticExtensionThreshold: 500
  })

  redlock.on('error', err => {
    if (err.message && err.message.includes('already exists')) return
    logger.error('redlock.error', { message: err.message })
  })

  return redlock
}

async function lockAndRun(
  key: string,
  ttlMs: number,
  fn: () => unknown | Promise<unknown>
): Promise<unknown | void> {
  const lock = getRedlock()

  if (!lock) {
    return fn()
  }

  let acquired: Awaited<ReturnType<Redlock['acquire']>> | null = null

  try {
    acquired = await lock.acquire([`lock:${key}`], ttlMs)
  } catch (_err) {
    logger.debug('cronLock.skipped', { key })
    return
  }

  try {
    await fn()
  } finally {
    try {
      await acquired.release()
    } catch (releaseErr: unknown) {
      const message =
        releaseErr instanceof Error ? releaseErr.message : String(releaseErr)

      logger.warn('cronLock.release.failed', {
        key,
        message
      })
    }
  }
}

export { lockAndRun }
