/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 */
export const fetchSubscriptionsPendingController = state => {
  state.subscriptions.loading = true
  state.subscriptions.error = null
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 * @param {import('@reduxjs/toolkit').Action} action
 */
export const fetchSubscriptionsFulfilledController = (state, action) => {
  state.subscriptions.loading = false
  state.subscriptions.data = action.payload.response
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 * @param {import('@reduxjs/toolkit').Action} action
 */
export const fetchSubscriptionsRejectedController = (state, action) => {
  state.subscriptions.loading = false
  state.subscriptions.error = action.payload || true
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 */
export const createSubscriptionPendingController = state => {
  state.creating.loading = true
  state.creating.error = null
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 * @param {import('@reduxjs/toolkit').Action} action
 */
export const createSubscriptionFulfilledController = (state, action) => {
  state.creating.loading = false
  state.subscriptions.data.push(action.payload.response)
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 * @param {import('@reduxjs/toolkit').Action} action
 */
export const createSubscriptionRejectedController = (state, action) => {
  state.creating.loading = false
  state.creating.error = action.payload || true
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 */
export const cancelSubscriptionPendingController = state => {
  state.canceling.loading = true
  state.canceling.error = null
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 * @param {import('@reduxjs/toolkit').Action} action
 */
export const cancelSubscriptionFulfilledController = (state, action) => {
  state.canceling.loading = false
  const updated = action.payload.response
  const idx = state.subscriptions.data.findIndex(s => s.id === updated.id)
  if (idx !== -1) {
    state.subscriptions.data[idx] = updated
  }
}

/**
 * @param {import('store/@reducers/subscriptions').SubscriptionsState} state
 * @param {import('@reduxjs/toolkit').Action} action
 */
export const cancelSubscriptionRejectedController = (state, action) => {
  state.canceling.loading = false
  state.canceling.error = action.payload || true
}
