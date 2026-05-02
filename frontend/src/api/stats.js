import httpClient, { GET } from 'providers/http'

const endpoint = '/api/v1/stats'

/**
 * @description
 * Get all stats from the user, based on his model, aptis or itels.
 * @returns {Promise<HttpRequest>}
 */
export async function getStats ({ model }) {
  return await httpClient({
    endpoint,
    method: GET,
    queries: {
      model
    },
    requiresAuth: true
  })
}