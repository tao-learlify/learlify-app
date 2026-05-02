import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { adaptPlan } from 'api/plans'

export const fetchCatalogThunk = createAsyncThunk(
  'plans/catalog',
  async ({ modelId } = {}, { signal, rejectWithValue }) => {
    try {
      const result = await api.plans.getPlansCatalog({ modelId, signal })
      const raw = Array.isArray(result.response) ? result.response : []
      return { response: raw.map(adaptPlan) }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchPlansThunk = createAsyncThunk(
  'plans/fetch',
  async ({ model }, { signal, rejectWithValue }) => {
    try {
      const plans = await api.plans.fetchPlans({ model })

      return plans
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchOffersThunk = createAsyncThunk(
  'plans/offers',
  async ({ model }, { signal, rejectWithValue }) => {
    try {
      const plans = await api.plans.fetchPlans({ offers: true, model, signal })

      return plans
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchPricingThunk = createAsyncThunk(
  'plans/pricing',
  async ({ model, billingCycle } = {}, { signal, rejectWithValue }) => {
    try {
      const pricing = await api.plans.fetchPlans({
        pricing: true,
        model,
        billing_cycle: billingCycle,
        signal
      })

      return pricing
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
