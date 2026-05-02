import { checkSchema, Schema } from 'express-validator'

class NotificationsPipe {
  get create(): ReturnType<typeof checkSchema> {
    return checkSchema({
      senderId: { in: ['body'], isInt: true, toInt: true, optional: true },
      userId: { in: ['body'], isInt: true, toInt: true },
      message: { in: ['body'], optional: true },
      read: { in: ['body'], isBoolean: true, toBoolean: true, optional: true },
      deleted: { in: ['body'], isBoolean: true, toBoolean: true, optional: true },
      type: { in: ['body'], isInt: true, toInt: true }
    } as Schema)
  }

  get getAll(): ReturnType<typeof checkSchema> {
    return checkSchema({
      unreads: { in: ['query'], isBoolean: true, toBoolean: true, optional: true },
      page: { in: ['query'], isInt: true, toInt: true, optional: true }
    } as Schema)
  }

  get getOne(): ReturnType<typeof checkSchema> {
    return checkSchema({} as Schema)
  }

  get updateOne(): ReturnType<typeof checkSchema> {
    return checkSchema({
      read: { in: ['body'], toBoolean: true, isBoolean: true },
      id: { in: ['params'], isInt: true }
    } as Schema)
  }
}

export const pipe = new NotificationsPipe()
