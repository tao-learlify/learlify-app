import httpClient, { GET, POST } from 'providers/http'

/**
 * @param {Class} data
 */
export function createClassRoom(data) {
  return httpClient({
    body: data,
    endpoint: '/api/v1/classes',
    method: POST,
    requiresAuth: true,
    timezone: true
  })
}

export function fetchClassRooms() {
  return httpClient({
    endpoint: '/api/v1/classes',
    params: ['confirmed'],
    method: GET,
    requiresAuth: true,
    timezone: true
  })
}

/**
 * @param {{ token: string }}
 */
export function fetchClassRoom ({ token }) {
  return httpClient({
    endpoint: '/api/v1/classes',
    queries: {
      name: token
    },
    method: GET,
    requiresAuth: true,
    timezone: true
  })
}