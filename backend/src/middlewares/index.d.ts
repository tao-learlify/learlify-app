import type { RequestHandler } from 'express'

type AsyncHandler = (
  req: import('express').Request,
  res: import('express').Response,
  next: import('express').NextFunction
) => Promise<unknown>

export declare class Middleware {
  static secure(handler: AsyncHandler): RequestHandler
  static usePipe: RequestHandler
  static LanguageGuard: RequestHandler
  static authenticate: RequestHandler
  static noDemoReferrer: RequestHandler
  static timezone: RequestHandler
  static isAuthorizedReferrer: RequestHandler
  static memoryStorage: RequestHandler
  static GeoLocationGuard: RequestHandler
  static RolesGuard(roles: string[]): RequestHandler
  static isEvaluationOwner(): RequestHandler
  static requiresMembership(plans: string[]): RequestHandler
  static isResourceOwner(options: { context: string }): RequestHandler
}
