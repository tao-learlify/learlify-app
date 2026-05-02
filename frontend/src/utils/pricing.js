/** @type {Record<string, number>} */
const DISCOUNTS = {
  monthly: 0,
  quarterly: 0.1,
  yearly: 0.35
}

/** @type {string[]} */
export const BILLING_CYCLES = ['monthly', 'quarterly', 'yearly']

/**
 * Returns the monthly price after applying the billing cycle discount.
 * @param {number} basePrice   - undiscounted monthly price
 * @param {string} billingCycle
 * @returns {number}
 */
export function calculateDiscountedPrice(basePrice, billingCycle) {
  const discount = DISCOUNTS[billingCycle] ?? 0
  return Math.round(basePrice * (1 - discount) * 100) / 100
}

/**
 * Total annual saving vs paying the monthly price for 12 months.
 * @param {number} basePrice
 * @returns {number}
 */
export function getAnnualSaving(basePrice) {
  return Math.round(basePrice * DISCOUNTS.yearly * 12 * 100) / 100
}

/**
 * @param {number} amount
 * @param {string} [currency='EUR']
 * @returns {string}
 */
export function formatPrice(amount, currency = 'EUR') {
  const symbol = currency === 'EUR' ? '€' : currency
  return `${amount} ${symbol}`
}

/**
 * @param {string} billingCycle
 * @returns {string|null}
 */
export function getSavingBadge(billingCycle) {
  if (billingCycle === 'quarterly') return '-10%'
  if (billingCycle === 'yearly') return '-35%'
  return null
}
