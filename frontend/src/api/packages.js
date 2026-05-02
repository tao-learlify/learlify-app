import httpClient, { GET, POST } from 'providers/http'

/**
 * @typedef {Object} CreatePackageArguments
 * @property {number} paymentMethodId - PaymentMethodId through requires action with payment.
 * @property {boolean} requiresAction - Stripe popup.
 * @property {boolean} cancel - Cancel process of billing.
 * @property {number} planId - The current plan to be processed.
 * @property {string} [billingCycle] - Billing cycle: monthly, quarterly, or yearly.
 * @property {string} [idempotencyKey] - Unique key to prevent duplicate charges.
 */

/**
 * @typedef {Object} AssignPackageArguments
 * @property {number} userId
 * @property {number} planId
 */

/**
 * @description
 * Fetch all packages of the current user.
 */
export async function fetchPackages({ signal }) {
  return httpClient({
    endpoint: '/api/v1/packages',
    method: GET,
    queries: {
      active: true
    },
    requiresAuth: true,
    signal
  })
}

/**
 * @description
 * Uses the current API of Stripe, to connect this endpoint with the server to process a payment.
 * @param {CreatePackageArguments}
 */
export async function createPackage({
  cancel,
  paymentMethodId,
  planId,
  requiresAction,
  billingCycle,
  idempotencyKey
}) {
  return httpClient({
    body: {
      cancel: cancel || false,
      paymentMethodId,
      requiresAction: requiresAction || false,
      ...(billingCycle && { billing_cycle: billingCycle })
    },
    endpoint: '/api/v1/packages',
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    method: POST,
    queries: {
      planId
    },
    requiresAuth: true
  })
}

/**
 * @requires AdminPermission
 * @param {AssignPackageArguments} data
 * @description
 * Assign packages to the current user through admin dashboard.
 */
export function assignPackage(data) {
  return httpClient({
    endpoint: '/api/v1/packages/assign',
    method: POST,
    queries: data,
    requiresAuth: true
  })
}
