import { checkSchema } from 'express-validator'

export class AWSPipe {
  get getFile(): ReturnType<typeof checkSchema> {
    return checkSchema({
      filename: {
        in: 'query',
        isString: true
      },
      bucket: {
        in: 'query',
        isString: true,
        optional: true
      },
      key: {
        in: 'query',
        isString: true
      }
    })
  }

  get upload(): ReturnType<typeof checkSchema> {
    return checkSchema({
      feedback: {
        in: 'query',
        toBoolean: true,
        isBoolean: true
      },
      progress: {
        in: 'body',
        optional: true
      }
    })
  }
}

export const pipe = new AWSPipe()
