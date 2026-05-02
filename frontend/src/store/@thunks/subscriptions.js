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
