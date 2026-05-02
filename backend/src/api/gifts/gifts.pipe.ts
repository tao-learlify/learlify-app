import { checkSchema } from 'express-validator'
import type { ValidationChain } from 'express-validator'

class Gifts {
  get create(): ValidationChain[] {
    return checkSchema({
      paymentMethod: {
        in: 'body',
        isString: true
      },
      planId: {
        in: 'query',
        isString: true,
        toInt: true
      },
      email: {
        in: 'body',
        isEmail: true
      },
      requiresAction: {
        in: 'body',
        isBoolean: true
      }
    }) as unknown as ValidationChain[]
  }

  get exchange(): ValidationChain[] {
    return checkSchema({
      code: {
        errorMessage: 'code is required',
        in: 'query',
        isString: true
      }
    }) as unknown as ValidationChain[]
  }
}

export const pipe = new Gifts()
