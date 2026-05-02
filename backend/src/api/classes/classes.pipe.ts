import { checkSchema, Schema } from 'express-validator'

class ClassesPipe {
  get create(): ReturnType<typeof checkSchema> {
    return checkSchema({
      scheduleId: {
        in: ['body'],
        isNumeric: true
      },
      packageId: {
        in: ['body'],
        isNumeric: true
      },
      indications: {
        in: ['body'],
        isJSON: true
      }
    } as Schema)
  }

  get getOne(): ReturnType<typeof checkSchema> {
    return checkSchema({
      name: {
        in: ['query'],
        isString: true
      },
      info: {
        in: ['query'],
        isBoolean: true,
        optional: true
      }
    } as Schema)
  }
}

export const pipe = new ClassesPipe()
