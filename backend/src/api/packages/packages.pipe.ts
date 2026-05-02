import { checkSchema, Schema } from 'express-validator'

class PackagesPipe {
  get assign(): ReturnType<typeof checkSchema> {
    return checkSchema({
      userId: { in: ['query'], toInt: true, isNumeric: true },
      planId: { in: ['query'], toInt: true, isNumeric: true }
    } as Schema)
  }

  get create(): ReturnType<typeof checkSchema> {
    return checkSchema({
      planId: { in: ['query'], toInt: true, isNumeric: true },
      paymentMethodId: { in: ['body'], isString: true },
      requiresAction: { in: ['body'], isBoolean: true, optional: true },
      cancel: { in: ['body'], isBoolean: true, optional: true }
    } as Schema)
  }

  get update(): ReturnType<typeof checkSchema> {
    return checkSchema({
      category: { isString: true, in: ['query'], isNumeric: true },
      type: { isString: true, in: ['query'], isNumeric: true },
      progress: { in: ['body'] },
      needsRevision: { in: ['body'], isBoolean: true },
      activePackage: { in: ['body'], optional: false }
    } as Schema)
  }

  get getAll(): ReturnType<typeof checkSchema> {
    return checkSchema({
      active: { in: ['query'], isBoolean: true, toBoolean: true }
    } as Schema)
  }
}

export const pipe = new PackagesPipe()
