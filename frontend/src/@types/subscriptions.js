/**
 * @file Type definitions for the subscriptions domain.
 * Mirrors the backend schema described in docs/SUB.md.
 */

/**
 * @typedef {'monthly'|'quarterly'|'yearly'} BillingCycle
 */

/**
 * @typedef {'active'|'canceled'|'expired'|'past_due'} SubscriptionStatus
 */

/**
 * @typedef {Object} PlanPrice
 * @property {number}       id
 * @property {number}       planId
 * @property {BillingCycle} billingCycle
 * @property {string}       currency       - e.g. 'EUR'
 * @property {number}       basePrice      - in cents
 * @property {number}       discountPercentage
 * @property {number}       finalPrice     - in cents
 * @property {boolean}      active
 */

/**
 * @typedef {Object} Plan
 * @property {number}       id
 * @property {string}       code           - stable slug, e.g. 'aptis_pro'
 * @property {string}       name
 * @property {string}       [description]
 * @property {boolean}      includesCourse
 * @property {number|null}  includedExams  - null = unlimited
 * @property {number}       includedSpeakingReviews
 * @property {number}       includedWritingReviews
 * @property {number}       sortOrder
 * @property {PlanPrice[]}  prices
 */

/**
 * @typedef {Object} Subscription
 * @property {number}             id
 * @property {number}             userId
 * @property {number}             planId
 * @property {number}             planPriceId
 * @property {SubscriptionStatus} status
 * @property {BillingCycle}       billingCycle
 * @property {string}             startedAt
 * @property {string}             currentPeriodStart
 * @property {string}             currentPeriodEnd
 * @property {boolean}            cancelAtPeriodEnd
 * @property {string|null}        canceledAt
 * @property {string|null}        stripeChargeId
 * @property {string|null}        stripeCustomerId
 * @property {string|null}        paymentMethodId
 * @property {Plan}               [plan]
 * @property {PlanPrice}          [planPrice]
 */

/**
 * @typedef {Object} CreateSubscriptionDto
 * @property {number}  planPriceId
 * @property {string}  [paymentMethodId]
 * @property {string}  [stripeToken]
 * @property {string}  idempotencyKey
 */

/**
 * @typedef {Object} CancelSubscriptionDto
 * @property {boolean} immediately - true = cancel now; false = cancel at period end
 */
