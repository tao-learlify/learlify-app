import rateLimit from 'express-rate-limit'
import type { RequestHandler } from 'express'
import root from 'config/root'

const isDev = process.env.NODE_ENV === 'development'

const skipDev: RequestHandler = (_req, _res, next) => next()

export const globalLimiter = isDev
  ? skipDev
  : rateLimit({
      windowMs: root.limitRequest.windowMs,
      max: root.limitRequest.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: root.limitRequest.message, statusCode: 429 }
    })

export const authLimiter = isDev
  ? skipDev
  : rateLimit({
      windowMs: root.limitRequest.windowMs,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: root.limitRequest.message, statusCode: 429 }
    })
