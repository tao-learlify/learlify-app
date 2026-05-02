import httpClient, { GET, POST, PUT } from 'providers/http'

/**
 * @typedef {Object} Credentials
 * @property {string} email
 * @property {string} password
 *
 * @param {Credentials} user
 */
export function login(user) {
  return httpClient({
    body: user,
    endpoint: '/api/v1/auth/login',
    method: POST
  })
}

export function demo() {
  return httpClient({
    endpoint: '/api/v1/auth/demo',
    method: GET
  })
}

/**
 * @param {{}} user
 * @param {'Facebook' | 'Google'} provider
 */
export function loginSocial(user, provider) {
  return httpClient({
    body: user,
    endpoint: '/api/v1/auth/social',
    params: [provider],
    method: POST
  })
}

/**
 * @param {string} email 
 */ 
export function forgotPassword (email) {
  return httpClient({
    endpoint: '/api/v1/auth/forgot',
    method: POST,
    queries: {
      email
    }
  })
}

export function updateProfile (data) {
  return httpClient({
    body: data,
    endpoint: '/api/v1/users',
    method: PUT,
    requiresAuth: true
  })
}

export function signUp (data) {
  return httpClient({
    body: data,
    endpoint: '/api/v1/auth/register',
    method: POST,
  })
}

export function verifyAccount ({ code }) {
  return httpClient({
    queries: {
      code
    },
    endpoint: '/api/v1/auth/verify',
    method: PUT,
    requiresAuth: true
  })
}

export function resetPassword ({ code, password }) {
  return httpClient({
    endpoint: '/api/v1/auth/reset',
    body: {
      code,
      password
    },
    method: PUT
  })
}