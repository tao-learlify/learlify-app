/**
 * @typedef {Object} PlanFeatures
 * @property {number|null} exams     - null = unlimited
 * @property {number}      speaking  - corrected speaking exercises per cycle
 * @property {number}      writing   - corrected writing exercises per cycle
 * @property {boolean}     course    - includes online course
 */

/**
 * @typedef {Object} PlanCatalogEntry
 * @property {string}       code      - plan code matching the backend
 * @property {string}       apiName   - expected plan name from backend (fallback matching)
 * @property {boolean}      popular   - render "Más popular" badge
 * @property {PlanFeatures} features
 * @property {number}       basePrice - monthly base price in EUR (frontend preview, overridden by API)
 */

/**
 * Static catalog of subscription plans.
 * This is the frontend source of truth for plan structure, ordering, and features.
 *
 * Displayed prices are computed from basePrice + billingCycle discount.
 * When the backend returns a price for a plan, that value takes precedence.
 *
 * @type {PlanCatalogEntry[]}
 */
const PLAN_CATALOG = [
  {
    code: 'EXAM_ESSENTIALS',
    apiName: 'Exam Essentials',
    popular: false,
    features: {
      exams: null,
      speaking: 0,
      writing: 0,
      course: false
    },
    basePrice: 12
  },
  {
    code: 'APTIS_PRO',
    apiName: 'Aptis Pro',
    popular: true,
    features: {
      exams: null,
      speaking: 2,
      writing: 2,
      course: true
    },
    basePrice: 22
  },
  {
    code: 'PRO_MAX',
    apiName: 'Pro Max',
    popular: false,
    features: {
      exams: null,
      speaking: 10,
      writing: 10,
      course: true
    },
    basePrice: 39
  }
]

export default PLAN_CATALOG
