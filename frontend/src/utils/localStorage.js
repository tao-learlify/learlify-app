/**
 * @description
 * AptisKey LocalStorage
 */
export const APTIS_KEY = 'aptis'

/**
 * @description
 * Checks if the user contains the data on the localStorage.
 * @returns {boolean}
 */
export function isLoggedIn() {
  return Boolean(localStorage.getItem(APTIS_KEY))
}


/**
 * @description
 * Obtains the token via localStorage.
 * @returns {string}
 */
export function getToken() {
  return localStorage.getItem(APTIS_KEY)
}


export function getSessionToken () {
  const token = localStorage.getItem(APTIS_KEY)

  return `Bearer ${token}`
}


/**
 * @returns {{ name: string, id: string } | null}
 */
export function getModelSession () {
  const item = localStorage.getItem('metadata')

  return item ?  JSON.parse(item) : null
}