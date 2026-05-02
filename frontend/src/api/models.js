import httpClient, { GET, PATCH } from 'providers/http'

/**
 * @description
 * Fetch all models in the current process.
 * @param {CommonFetchRequest}
 */
export function fetchModels({ signal }) {
  return httpClient({
    endpoint: '/api/v1/models',
    method: GET,
    requiresAuth: true,
    signal
  })
}

/**
 * @description
 * Fetch one model in the current application.
 * @param {{ name: string, signal: AbortSignal }}
 */
export function fetchModel({ name, signal }) {
  return httpClient({
    endpoint: '/api/v1/models',
    method: GET,
    requiresAuth: true,
    signal,
    queries: {
      name
    }
  })
}

/**
 * @description
 * @param {{ name: string }}
 * Patch a current model, the user will be assigned as a USER aptis, or USER ielts.
 */
export async function patchModel({ name }) {
  return httpClient({
    endpoint: '/api/v1/models',
    method: PATCH,
    queries: {
      name
    },
    requiresAuth: true
  })
}
