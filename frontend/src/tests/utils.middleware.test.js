import * as middleware from 'utils/middleware'

/**
 * @description
 * Simulates a incoming request from aptis backend.
 * @module middleware.httpMiddleware
 */
describe('Testing middleware for processing request', () => {
  test('Should return ok true the statusCode is 201 or 200', () => {
    expect(middleware.httpMiddleware({ statusCode: 201 }, ok => ok)).toBe(true)
  })

  test('Should return false if the statusCode is not 201 or 200', () => {
    expect(middleware.httpMiddleware({ statusCode: 404 }, ok => ok)).toBe(false)
  })

  test('Should return false if the statusCode is not 201 or 200', () => {
    expect(middleware.httpMiddleware({ statusCode: 403 }, ok => ok)).toBe(false)
  })
})