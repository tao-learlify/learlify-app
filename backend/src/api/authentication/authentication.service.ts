import { ConfigService } from 'api/config/config.service'
import { Logger } from 'api/logger'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import generator from 'generate-password'
import { Injectable } from 'decorators'
import type { EncryptConfig, DecryptResult, RandomPasswordResult } from './authentication.types'

type EncryptPayload = Record<string, unknown> & {
  password?: unknown
  googleId?: unknown
  facebookId?: unknown
  stripeCustomerId?: unknown
}

@Injectable
class AuthenticationService {
  private configService: ConfigService
  private logger = Logger.Service

  constructor() {
    this.configService = new ConfigService()
    this.decrypt = this.decrypt.bind(this)
    this.encrypt = this.encrypt.bind(this)
    this.hash = this.hash.bind(this)
  }

  async compareHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }

  decrypt(payload: string): DecryptResult {
    const { provider } = this.configService

    try {
      const decoded = jwt.verify(payload, provider.JWT_SECRET, {
        algorithms: ['HS256']
      })
      return decoded as unknown as DecryptResult
    } catch (err) {
      this.logger.error(err)
      return { error: true as const, details: err } as unknown as DecryptResult
    }
  }

  encrypt(
    payload: EncryptPayload,
    { clientConfig, encryptOptions }: EncryptConfig = {
      clientConfig: null,
      encryptOptions: null
    }
  ): string {
    const { provider } = this.configService

    if (clientConfig) {
      delete payload.password
      delete payload.stripeCustomerId
      delete payload.googleId
      delete payload.facebookId

      return jwt.sign(payload, provider.JWT_SECRET, {
        expiresIn: provider.JWT_EXPIRATION as jwt.SignOptions['expiresIn']
      })
    }

    if (encryptOptions) {
      return jwt.sign(payload, provider.JWT_SECRET, encryptOptions)
    }

    return jwt.sign(payload, provider.JWT_SECRET, {
      expiresIn: provider.JWT_EXPIRATION as jwt.SignOptions['expiresIn']
    })
  }

  async generateRandomPassword({
    useHash
  }: {
    useHash?: boolean
  }): Promise<RandomPasswordResult> {
    const password = generator.generate({
      uppercase: true,
      length: 8
    })

    return {
      value: password,
      hash: useHash ? await this.hash(password) : null
    }
  }

  async hash(value: string): Promise<string> {
    const { provider } = this.configService

    return bcrypt.hash(value, provider.STRONG_HASH)
  }
}

export { AuthenticationService }
