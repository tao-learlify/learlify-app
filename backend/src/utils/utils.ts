import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import generator from 'generate-password'

import config from '../config'

type SchemaAnswer = {
  answers: unknown[]
}

type UserEntity = {
  [key: string]: unknown
}

export async function hash(value: string): Promise<string> {
  const saltRounds = 10

  const encryptedValue = await new Promise<string>((resolve, reject) => {
    bcrypt.hash(value, saltRounds, function (err, encrypted) {
      return err ? reject(err) : resolve(encrypted)
    })
  })

  return encryptedValue
}

export async function comparePasswords(
  passwordFromReq: string,
  passwordFromDB: string
): Promise<boolean> {
  return bcrypt.compareSync(passwordFromReq, passwordFromDB)
}

export const signJWT = (
  payload: string | Buffer | object
): string => {
  return jwt.sign(payload, config.JWT_SECRET as string)
}

export const createPassword = (): Promise<{ hashed: string; password: string }> => {
  const password = generator.generate({
    uppercase: true,
    length: 8
  })

  return new Promise((resolve, reject) => {
    hash(password)
      .then(hashed => resolve({ password, hashed }))
      .catch(err => reject(err))
  })
}

export function answerSchema(
  schema: SchemaAnswer[],
  callback: (context: {
    title: unknown
    iteratorIndex: number
    schemaIndex: number
  }) => void
): void {
  schema.forEach(({ answers }, schemaIndex) => {
    answers.forEach((answer, index) => {
      callback({ title: answer, iteratorIndex: index, schemaIndex })
    })
  })
}

export function orderAs(a: { orderAs: number }, b: { orderAs: number }): number {
  return a.orderAs - b.orderAs
}

export function emptyArray(arr: unknown): boolean {
  if (typeof arr !== 'object' || arr === null) {
    return true
  }

  return (arr as { length: number }).length === 0
}

export function fromUnits<T>(value: number, callback: (units: null[]) => T): T {
  const units = Array(value).fill(null)
  return callback(units)
}

export function getCategoryId(
  category: string,
  categories: Array<{ name: string; id: number }>
): number {
  const lastFound = categories.find(value => value.name === category) as {
    id: number
  }

  return lastFound.id
}

export function createFileName(alias: string, id: number, ext: string): string {
  return `${alias}-${id}.${ext}`
}

export function examRequirements(
  expression: string | RegExp,
  packages: unknown[]
): boolean {
  const freeExamNameExpression = /^\bExam 1\b$/

  return (
    !freeExamNameExpression.test(expression as unknown as string) &&
    packages.length === 0
  )
}

export function getUserClientData(user: UserEntity): Record<string, unknown> {
  const {
    password: _password,
    updatedAt: _updatedAt,
    createdAt: _createdAt,
    roleId: _roleId,
    stripeCustomerId: _stripeCustomerId,
    lastLogin: _lastLogin,
    googleId: _googleId,
    facebookId: _facebookId,
    hasActivePackages: _hasActivePackages,
    ...client
  } = user

  void _password
  void _updatedAt
  void _createdAt
  void _roleId
  void _stripeCustomerId
  void _lastLogin
  void _googleId
  void _facebookId
  void _hasActivePackages

  return client
}
