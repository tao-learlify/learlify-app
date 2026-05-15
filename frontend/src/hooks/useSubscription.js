import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  subscriptionsSelector,
  activeSubscriptionSelector,
  billingSelector
} from 'store/@selectors/subscriptions'
import { packagesSelector } from 'store/@selectors/packages'
import {
  fetchSubscriptionsThunk,
  fetchBillingThunk
} from 'store/@thunks/subscriptions'
import usePackages from 'hooks/usePackages'

/**
 * @typedef {'active'|'canceled'|'past_due'|'expired'|'trialing'|'cancel_at_period_end'} SubscriptionStatus
 */

/**
 * @typedef {Object} SubscriptionInfo
 * @property {number}             subscriptionId
 * @property {SubscriptionStatus} status
 * @property {string}             planName
 * @property {string}             planCode
 * @property {string}             billingCycle - 'monthly' | 'quarterly' | 'yearly'
 * @property {string|null}        currentPeriodEnd - ISO date string
 * @property {number|null}        discount - percentage 0-100
 * @property {boolean}            cancelAtPeriodEnd
 * @property {number|null}        price - monthly-equivalent price in EUR
 * @property {string}             currency
 * @property {string}             startedAt
 */

/**
 * @typedef {Object} PaymentMethodInfo
 * @property {string} brand - e.g. 'visa', 'mastercard', 'amex'
 * @property {string} last4
 * @property {number} expMonth
 * @property {number} expYear
 */

/**
 * @typedef {Object} InvoiceInfo
 * @property {string} id
 * @property {string} date - ISO date string
 * @property {number} amount
 * @property {string} currency
 * @property {'paid'|'open'|'void'|'uncollectible'} status
 * @property {string|null} receiptUrl
 */

/**
 * @typedef {Object} UseSubscriptionResult
 * @property {SubscriptionInfo|null} subscription
 * @property {PaymentMethodInfo|null} paymentMethod
 * @property {InvoiceInfo[]} invoices
 * @property {boolean} loading
 * @property {boolean} isLegacy - user has a legacy package but no active subscription
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Maps a camelCase Subscription (from API adapter) to the SubscriptionInfo
 * shape consumed by UI components.
 * @param {import('@types/subscriptions').Subscription} sub
 * @returns {SubscriptionInfo}
 */
function mapToSubscriptionInfo(sub) {
  const finalPrice = sub.planPrice?.finalPrice ?? null
  const cycle = sub.billingCycle

  // Convert total period price to monthly equivalent for display
  let monthlyPrice = null
  if (finalPrice != null) {
    const divisors = { monthly: 1, quarterly: 3, yearly: 12 }
    const divisor = divisors[cycle] || 1
    monthlyPrice = Math.round((finalPrice / 100 / divisor) * 100) / 100
  }

  return {
    subscriptionId: sub.id,
    status: sub.status,
    planName: sub.plan?.name || '',
    planCode: sub.plan?.code || '',
    billingCycle: cycle,
    currentPeriodEnd: sub.currentPeriodEnd || null,
    discount: sub.planPrice?.discountPercentage ?? null,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    price: monthlyPrice,
    currency: sub.planPrice?.currency || 'EUR',
    startedAt: sub.startedAt || null
  }
}

/**
 * Derives payment method from a legacy package entity (packages API).
 * @param {Object|undefined} pkg
 * @returns {PaymentMethodInfo|null}
 */
function derivePaymentMethodFromPackage(pkg) {
  if (!pkg) return null
  const pm = pkg.payment_method
  if (!pm) return null
  const card = pm.card || pm
  if (!card.last4) return null
  return {
    brand: card.brand || '',
    last4: card.last4,
    expMonth: card.exp_month || 0,
    expYear: card.exp_year || 0
  }
}

/**
 * Derives invoice list from a legacy package entity.
 * @param {Object|undefined} pkg
 * @returns {InvoiceInfo[]}
 */
function deriveInvoicesFromPackage(pkg) {
  if (!pkg) return []
  const list = pkg.invoices
  if (!Array.isArray(list) || !list.length) return []
  return list.map(inv => ({
    id: inv.id,
    date: inv.created
      ? new Date(inv.created * 1000).toISOString()
      : inv.date || '',
    amount: inv.amount_paid != null ? inv.amount_paid / 100 : inv.amount || 0,
    currency: inv.currency || 'EUR',
    status: inv.status || 'paid',
    receiptUrl: inv.hosted_invoice_url || inv.receipt_url || null
  }))
}

// ---------------------------------------------------------------------------

/**
 * Provides the active subscription, payment method, and invoice history for
 * the current user.
 *
 * - Fetches subscriptions from GET /subscriptions (new architecture).
 * - Falls back to legacy packages detection for retrocompat.
 * - Returns isLegacy=true when the user has a package but no subscription.
 *
 * @returns {UseSubscriptionResult}
 */
function useSubscription() {
  const dispatch = useDispatch()

  const subscriptionsState = useSelector(subscriptionsSelector)
  const activeSubscription = useSelector(activeSubscriptionSelector)
  const billing = useSelector(billingSelector)

  // Legacy packages — kept for payment method / invoice fallback
  const packagesState = useSelector(packagesSelector)
  const { data: packagesData, loading: packagesLoading } = packagesState

  // Also trigger packages fetch for payment method / legacy detection
  usePackages({ preload: true })

  useEffect(() => {
    const thunk = dispatch(fetchSubscriptionsThunk())
    return () => {
      thunk.abort()
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchBillingThunk())
  }, [dispatch])

  const refetchBilling = useCallback(() => {
    dispatch(fetchBillingThunk())
  }, [dispatch])

  // Billing initial loading (suppress spinner on silent refetch when data already loaded)
  const billingLoading = billing.loading && billing.data === null

  const loading = subscriptionsState.loading || packagesLoading

  const subscription = useMemo(() => {
    if (!activeSubscription) return null
    return mapToSubscriptionInfo(activeSubscription)
  }, [activeSubscription])

  // Legacy: user has packages but no subscription
  const isLegacy = useMemo(() => {
    const hasSubscription = subscriptionsState.data.length > 0
    const hasPackage = packagesData.length > 0
    return !hasSubscription && hasPackage
  }, [subscriptionsState.data, packagesData])

  // Payment method: prefer live billing data from /me/billing, fallback to packages
  const paymentMethod = useMemo(() => {
    const billingPm = billing.data?.paymentMethod
    if (billingPm?.card?.last4) {
      return {
        brand: billingPm.card.brand || '',
        last4: billingPm.card.last4,
        expMonth: billingPm.card.exp_month || 0,
        expYear: billingPm.card.exp_year || 0
      }
    }
    // Fallback: legacy packages data
    const activePackage = packagesData[0]
    return derivePaymentMethodFromPackage(activePackage)
  }, [billing.data, packagesData])

  // Invoices: prefer live billing data from /me/billing, fallback to packages
  const invoices = useMemo(() => {
    const billingInvoices = billing.data?.invoices
    if (Array.isArray(billingInvoices) && billingInvoices.length > 0) {
      return billingInvoices.map(inv => ({
        id: inv.id,
        date: inv.created ? new Date(inv.created * 1000).toISOString() : '',
        amount: inv.amount_paid != null ? inv.amount_paid / 100 : 0,
        currency: inv.currency || 'EUR',
        status: inv.status || 'paid',
        receiptUrl: inv.hosted_invoice_url || null
      }))
    }
    // Fallback: legacy packages data
    const activePackage = packagesData[0]
    return deriveInvoicesFromPackage(activePackage)
  }, [billing.data, packagesData])

  return {
    subscription,
    paymentMethod,
    invoices,
    loading,
    isLegacy,
    refetchBilling,
    billingLoading
  }
}

export default useSubscription

/**
 * @typedef {'active'|'canceled'|'past_due'|'expired'|'trialing'|'cancel_at_period_end'} SubscriptionStatus
 */

/**
 * @typedef {Object} SubscriptionInfo
 * @property {number} subscriptionId
 * @property {SubscriptionStatus} status
 * @property {string} planName
 * @property {string} planCode
 * @property {string} billingCycle - 'monthly' | 'quarterly' | 'yearly'
 * @property {string|null} currentPeriodEnd - ISO date string
 * @property {number|null} discount - percentage 0-100
 * @property {boolean} cancelAtPeriodEnd
 * @property {number|null} price
 * @property {string} currency
 */

/**
 * @typedef {Object} PaymentMethodInfo
 * @property {string} brand - e.g. 'visa', 'mastercard', 'amex'
 * @property {string} last4
 * @property {number} expMonth
 * @property {number} expYear
 */

/**
 * @typedef {Object} InvoiceInfo
 * @property {string} id
 * @property {string} date - ISO date string
 * @property {number} amount
 * @property {string} currency
 * @property {'paid'|'open'|'void'|'uncollectible'} status
 * @property {string|null} receiptUrl
 */

/**
 * @typedef {Object} UseSubscriptionResult
 * @property {SubscriptionInfo|null} subscription
 * @property {PaymentMethodInfo|null} paymentMethod
 * @property {InvoiceInfo[]} invoices
 * @property {boolean} loading
 */
