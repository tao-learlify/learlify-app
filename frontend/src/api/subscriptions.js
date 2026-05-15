import httpClient, { GET, POST, DELETE, PATCH } from 'providers/http'

// ---------------------------------------------------------------------------
// Adapters — snake_case (backend) → camelCase (frontend)
// ---------------------------------------------------------------------------

/**
 * @param {Object} raw
 * @returns {import('@types/subscriptions').PlanPrice}
 */
export function adaptPlanPrice(raw) {
  return {
    id: raw.id,
    planId: raw.plan_id,
    billingCycle: raw.billing_cycle,
    currency: raw.currency,
    basePrice: raw.base_price,
    discountPercentage: Number(raw.discount_percentage),
    finalPrice: raw.final_price,
    active: raw.active
  }
}

/**
 * @param {Object} raw
 * @returns {import('@types/subscriptions').Subscription}
 */
export function adaptSubscription(raw) {
  return {
    id: raw.id,
    userId: raw.user_id,
    planId: raw.plan_id,
    planPriceId: raw.plan_price_id,
    status: raw.status,
    billingCycle: raw.billing_cycle,
    startedAt: raw.started_at,
    currentPeriodStart: raw.current_period_start,
    currentPeriodEnd: raw.current_period_end,
    cancelAtPeriodEnd: Boolean(raw.cancel_at_period_end),
    canceledAt: raw.canceled_at || null,
    stripeChargeId: raw.stripe_charge_id || null,
    stripeCustomerId: raw.stripe_customer_id || null,
    paymentMethodId: raw.payment_method_id || null,
    plan: raw.plan
      ? {
          id: raw.plan.id,
          code: raw.plan.code,
          name: raw.plan.name,
          includesCourse: raw.plan.includes_course,
          includedExams: raw.plan.included_exams,
          includedSpeakingReviews: raw.plan.included_speaking_reviews,
          includedWritingReviews: raw.plan.included_writing_reviews,
          sortOrder: raw.plan.sort_order,
          prices: []
        }
      : undefined,
    planPrice: raw.plan_price ? adaptPlanPrice(raw.plan_price) : undefined
  }
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Fetch the active subscriptions of the current user.
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<{ response: import('@types/subscriptions').Subscription[] }>}
 */
export function getMySubscriptions({ signal } = {}) {
  return httpClient({
    endpoint: '/api/v1/subscriptions',
    method: GET,
    requiresAuth: true,
    signal
  })
}

/**
 * Create a new subscription.
 * @param {import('@types/subscriptions').CreateSubscriptionDto} dto
 * @returns {Promise<{ response: import('@types/subscriptions').Subscription }>}
 */
export function createSubscription(dto) {
  return httpClient({
    endpoint: '/api/v1/subscriptions',
    method: POST,
    body: {
      planPriceId: dto.planPriceId,
      ...(dto.paymentMethodId && { paymentMethodId: dto.paymentMethodId }),
      ...(dto.stripeToken && { stripeToken: dto.stripeToken }),
      idempotencyKey: dto.idempotencyKey
    },
    requiresAuth: true
  })
}

/**
 * Cancel a subscription.
 * @param {number} subscriptionId
 * @param {import('@types/subscriptions').CancelSubscriptionDto} dto
 * @returns {Promise<{ response: import('@types/subscriptions').Subscription }>}
 */
export function cancelSubscription(subscriptionId, dto) {
  return httpClient({
    endpoint: `/api/v1/subscriptions/${subscriptionId}`,
    method: DELETE,
    body: {
      immediately: Boolean(dto.immediately)
    },
    requiresAuth: true
  })
}

/**
 * Get the authenticated user's active subscription with plan management data.
 * @returns {Promise<{ response: import('@types/subscriptions').MySubscription | null }>}
 */
export function getMySubscription() {
  return httpClient({
    endpoint: '/api/v1/subscriptions/me',
    method: GET,
    requiresAuth: true
  })
}

/**
 * Cancel subscription at period end (keeps access until currentPeriodEnd).
 * @param {number} subscriptionId
 * @returns {Promise<{ response: import('@types/subscriptions').Subscription }>}
 */
export function patchCancelAtPeriodEnd(subscriptionId) {
  return httpClient({
    endpoint: '/api/v1/subscriptions/me/cancel',
    method: PATCH,
    body: { subscriptionId },
    requiresAuth: true
  })
}

/**
 * Reactivate a subscription that was set to cancel at period end.
 * Does NOT charge immediately — re-enables auto-renewal.
 * @param {number} subscriptionId
 * @returns {Promise<{ response: import('@types/subscriptions').Subscription }>}
 */
export function patchReactivate(subscriptionId) {
  return httpClient({
    endpoint: '/api/v1/subscriptions/me/reactivate',
    method: PATCH,
    body: { subscriptionId },
    requiresAuth: true
  })
}

/**
 * Fetch payment method + invoice history for the current user's active subscription.
 * @returns {Promise<{ response: { paymentMethod: Object|null, invoices: Object[] } }>}
 */
export function getBilling() {
  return httpClient({
    endpoint: '/api/v1/subscriptions/me/billing',
    method: GET,
    requiresAuth: true
  })
}
