import { Logger } from 'api/logger'
import validator from 'validator'
import type { Request, Response, NextFunction } from 'express'

export const updateProgressValidationJSON = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.files) {
    try {
      Logger.Service.info('progress', req.body.files)

      const context = JSON.parse(req.body.files)

      const validations = [
        validator.isNumeric(context.id.toString()),
        validator.isNumeric(context.lastIndex.toString()),
        validator.isNumeric(context.score.toString()),
        validator.isUUID(context.uuid),
      ]

      if (context.feedback) {
        validations.push(typeof context.feedback === 'object')
      }

      if (validations.every(valid => valid)) {
        Object.assign(req.body, context)

        return next()
      } else {
        throw new Error()
      }
    } catch (err) {
      Logger.Service.error('error', err)

      return res.status(400).json({
        message: (err as Error).message,
        statusCode: 400
      })
    }
  }

  return next()
}
