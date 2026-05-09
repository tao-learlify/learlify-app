import { checkSchema, Schema } from 'express-validator'

class SubscriptionsPipe {
  get create(): ReturnType<typeof checkSchema> {
    return checkSchema({
      planPriceId: { in: ['body'], isInt: true, toInt: true },
      paymentMethodId: { in: ['body'], isString: true, notEmpty: true },
      stripeToken: { in: ['body'], isString: true, optional: true },
      idempotencyKey: { in: ['body'], isString: true, notEmpty: true }
    } as Schema)
  }

  get cancel(): ReturnType<typeof checkSchema> {
    return checkSchema({
      id: { in: ['params'], isInt: true, toInt: true },
      immediately: { in: ['body'], isBoolean: true, optional: true }
    } as Schema)
  }
}

export const pipe = new SubscriptionsPipe()
