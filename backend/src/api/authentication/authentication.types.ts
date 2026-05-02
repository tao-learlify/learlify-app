import type { JwtPayload, SignOptions } from 'jsonwebtoken'

export interface DecryptError {
  error: true
  details: Error
  email?: undefined
  id?: undefined
  role?: undefined
  isVerified?: undefined
}

export interface DecodedPayload extends JwtPayload {
  error?: false
  id?: number
  email?: string
  role?: string
  isVerified?: boolean
  [key: string]: unknown
}

export type DecryptResult = DecodedPayload | DecryptError

export interface EncryptConfig {
  clientConfig?: boolean | null
  encryptOptions?: SignOptions | null
}

export interface RandomPasswordResult {
  value: string
  hash: string | null
}

export interface SignUpBody {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInBody {
  email: string
  password: string
}

export interface GoogleLoginBody {
  email: string
  googleId: string
  givenName: string
  familyName?: string
  imageUrl?: string
}

export interface FacebookLoginBody {
  email: string
  facebookId: string
  givenName: string
  familyName?: string
  imageUrl?: string
}

export interface RefreshTokenBody {
  token: string
}

export interface ResetPasswordBody {
  code: string
  password: string
}

export interface TokenResponse {
  message: string
  response: { token: string }
  statusCode: number
}
