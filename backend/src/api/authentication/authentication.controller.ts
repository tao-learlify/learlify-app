import type { Request, Response } from 'express'
import { AuthenticationService } from './authentication.service'
import { UsersService } from 'api/users/users.service'
import { RolesService } from 'api/roles/roles.services'
import { MailService } from 'api/mails/mails.service'
import { addToBlocklist } from 'api/jwt/jwt.blocklist'
import { Roles } from 'metadata/roles'
import { ConfigService } from 'api/config/config.service'
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException
} from 'exceptions'
import { mailConfig } from 'api/mails'
import { Logger } from 'api/logger'
import { Bind } from 'decorators'
import moment from 'moment'
import { importJWK, jwtVerify } from 'jose'
import type {
  SignUpBody,
  SignInBody,
  GoogleLoginBody,
  FacebookLoginBody,
  TelegramLoginBody,
  RefreshTokenBody,
  ResetPasswordBody
} from './authentication.types'

export class AuthenticationController {
  private logger = Logger.Service
  private authService: AuthenticationService
  private configService: ConfigService
  private userService: UsersService
  private rolesService: RolesService

  private mailService: MailService

  constructor() {
    this.authService = new AuthenticationService()
    this.configService = new ConfigService()
    this.userService = new UsersService()
    this.rolesService = new RolesService()
    this.mailService = new MailService()
  }

  @Bind
  async signUp(req: Request, res: Response): Promise<Response> {
    const sign = req.body as SignUpBody

    const isAvailable = await this.userService.getOne({
      email: sign.email
    })

    if (isAvailable) {
      this.logger.debug('User already exists')
      throw new ConflictException(res.__('errors.User already exists'))
    }

    const role = await this.rolesService.findOne({ name: Roles.User })

    const user = await this.userService.create({
      email: sign.email,
      firstName: sign.firstName,
      isVerified: false,
      lang: req.locale,
      lastName: sign.lastName,
      password: await this.authService.hash(sign.password),
      roleId: role.id,
      lastLogin: moment().format('YYYY-MM-DD')
    })

    const data = await this.userService.getOne({
      id: user.id
    })

    const confirmationCode = this.authService.encrypt(
      { email: data!.email },

      {
        encryptOptions: {
          expiresIn: '1d'
        }
      }
    )

    await this.mailService.sendMail({
      from: this.configService.provider.SES_FROM_EMAIL,
      to: user.email,
      subject: res.__('mails.services.signUp.subject'),
      text: res.__('mails.services.signUp.text'),
      html: `
        <div>
          <p>${res.__('mails.services.signUp.html.verification')}</p>
          <a href="${
            mailConfig.domain
          }/verification?code=${confirmationCode}">
            ${res.__('mails.services.signUp.html.verificate')}
          </a>
        </div>
        <div>
          ${res.__('mails.services.signUp.html.thanks')}
          ${res.__('mails.services.signUp.html.practice')}
          ${res.__('mails.services.signUp.html.team')}
            <a href="${mailConfig.domain}">
              ${res.__('mails.services.signUp.html.team')} ${
        mailConfig.domain
      }</a>
          </div>
    `
    })

    return res.status(201).json({
      message: 'Register completed',
      response: {
        token: this.authService.encrypt({ ...data }, { clientConfig: true })
      },
      statusCode: 201
    })
  }

  @Bind
  async signIn(req: Request, res: Response): Promise<Response> {
    const sign = req.body as SignInBody

    const user = await this.userService.getOne({
      allowPrivateData: true,
      email: sign.email
    })

    if (user) {
      const authenticate = await this.authService.compareHash(
        sign.password,
        user.password!
      )

      if (authenticate) {
        await this.userService.updateOne({
          id: user.id,
          lang: req.locale,
          lastLogin: moment().format('YYYY-MM-DD')
        })

        const token = this.authService.encrypt(
          { ...user, role: user.role, model: user.model },
          { clientConfig: true }
        )

        return res.status(200).json({
          message: 'Login Successfully',
          response: {
            token
          },
          statusCode: 200
        })
      }
    }

    throw new BadRequestException(res.__('errors.Invalid password or username'))
  }

  @Bind
  async googleLogin(req: Request, res: Response): Promise<Response> {
    const sign = req.body as GoogleLoginBody

    const isGoogleUser = await this.userService.getOne({
      email: sign.email,
      googleId: sign.googleId
    })

    if (isGoogleUser) {
      await this.userService.updateOne({
        id: isGoogleUser.id,
        lastLogin: moment().format('YYYY-MM-DD')
      })

      const token = await this.authService.encrypt(
        {
          ...isGoogleUser,
          role: isGoogleUser.role
        },
        { clientConfig: true }
      )

      return res.status(200).json({
        message: 'Login succesfully',
        response: {
          token
        },
        statusCode: 200
      })
    }

    const user = await this.userService.getOne({
      email: sign.email
    })

    if (user) {
      const update = await this.userService.updateOne({
        id: user.id,
        googleId: sign.googleId,
        isVerified: true,
        lastLogin: moment().format('YYYY-MM-DD')
      })

      this.logger.info('googleId update', update)

      const token = this.authService.encrypt(
        {
          ...update,
          role: update.role
        },
        { clientConfig: true }
      )

      return res.status(200).json({
        message: 'Login succesfully',
        response: {
          token
        },
        statusCode: 200
      })
    }

    const password = await this.authService.generateRandomPassword({
      useHash: true
    })

    const role = await this.rolesService.findOne({ name: Roles.User })

    const create = await this.userService.create({
      email: sign.email,
      firstName: sign.givenName,
      lastName: sign.familyName || 'AptisGo',
      googleId: sign.googleId,
      imageUrl: sign.imageUrl,
      isVerified: true,
      lang: req.locale,
      password: password.hash ?? undefined,
      roleId: role.id,
      lastLogin: moment().format('YYYY-MM-DD')
    })

    await this.mailService.sendMail({
      to: create.email,
      from: this.configService.provider.SES_FROM_EMAIL,
      subject: res.__('mails.services.googleSignUp.subject'),
      text: res.__('mails.services.googleSignUp.text', {
        user: create.firstName,
        locale: req.locale
      }),
      html: `
        <div>
          <p style="font-size: 13px">${res.__(
            'mails.services.googleSignUp.html.password'
          )}: <strong style="color: red; font-size: 16px;"> ${
        password.value
      }</strong></p>
      
        </div>
      `
    })

    const token = this.authService.encrypt(
      { ...create, role: create.role },
      { clientConfig: true }
    )

    return res.status(201).json({
      message: 'Sign Up Succesfully',
      response: {
        token
      },
      statusCode: 201
    })
  }

  @Bind
  async googleCodeLogin(req: Request, res: Response): Promise<Response> {
    const { code, redirect_uri } = req.body as { code: string; redirect_uri: string }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '999008543563-87l5u8q07ddmhdr1ql47jm3l0a8skfaa.apps.googleusercontent.com'
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

    if (!code) {
      throw new BadRequestException('Authorization code is required')
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirect_uri || 'http://localhost:3000',
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text()
      this.logger.error('Google token exchange failed', errBody)
      throw new BadRequestException('Google authentication failed')
    }

    const tokens = await tokenRes.json() as Record<string, unknown>
    const idToken = tokens.id_token as string

    if (!idToken) {
      throw new BadRequestException('No ID token received from Google')
    }

    // Decode id_token payload
    let claims: Record<string, unknown>
    try {
      const parts = idToken.split('.')
      claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'))
    } catch {
      throw new BadRequestException('Failed to decode Google ID token')
    }

    const googleId = claims.sub as string
    const email = claims.email as string
    const givenName = (claims.given_name || (claims.name as string)?.split(' ')[0] || 'Google') as string
    const familyName = (claims.family_name || (claims.name as string)?.split(' ').slice(1).join(' ') || 'User') as string
    const imageUrl = (claims.picture || '') as string

    // Find or create user
    const existing = await this.userService.getOne({ googleId })
    if (existing) {
      await this.userService.updateOne({
        id: existing.id,
        imageUrl,
        lastLogin: moment().format('YYYY-MM-DD'),
      })
      const token = this.authService.encrypt(
        { ...existing, role: existing.role },
        { clientConfig: true },
      )
      return res.status(200).json({ message: 'Login successfully', response: { token }, statusCode: 200 })
    }

    const user = await this.userService.getOne({ email })
    if (user) {
      const updated = await this.userService.updateOne({
        id: user.id,
        googleId,
        imageUrl,
        isVerified: true,
        lastLogin: moment().format('YYYY-MM-DD'),
      })
      const token = this.authService.encrypt(
        { ...updated, role: updated.role },
        { clientConfig: true },
      )
      return res.status(200).json({ message: 'Login successfully', response: { token }, statusCode: 200 })
    }

    const password = await this.authService.generateRandomPassword({ useHash: true })
    const role = await this.rolesService.findOne({ name: Roles.User })
    const created = await this.userService.create({
      email,
      firstName: givenName,
      lastName: familyName,
      googleId,
      imageUrl,
      isVerified: true,
      lang: req.locale,
      password: password.hash ?? undefined,
      roleId: role.id,
      lastLogin: moment().format('YYYY-MM-DD'),
    })

    try {
      await this.mailService.sendMail({
        to: created.email,
        from: this.configService.provider.SES_FROM_EMAIL,
        subject: res.__('mails.services.googleSignUp.subject'),
        text: res.__('mails.services.googleSignUp.text', { user: created.firstName, locale: req.locale }),
        html: `<div><p style="font-size: 13px">${res.__('mails.services.googleSignUp.html.password')}: <strong style="color: red; font-size: 16px;">${password.value}</strong></p></div>`,
      })
    } catch { /* email is best-effort */ }

    const token = this.authService.encrypt({ ...created, role: created.role }, { clientConfig: true })
    return res.status(201).json({ message: 'Sign Up Successfully', response: { token }, statusCode: 201 })
  }

  @Bind
  async facebookLogin(req: Request, res: Response): Promise<Response> {
    const body = req.body as FacebookLoginBody

    const facebookUser = await this.userService.getOne({
      email: body.email,
      facebookId: body.facebookId
    })

    if (facebookUser) {
      await this.userService.updateOne({
        id: facebookUser.id,
        lastLogin: moment().format('YYYY-MM-DD')
      })

      const token = await this.authService.encrypt(
        {
          ...facebookUser,
          role: facebookUser.role
        },
        { clientConfig: true }
      )

      return res.status(200).json({
        message: 'Login succesfully',
        response: {
          token
        },
        statusCode: 200
      })
    }

    const user = await this.userService.getOne({
      email: body.email
    })

    if (user) {
      const updatedUser = await this.userService.updateOne({
        id: user.id,
        facebookId: body.facebookId,
        isVerified: true,
        lastLogin: moment().format('YYYY-MM-DD')
      })

      this.logger.info('facebookId update', updatedUser)

      const token = this.authService.encrypt(
        {
          ...updatedUser,
          role: updatedUser.role
        },
        { clientConfig: true }
      )

      return res.status(200).json({
        message: 'Login succesfully',
        response: {
          token
        },
        statusCode: 200
      })
    }

    const password = await this.authService.generateRandomPassword({
      useHash: true
    })

    const role = await this.rolesService.findOne({ name: Roles.User })

    const createdUser = await this.userService.create({
      email: body.email,
      firstName: body.givenName,
      lastName: body.familyName || 'AptisGo',
      facebookId: body.facebookId,
      imageUrl: body.imageUrl,
      isVerified: true,
      lang: req.locale,
      password: password.hash ?? undefined,
      roleId: role.id,
      lastLogin: moment().format('YYYY-MM-DD')
    })

    await this.mailService.sendMail({
      to: createdUser.email,
      from: this.configService.provider.SES_FROM_EMAIL,
      subject: res.__('mails.services.googleSignUp.subject'),
      text: res.__('mails.services.googleSignUp.text', {
        user: createdUser.firstName,
        locale: req.locale
      }),
      html: `
        <div>
          <p style="font-size: 13px">${res.__(
            'mails.services.googleSignUp.html.password'
          )}: <strong style="color: red; font-size: 16px;"> ${
        password.value
      }</strong></p>
      
        </div>
      `
    })

    const token = this.authService.encrypt(
      { ...createdUser, role: createdUser.role },
      { clientConfig: true }
    )

    return res.status(201).json({
      message: 'Sign Up Succesfully',
      response: {
        token
      },
      statusCode: 201
    })
  }

  @Bind
  async verification(req: Request, res: Response): Promise<Response> {
    const code = req.query.code as string

    const { email, error } = this.authService.decrypt(code)

    this.logger.info('decode', {
      email,
      error
    })

    if (error) {
      throw new BadRequestException(
        res.__('errors.Invalid Token Assignament or expired')
      )
    }

    const user = await this.userService.getOne({
      email: email
    })

    if (user) {
      await this.userService.updateOne({
        id: user.id,
        isVerified: true
      })

      return res.status(201).json({
        message: 'Account has been verified',
        response: {
          token: this.authService.encrypt(
            { ...user, isVerified: true },
            { clientConfig: true }
          )
        },
        statusCode: 201
      })
    }

    // Return generic 400 rather than 404 to prevent user enumeration
    throw new BadRequestException(res.__('errors.Invalid Token Assignament or expired'))
  }

  @Bind
  async forgot(req: Request, res: Response): Promise<Response> {
    const email = req.query.email as string

    const available = await this.userService.getOne({
      email
    })

    if (available) {
      const user = (await this.userService.getOne({
        email
      }))!

      const token = this.authService.encrypt(
        { email: user.email, id: user.id },
        {
          encryptOptions: {
            expiresIn: '1d'
          }
        }
      )

      await this.mailService.sendMail({
        from: this.configService.provider.SES_FROM_EMAIL,
        to: user.email,
        subject: res.__('mails.services.resetPassword.subject', {
          user: user.firstName
        }),
        text: res.__('mails.services.resetPassword.text', {
          user: user.firstName
        }),
        html: `
        <div>
          <p>${res.__('mails.services.resetPassword.html.greet', {
            user: user.firstName
          })}</p>
          <p>
            ${res.__('mails.services.resetPassword.html.practice')}
            <strong>${res.__('mails.services.resetPassword.html.team')}</strong>
          </p>
          <a href="${mailConfig.domain}/reset?code=${token}">
            Restaura tu cuenta haciendo click aquí
          </a>
          <br>
          <strong>El enlance está habilitado hasta por 24 horas</strong>
        </div>
        `
      })

      return res.status(200).json({
        response: {
          details: {
            to: email,
            date: this.configService.getLastLogin()
          },
          sended: true
        },
        statusCode: 200
      })
    }

    // Return 200 regardless to prevent email enumeration
    this.logger.warn('Invalid email or user — returning 200 to prevent enumeration')

    return res.status(200).json({
      response: {
        details: {
          to: email,
          date: this.configService.getLastLogin()
        },
        sended: true
      },
      statusCode: 200
    })
  }

  @Bind
  async refreshToken(req: Request, res: Response): Promise<Response> {
    const { token: rawToken } = req.body as RefreshTokenBody
    const { id, error } = this.authService.decrypt(rawToken)

    if (error) {
      this.logger.error('Error: Token is not valid.')

      throw new ForbiddenException('')
    }

    const user = await this.userService.getOne({ id })

    if (user) {
      return res.status(200).json({
        message: 'Token refresh succesfully',
        response: {
          token: this.authService.encrypt({ ...user }, { clientConfig: true })
        },
        statusCode: 200
      })
    }

    throw new NotFoundException(res.__('errors.User Not Found'))
  }

  @Bind
  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { code, password } = req.body as ResetPasswordBody

    const decrypt = this.authService.decrypt(code)

    if (decrypt.error) {
      throw new BadRequestException(
        res.__('errors.Invalid Token Assignament or expired')
      )
    }

    const user = await this.userService.getOne({
      id: decrypt.id
    })

    if (user) {
      const update = await this.userService.updateOne({
        id: user.id,
        password: await this.authService.hash(password)
      })

      return res.status(201).json({
        message: 'Reset password succesfully',
        response: {
          token: this.authService.encrypt({ ...update }, { clientConfig: true })
        },
        statusCode: 201
      })
    }

    throw new NotFoundException(res.__('errors.User Not Found'))
  }

  @Bind
  async demoUser(req: Request, res: Response): Promise<Response> {
    const user = (await this.userService.getOne({
      allowPrivateData: true,
      email: 'aptisgo@noreply'
    }))!

    await this.userService.updateOne({
      id: user.id,
      lang: req.locale,
      lastLogin: moment().format('YYYY-MM-DD')
    })

    const token = this.authService.encrypt(
      { ...user, role: user.role },
      { clientConfig: true }
    )

    return res.status(200).json({
      message: 'Login Successfully',
      response: {
        token
      },
      statusCode: 200
    })
  }

  @Bind
  async telegramLogin(req: Request, res: Response): Promise<Response> {
    const body = req.body as TelegramLoginBody

    // ── Telegram OIDC JWT verification ────────────────────────────────────
    const TELEGRAM_CLIENT_ID = process.env.TELEGRAM_CLIENT_ID || ''
    const TELEGRAM_JWKS_URI = 'https://oauth.telegram.org/.well-known/jwks.json'
    const TELEGRAM_ISS = 'https://oauth.telegram.org'

    if (!TELEGRAM_CLIENT_ID) {
      throw new BadRequestException('Telegram Login not configured')
    }

    // Fetch Telegram's JWKS and verify the id_token
    const jwksResp = await fetch(TELEGRAM_JWKS_URI)
    if (!jwksResp.ok) {
      throw new BadRequestException('Failed to fetch Telegram JWKS')
    }
    const jwksBody = (await jwksResp.json()) as { keys: Array<Record<string, unknown>> }
    const keys = jwksBody.keys || []

    let telegramClaims: Record<string, unknown> | null = null
    for (const jwk of keys) {
      try {
        const publicKey = await importJWK(jwk, 'RS256')
        const { payload } = await jwtVerify(body.id_token, publicKey, {
          issuer: TELEGRAM_ISS,
          audience: TELEGRAM_CLIENT_ID,
        })
        telegramClaims = payload as unknown as Record<string, unknown>
        break
      } catch {
        // Try next key
      }
    }

    if (!telegramClaims) {
      throw new BadRequestException('Invalid Telegram id_token')
    }

    const telegramId = String(telegramClaims.sub || '')
    if (!telegramId) {
      throw new BadRequestException('Telegram id_token missing sub claim')
    }

    // Use the Telegram username as email suffix since Telegram may not share email
    const telegramUsername =
      (telegramClaims.preferred_username as string) ||
      body.username ||
      `telegram_${telegramId}`
    const email = (telegramClaims.email as string) || `${telegramUsername}@telegram.learlify.com`
    const firstName = body.firstName || (telegramClaims.name as string) || 'Telegram'
    const lastName = body.lastName || 'User'

    // ── Find or create user ───────────────────────────────────────────────
    let user = await this.userService.getOne({
      telegramId
    })

    if (user) {
      // Existing Telegram user — update last login
      await this.userService.updateOne({
        id: user.id,
        imageUrl: body.imageUrl || user.imageUrl,
        lastLogin: moment().format('YYYY-MM-DD')
      })
    } else {
      // Check if a user with this Telegram email already exists
      const existingUser = await this.userService.getOne({ email })

      if (existingUser) {
        // Link Telegram ID to existing account
        const updated = await this.userService.updateOne({
          id: existingUser.id,
          telegramId,
          imageUrl: body.imageUrl || existingUser.imageUrl,
          isVerified: true,
          lastLogin: moment().format('YYYY-MM-DD')
        })
        user = updated
      } else {
        // Create new user from Telegram data
        const password = await this.authService.generateRandomPassword({
          useHash: true
        })

        const role = await this.rolesService.findOne({ name: Roles.User })

        const createdUser = await this.userService.create({
          email,
          firstName,
          lastName,
          telegramId,
          imageUrl: body.imageUrl || '',
          isVerified: true,
          lang: req.locale,
          password: password.hash ?? undefined,
          roleId: role.id,
          lastLogin: moment().format('YYYY-MM-DD')
        })

        await this.mailService.sendMail({
          to: createdUser.email,
          from: this.configService.provider.SES_FROM_EMAIL,
          subject: res.__('mails.services.googleSignUp.subject'),
          text: res.__('mails.services.googleSignUp.text', {
            user: createdUser.firstName,
            locale: req.locale
          }),
          html: `
            <div>
              <p>Welcome to Learlify! You signed up using Telegram.</p>
              <p>Your temporary password is: <strong style="color: red;">${password.value}</strong></p>
              <p>You can change it in your profile settings.</p>
            </div>
          `
        })

        user = createdUser
      }
    }

    const token = this.authService.encrypt(
      { ...user, role: user.role },
      { clientConfig: true }
    )

    return res.status(200).json({
      message: 'Login successfully',
      response: { token },
      statusCode: 200
    })
  }

  @Bind
  async logout(req: Request, res: Response): Promise<Response> {
    const authHeader = req.headers['authorization'] ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (token) {
      await addToBlocklist(token)
    }

    return res.status(200).json({
      message: 'Logged out successfully',
      statusCode: 200
    })
  }
}
