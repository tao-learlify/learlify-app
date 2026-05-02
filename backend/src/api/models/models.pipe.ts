import { checkSchema, Schema } from 'express-validator'

class ModelsPipe {
  get getOne(): ReturnType<typeof checkSchema> {
    return checkSchema({
      name: {
        in: 'query',
        isString: true,
        optional: true
      }
    } as Schema)
  }

  get patch(): ReturnType<typeof checkSchema> {
    return checkSchema({
      name: {
        in: 'query',
        isString: true
      }
    } as Schema)
  }
}

export const pipe = new ModelsPipe()
