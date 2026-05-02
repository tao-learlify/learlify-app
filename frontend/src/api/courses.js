import httpClient, { GET, POST, PUT } from 'providers/http'

/**
 * @param {string} model
 * @param {boolean | null} demo
 * @param {AbortSignal} signal 
 */
export function fetchCourses (model, demo, signal) {
  return httpClient({
    endpoint: '/api/v1/courses',
    method: GET,
    queries: {
      demo,
      model
    },
    requiresAuth: true,
    signal
  })
}

/**
 * @param {number} course
 * @param {AbortSignal} signal
 */
export function fetchAdvance (course, signal) {
  return httpClient({
    endpoint: '/api/v1/advance',
    method: GET,
    queries: {
      courseId: course
    },
    requiresAuth: true,
    signal
  })
}

/**
 * @param {string} resource
 * @param {AbortSignal} signal 
 */
export function fetchCourse (resource, signal) {
  return httpClient({
    endpoint: resource,
    external: true,
    method: GET,
    signal
  })
}


export function updateAdvance (advance) {
  return httpClient({
    body: advance,
    endpoint: '/api/v1/advance',
    method: PUT,
    requiresAuth: true
  })
}


export function createAdvance (advance) {
  return httpClient({
    body: advance,
    endpoint: '/api/v1/advance',
    method: POST,
    requiresAuth: true
  })
}

/**
 * Update section progress mid-learning (exercises completed, XP earned).
 * @param {number} courseId
 * @param {number} sectionIndex — 1-based section number
 * @param {object} data — { xp, progressPercent, exercisesCompleted, lastAccessedAt }
 */
export function updateSectionProgress (courseId, sectionIndex, data) {
  return httpClient({
    body: data,
    endpoint: `/api/v1/courses/${courseId}/sections/${sectionIndex}/progress`,
    method: PUT,
    requiresAuth: true
  })
}

/**
 * Mark section complete and auto-advance to next.
 * @param {number} courseId
 * @param {number} sectionIndex — 1-based section number
 * @param {object} data — { xp, examScore, completedAt }
 */
export function completeSectionProgress (courseId, sectionIndex, data) {
  return httpClient({
    body: data,
    endpoint: `/api/v1/courses/${courseId}/sections/${sectionIndex}/complete`,
    method: POST,
    requiresAuth: true
  })
}