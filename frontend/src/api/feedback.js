import httpClient, { GET } from 'providers/http'


const endpoint = '/api/v1/feedback'


/**
 * @description
 * Fetch the current feedback of the user.
 * @param {AbortableRequest} 
 */
export async function getFeedback ({ signal, ...queries }) {
  return await httpClient({
    endpoint,
    method: GET,
    queries,
    requiresAuth: true,
    signal
  })
}