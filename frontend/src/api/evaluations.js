import httpClient, { GET, PATCH, PUT } from 'providers/http'

/**
 * @param {{ page: number, signal: AbortSignal }}
 */
export function fetchLatests({ page, signal }) {
  return httpClient({
    endpoint: '/api/v1/latest/all',
    queries: {
      page
    },
    method: GET,
    requiresAuth: true,
    signal
  })
}

/**
 * @param {{ own: boolean, page: number, signal: AbortSignal }}
 */
export function fetchEvaluations ({ model, own, page, signal }) {
  return httpClient({
    endpoint: '/api/v1/evaluations/all',
    queries: {
      page,
      own,
      model
    },
    method: GET,
    requiresAuth: true,
    signal
  })
}


/**
 *
 * @param {AbortableRequest}
 */
export function fetchEvaluation({ id, signal }) {
  return httpClient({
    endpoint: '/api/v1/evaluations',
    method: GET,
    requiresAuth: true,
    params: [id],
    signal
  })
}


/**
 * @param {AbortableRequest}
 */
export function fetchLatest({ id, signal }) {
  return  httpClient({
    endpoint: '/api/v1/latest',
    method: GET,
    requiresAuth: true,
    params: [id],
    signal
  })
}



export function updateEvaluation ({ id, ...evaluation }) {
  return httpClient({
    body: evaluation, 
    endpoint: '/api/v1/evaluations',
    params: [
      id
    ],
    method: PUT,
    requiresAuth: true
  })
}

export function fetchTeacherOverview () {
  return httpClient({
    endpoint: '/api/v1/evaluations/all',
    queries: {
      count: true,
      page: 1
    },
    method: GET,
    requiresAuth: true
  })
}

export function patchEvaluation ({ id }) {
  return httpClient({
    endpoint: '/api/v1/evaluations',
    params: [
      id
    ],
    requiresAuth: true,
    method: PATCH
  })
}