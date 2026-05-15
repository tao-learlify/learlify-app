import { createSlice } from '@reduxjs/toolkit'
import {
  fetchSubscriptionsThunk,
  createSubscriptionThunk,
  cancelSubscriptionThunk,
  cancelAtPeriodEndThunk,
  reactivateSubscriptionThunk,
  fetchBillingThunk
} from 'store/@thunks/subscriptions'
import {
  fetchSubscriptionsPendingController,
  fetchSubscriptionsFulfilledController,
  fetchSubscriptionsRejectedController,
  createSubscriptionPendingController,
  createSubscriptionFulfilledController,
  createSubscriptionRejectedController,
  cancelSubscriptionPendingController,
  cancelSubscriptionFulfilledController,
  cancelSubscriptionRejectedController,
  cancelAtPeriodEndPendingController,
  cancelAtPeriodEndFulfilledController,
  cancelAtPeriodEndRejectedController,
  reactivatePendingController,
  reactivateFulfilledController,
  reactivateRejectedController,
  fetchBillingPendingController,
  fetchBillingFulfilledController,
  fetchBillingRejectedController
} from 'store/@controllers/subscriptions'

/**
 * @typedef {Object} SubscriptionEntity
 * @property {import('@types/subscriptions').Subscription[]} data
 * @property {boolean} loading
 * @property {*} error
 */

/**
 * @typedef {Object} AsyncEntity
 * @property {boolean} loading
 * @property {*} error
 */

/**
 * @typedef {Object} SubscriptionsState
 * @property {SubscriptionEntity} subscriptions
 * @property {AsyncEntity} creating
 * @property {AsyncEntity} canceling
 */

/** @type {SubscriptionsState} */
const initialState = {
  subscriptions: {
    data: [],
    loading: false,
    error: null
  },
  creating: {
    loading: false,
    error: null
  },
  canceling: {
    loading: false,
    error: null
  },
  billing: {
    data: null,
    loading: false,
    error: null
  }
}

const subscriptions = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchSubscriptionsThunk.pending]: fetchSubscriptionsPendingController,
    [fetchSubscriptionsThunk.fulfilled]: fetchSubscriptionsFulfilledController,
    [fetchSubscriptionsThunk.rejected]: fetchSubscriptionsRejectedController,

    [createSubscriptionThunk.pending]: createSubscriptionPendingController,
    [createSubscriptionThunk.fulfilled]: createSubscriptionFulfilledController,
    [createSubscriptionThunk.rejected]: createSubscriptionRejectedController,

    [cancelSubscriptionThunk.pending]: cancelSubscriptionPendingController,
    [cancelSubscriptionThunk.fulfilled]: cancelSubscriptionFulfilledController,
    [cancelSubscriptionThunk.rejected]: cancelSubscriptionRejectedController,

    [cancelAtPeriodEndThunk.pending]: cancelAtPeriodEndPendingController,
    [cancelAtPeriodEndThunk.fulfilled]: cancelAtPeriodEndFulfilledController,
    [cancelAtPeriodEndThunk.rejected]: cancelAtPeriodEndRejectedController,

    [reactivateSubscriptionThunk.pending]: reactivatePendingController,
    [reactivateSubscriptionThunk.fulfilled]: reactivateFulfilledController,
    [reactivateSubscriptionThunk.rejected]: reactivateRejectedController,

    [fetchBillingThunk.pending]: fetchBillingPendingController,
    [fetchBillingThunk.fulfilled]: fetchBillingFulfilledController,
    [fetchBillingThunk.rejected]: fetchBillingRejectedController
  }
})

export default subscriptions.reducer
