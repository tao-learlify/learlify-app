import { checkSchema } from 'express-validator'

export class YoutubePipe {
  get getAll(): ReturnType<typeof checkSchema> {
    return checkSchema({
      items: {
        in: 'query',
        isNumeric: true,
        toInt: true,
        optional: true
      }
    })
  }
}

export const pipe = new YoutubePipe()
