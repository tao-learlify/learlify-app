import httpClient, { GET } from 'providers/http'

/**
 * @typedef {Object} FetchUsersArguments
 * @property {number} role
 * @property {number} page
 * @property {string} search
 */

/**
 * @param {FetchUsersArguments}
 */
export async function fetchUsers ({ role, page, search, signal }) {
  return httpClient({
    endpoint: '/api/v1/users',
    method: GET,
    queries: {
      role,
      page,
      search
    },
    requiresAuth: true,
    signal
  })
}