import httpClient, { GET } from 'providers/http'

/**
 * @description
 * Fetch all languages in the application process.
 * @param {AbortableRequest}
 */
export function fetchLanguages ({ signal }) {
  return httpClient({
    endpoint: '/api/v1/languages',
    method: GET,
    requiresAuth: true,
    signal
  })
}