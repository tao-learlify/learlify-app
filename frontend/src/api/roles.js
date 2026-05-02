import httpClient, { GET } from 'providers/http'

/**
 * @param {CommonFetchRequest}
 */
export async function fetcRoles({ signal }) {
  return await httpClient({
    endpoint: '/api/v1/roles',
    method: GET,
    signal,
    requiresAuth: true
  })
}
