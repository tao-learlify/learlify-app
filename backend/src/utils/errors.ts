export class IntegrityError extends Error {
  status: number

  constructor(msg?: string) {
    super(msg)
    this.message = msg || 'Error related to the database occurred.'
    this.status = 500
    this.name = 'IntegrityError'
  }
}

export class UnauthorizedError extends Error {
  status: number

  constructor(msg?: string) {
    super(msg)
    this.message = msg || 'Unauthorized.'
    this.status = 401
    this.name = 'UnauthorizedError'
  }
}

export class PermissionsError extends Error {
  status: number

  constructor(msg?: string) {
    super(msg)
    this.message = msg || 'Forbidden. You don\'t have the necessary permissions'
    this.status = 403
    this.name = 'PermissionsError'
  }
}

export class NotFound extends Error {
  status: number

  constructor(id: unknown, msg?: string) {
    super(id as string)
    this.message =
      msg ||
      `The Resource with ID [${id}] was not found or doesn't exist. Make sure you provided the correct ID.`
    this.status = 404
    this.name = 'NotFound'
  }
}

export class PageNotFound extends Error {
  status: number

  constructor(msg?: string) {
    super(msg)
    this.message = msg || 'You provided a page number that doesn\'t exist.'
    this.status = 400
    this.name = 'PageNotFound'
  }
}
