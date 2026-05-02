import httpClient, { GET, POST, PATCH, PUT } from 'providers/http'



/**
 * @description
 * Fetch exams of the user, based on model.
 * @param {AbortableRequest}
 */
export async function fetchExams ({ model, signal }) {
  return httpClient({
    endpoint: '/api/v1/exams',
    method: GET,
    signal,
    queries: {
      model
    },
    requiresAuth: true
  })
}

/**
 * @description
 * Fetch one exam based on id.
 * @param {AbortableRequest}
 */
export async function fetchExam ({ signal, id }) {
  return httpClient({
    endpoint: '/api/v1/exams',
    method: GET,
    signal,
    params: [id],
    requiresAuth: true
  })
}

/**
 * @description
 * Create a progress, with data.
 * @param {AbortableRequest}
 */
export async function createProgress (data) {
  return httpClient({
    body: data,
    endpoint: '/api/v1/progress',
    method: POST,
    requiresAuth: true
  })
}

/**
 * @param {AbortableRequest}
 */
export async function fetchProgress (queries) {
  return httpClient({
    endpoint: '/api/v1/progress',
    method: GET,
    queries,
    requiresAuth: true
  })
}

/**
 * @param {AbortableRequest}
 */
export async function updateProgress ({ formData }) {
  return httpClient({
    body: formData,
    endpoint: '/api/v1/progress',
    method: PUT,
    normalize: true,
    raw: true,
    requiresAuth: true
  })
}


export async function patchProgress (queries) {
  return await httpClient({
    body: {
      update: true
    },
    endpoint: '/api/v1/progress',
    method: PATCH,
    queries,
    requiresAuth: true
  })
}