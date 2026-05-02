import httpClient, { DELETE, GET, POST } from 'providers/http'

/**
 * @description
 * Fetch the last class assigned, if already connected.
 */
export async function fetchOutgoingClass () {
  return await httpClient({
    endpoint: '/api/v1/schedule',
    params: [
      'stream'
    ],
    method: GET,
    requiresAuth: true,
    timezone: true
  })
}

/**
 * @typedef {Object} ScheduleSchema
 * @property {number | string} langId
 * @property {number | string} userId
 * @param {ScheduleSchema} options 
 */
export async function fetchSchedules (options) {
  return await httpClient({
    endpoint: '/api/v1/schedule',
    method: GET,
    queries: options,
    requiresAuth: true,
    timezone: true
  })
}

/**
 * @description
 * Deletes a current schedule from the application.
 * @param {AbortableRequest}
 */
export async function deleteSchedule ({ id, signal }) {
  return await httpClient({
    endpoint: '/api/v1/schedule',
    method: DELETE,
    params: [
      id
    ],
    requiresAuth: true,
    signal
  })
}

/**
 * @description
 * Creates a current schedule in the application.
 * @param {{}} schedule 
 */
export async function createSchedule (schedule) {
  return await httpClient({
    body: schedule,
    endpoint: '/api/v1/schedule',
    method: POST,
    requiresAuth: true
  })
}


/**
 * @description
 * Fetch all pending classes from the user or admin.
 * @param {AbortableRequest} 
 */
export async function fetchClasses ({ signal, params }) {
  return await httpClient({
    endpoint: '/api/v1/classes',
    params: params || null,
    method: GET,
    requiresAuth: true,
    signal
  })
}