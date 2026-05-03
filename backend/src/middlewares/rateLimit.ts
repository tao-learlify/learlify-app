import rateLimit from 'express-rate-limit'
import root from 'config/root'

const isDev = process.env.NODE_ENV === 'development'

export const globalLimiter = rateLimit({
  windowMs: isDev ? 1000 : root.limitRequest.windowMs,
  max: isDev ? 1000 : root.limitRequest.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: root.limitRequest.message, statusCode: 429 }
})

export const authLimiter = rateLimit({
  windowMs: isDev ? 1000 : root.limitRequest.windowMs,
  max: isDev ? 100 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: root.limitRequest.message, statusCode: 429 }
})
