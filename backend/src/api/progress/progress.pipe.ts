import { checkSchema } from 'express-validator'

export class ProgressPipe {
  get create(): ReturnType<typeof checkSchema> {
    return checkSchema({
      examId: {
        in: 'body',
        isNumeric: true,
        toInt: true
      },
      data: {
        in: 'body'
      }
    })
  }

  get getOne(): ReturnType<typeof checkSchema> {
    return checkSchema({
      examId: {
        in: 'query',
        isInt: true,
        toInt: true
      }
    })
  }

  get updateOne(): ReturnType<typeof checkSchema> {
    return checkSchema({
      feedback: {
        in: 'body',
        optional: true
      },
      key: {
        in: 'body',
        isString: true,
        optional: true
      },
      lastIndex: {
        in: 'body',
        isNumeric: true,
        optional: true
      },
      id: {
        isNumeric: true,
        in: 'body',
        toInt: true,
        optional: true
      },
      score: {
        in: 'body',
        isNumeric: true,
        optional: true
      },
      uuid: {
        in: 'body',
        isUUID: true,
        optional: true
      },
      recordings: {
        in: 'body',
        optional: true
      }
    })
  }

  get patchOne(): ReturnType<typeof checkSchema> {
    return checkSchema({
      category: {
        in: 'query',
        isString: true
      },

      id: {
        in: 'query',
        isNumeric: true,
        toInt: true
      }
    })
  }
}

export const pipe = new ProgressPipe()
