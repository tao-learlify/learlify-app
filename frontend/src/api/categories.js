import httpClient, { GET } from 'providers/http'

/**
 * 
 * @param {AbortableRequest}
 */
export async function fetchCategories ({ signal }) {
  return await httpClient({
    endpoint: '/api/v1/categories',
    method: GET,
    requiresAuth: true,
    signal
  })
}