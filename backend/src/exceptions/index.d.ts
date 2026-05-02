export declare class NotFoundException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class BadRequestException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class InternalServerErrorException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class UnauthorizedException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class MisdirectedRequestException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class ConflictException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class ForbiddenException extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class TransactionError extends Error {
  statusCode: number
  constructor(message?: string)
}

export declare class PaymentException extends Error {
  statusCode: number
  constructor(options?: { response?: unknown })
}

export declare class GoneException extends Error {
  statusCode: number
  constructor(message?: string)
}
