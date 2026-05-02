import httpClient, { GET, POST, PUT } from 'providers/http'
import { adaptPlanPrice } from './subscriptions'

/**
 * @typedef {Object} Controller
 * @property {AbortSignal} signal
 */

const endpoint = '/api/v1/plans'

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

/**
 * Adapts a raw snake_case Plan (from /plans/catalog) to camelCase.
 * @param {Object} raw
 * @returns {import('@types/subscriptions').Plan}
 */
export function adaptPlan(raw) {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    description: raw.description,
    includesCourse: raw.includes_course,
    includedExams: raw.included_exams,
    includedSpeakingReviews: raw.included_speaking_reviews,
    includedWritingReviews: raw.included_writing_reviews,
    sortOrder: raw.sort_order,
    prices: Array.isArray(raw.prices) ? raw.prices.map(adaptPlanPrice) : []
  }
}

/**
 * @description
 * Creates a plan through http request.
 * @param {Controller}
 */
export function createPlan({ signal, plan }) {
  return httpClient({
    body: plan,
    endpoint,
    method: POST,
    requiresAuth: true,
    signal
  })
}

/**
 * @description
 * Updates a plan through http request.
 * @param {Controller}
 */
export function updatePlan({ signal, plan }) {
  return httpClient({
    body: plan,
    endpoint,
    method: PUT,
    requiresAuth: true,
    signal
  })
}

/**
 * Get plans through http request.
 * @param {Controller}
 */
export function fetchPlans({ signal, ...data }) {
  return httpClient({
    endpoint,
    method: GET,
    requiresAuth: true,
    queries: data,
    signal
  })
}

/**
 * Fetch the full plan catalog (new architecture).
 * GET /plans/catalog — returns all active plans with their prices.
 * @param {{ signal?: AbortSignal, modelId?: number }} [opts]
 * @returns {Promise<{ response: import('@types/subscriptions').Plan[] }>}
 */
export function getPlansCatalog({ signal, modelId } = {}) {
  return httpClient({
    endpoint: '/api/v1/plans/catalog',
    method: GET,
    requiresAuth: true,
    queries: modelId ? { modelId } : undefined,
    signal
  })
}
