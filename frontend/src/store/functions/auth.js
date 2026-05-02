import jwtDecode from 'jwt-decode'
import { APTIS_KEY } from 'utils/localStorage'

/**
 * @description
 * Get token session
 * Uses a mechanism to auto-remove object session or unreadable tokens.
 * Closes the session automatically.
 * @returns {{}}
 */
export function getTokenSession() {
  const token = localStorage.getItem(APTIS_KEY)

  /**
   * Checking that the token is a string.
   * In case that exist.
   */
  if (typeof token === 'string') {
    try {
      /**
       * @see https://www.npmjs.com/package/jwt-decode
       */
      /**
       * @type {{}}
       */
      const session = {
        ...jwtDecode(token),
        token
      }

      return session
    } catch (err) {
      localStorage.removeItem(APTIS_KEY)

      window.location.reload()
    }
  }

  return null
}

export function isLoggedIn() {
  return typeof localStorage.getItem(APTIS_KEY) === 'string'
}

export function isDemo () {
  const user = getTokenSession()

  return user && user.firstName === 'Demo'
}