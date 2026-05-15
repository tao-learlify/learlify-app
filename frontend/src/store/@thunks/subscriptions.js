import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { adaptSubscription } from 'api/subscriptions'

export const fetchSubscriptionsThunk = createAsyncThunk(
  'subscriptions/fetch',
  async (args = null, { signal, rejectWithValue }) => {
    try {
      const result = await api.subscriptions.getMySubscriptions({ signal })
      const raw = Array.isArray(result.response) ? result.response : []
      return { response: raw.map(adaptSubscription) }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const createSubscriptionThunk = createAsyncThunk(
  'subscriptions/create',
  async (dto, { rejectWithValue }) => {
    try {
      const result = await api.subscriptions.createSubscription(dto)
      return { response: adaptSubscription(result.response) }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const cancelSubscriptionThunk = createAsyncThunk(
  'subscriptions/cancel',
  async ({ subscriptionId, immediately }, { dispatch, rejectWithValue }) => {
    try {
      const result = await api.subscriptions.cancelSubscription(
        subscriptionId,
        {
          immediately: Boolean(immediately)
        }
      )
      // Refresh list after cancel
      dispatch(fetchSubscriptionsThunk())
      return { response: adaptSubscription(result.response) }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const cancelAtPeriodEndThunk = createAsyncThunk(
  'subscriptions/cancelAtPeriodEnd',
  async ({ subscriptionId }, { dispatch, rejectWithValue }) => {
    try {
      const result =
        await api.subscriptions.patchCancelAtPeriodEnd(subscriptionId)
      dispatch(fetchSubscriptionsThunk())
      return { response: adaptSubscription(result.response) }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const reactivateSubscriptionThunk = createAsyncThunk(
  'subscriptions/reactivate',
  async ({ subscriptionId }, { dispatch, rejectWithValue }) => {
    try {
      const result = await api.subscriptions.patchReactivate(subscriptionId)
      dispatch(fetchSubscriptionsThunk())
      return { response: adaptSubscription(result.response) }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchBillingThunk = createAsyncThunk(
  'subscriptions/fetchBilling',
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.subscriptions.getBilling()
      return { response: result.response }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
