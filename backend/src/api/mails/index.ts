import { MODE } from 'common/process'

export const mailConfig = {
  email: process.env.SES_FROM_EMAIL || 'support@learlify.com',
  domain:
    process.env.NODE_ENV === MODE.development
      ? 'http://localhost:3000'
      : 'https://play.b1b2.top'
}
