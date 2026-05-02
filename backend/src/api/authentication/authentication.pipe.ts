import { checkSchema, ValidationChain } from 'express-validator'
import { ConfigService } from 'api/config/config.service'

class Auth {
  private configService: ConfigService

  constructor() {
    this.configService = new ConfigService()
  }

  get signUp(): ValidationChain[] {
    const { nameOptions } = this.configService

    return checkSchema({
      email: {
        in: 'body',
        isEmail: true,
        isLength: { options: nameOptions }
      },
      firstName: {
        in: 'body',
        isString: true,
        isLength: { options: nameOptions }
      },
      lastName: {
        in: 'body',
        isString: true,
        isLength: { options: nameOptions }
      },
      password: {
        in: 'body',
        isString: true,
        isLength: { options: nameOptions }
      }
    })
  }

  get signIn(): ValidationChain[] {
    const { passwordOptions } = this.configService

    return checkSchema({
      email: {
        in: 'body',
        errorMessage: 'Email is required',
        isEmail: true
      },
      password: {
        in: 'body',
        errorMessage: 'Password is required',
        isString: true,
        isLength: { options: passwordOptions }
      }
    })
  }

  get googleLogin(): ValidationChain[] {
    const { nameOptions } = this.configService

    return checkSchema({
      givenName: {
        in: 'body',
        errorMessage: 'givenName is required',
        isString: true,
        isLength: { options: nameOptions }
      },
      familyName: {
        in: 'body',
        errorMessage: 'familyName is required',
        isString: true,
        isLength: { options: nameOptions },
        optional: true
      },
      googleId: {
        in: 'body',
        errorMessage: 'googleId is required',
        isString: true
      },
      imageUrl: {
        in: 'body',
        errorMessage: 'imageUrl should be a valid string',
        isString: true,
        optional: true
      }
    })
  }

  get facebookLogin(): ValidationChain[] {
    const { nameOptions } = this.configService

    return checkSchema({
      givenName: {
        in: 'body',
        errorMessage: 'givenName is required',
        isString: true,
        isLength: { options: nameOptions }
      },
      familyName: {
        in: 'body',
        errorMessage: 'familyName is required',
        isString: true,
        isLength: { options: nameOptions },
        optional: true
      },
      facebookId: {
        in: 'body',
        errorMessage: 'facebookId is required',
        isString: true
      },
      imageUrl: {
        in: 'body',
        errorMessage: 'imageUrl should be a valid string',
        isString: true,
        optional: true
      }
    })
  }

  get verifiy(): ValidationChain[] {
    return checkSchema({
      code: {
        in: 'query',
        errorMessage: 'Code is required',
        isString: true
      }
    })
  }

  get forgot(): ValidationChain[] {
    return checkSchema({
      email: {
        in: 'query',
        errorMessage: 'Email is required',
        isEmail: true
      }
    })
  }

  get refresh(): ValidationChain[] {
    return checkSchema({
      token: {
        in: 'body',
        errorMessage: 'Token is required',
        isString: true
      }
    })
  }

  get reset(): ValidationChain[] {
    const { passwordOptions } = this.configService

    return checkSchema({
      code: {
        in: 'body',
        isJWT: true
      },
      password: {
        in: 'body',
        errorMessage: 'Password is required',
        isString: true,
        isLength: { options: passwordOptions }
      }
    })
  }
}

export const pipe = new Auth()
