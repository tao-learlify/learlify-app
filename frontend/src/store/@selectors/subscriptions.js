import { createSelector } from '@reduxjs/toolkit'

const selector = state => state.subscriptions

export const subscriptionsSelector = createSelector(
  selector,
  ({ subscriptions }) => subscriptions
)

export const creatingSubscriptionSelector = createSelector(
  selector,
  ({ creating }) => creating
)

export const cancelingSubscriptionSelector = createSelector(
  selector,
  ({ canceling }) => canceling
)

/**
 * Returns the most recent active subscription, or null.
 * Prioritizes status=active; if none, returns first subscription.
 * @type {import('@reduxjs/toolkit').Selector<*, import('@types/subscriptions').Subscription|null>}
 */
export const activeSubscriptionSelector = createSelector(
  subscriptionsSelector,
  ({ data }) => {
    if (!data.length) return null
    return data.find(s => s.status === 'active') || data[0]
  }
)
