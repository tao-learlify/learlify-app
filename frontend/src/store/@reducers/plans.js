import { createSlice } from '@reduxjs/toolkit'
import {
  fetchPlansThunk,
  fetchOffersThunk,
  fetchPricingThunk,
  fetchCatalogThunk
} from 'store/@thunks/plans'
import {
  fetchOffersFullfiledController,
  fetchOffersPendingController,
  fetchOffersRejectedController,
  fetchPlansFullfiledController,
  fetchPlansPendingController,
  fetchPlansRejectedController,
  fetchPricingPendingController,
  fetchPricingFullfiledController,
  fetchPricingRejectedController,
  fetchCatalogPendingController,
  fetchCatalogFulfilledController,
  fetchCatalogRejectedController,
  selectBillingCycleController,
  selectPlanController
} from 'store/@controllers/plans'

/**
 * @typedef {Object} PlanEntity
 * @property {Plan []} data
 * @property {boolean} loading
 */

/**
 * @typedef {Object} PlansState
 * @property {PlanEntity} plans
 * @property {string []} entities
 */

/**
 * @type {PlansState}
 */
const initialState = {
  plans: {
    data: [],
    loading: false,
    selected: null
  },
  offers: {
    data: [],
    loading: false,
    selected: null
  },
  pricing: {
    data: [],
    loading: false,
    selected: null,
    selectedBillingCycle: 'monthly'
  },
  catalog: {
    data: [],
    loading: false,
    error: null
  }
}

const plans = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    select: selectPlanController,
    selectBillingCycle: selectBillingCycleController
  },
  extraReducers: {
    [fetchOffersThunk.fulfilled]: fetchOffersFullfiledController,
    [fetchOffersThunk.pending]: fetchOffersPendingController,
    [fetchOffersThunk.rejected]: fetchOffersRejectedController,

    [fetchPlansThunk.fulfilled]: fetchPlansFullfiledController,
    [fetchPlansThunk.pending]: fetchPlansPendingController,
    [fetchPlansThunk.rejected]: fetchPlansRejectedController,

    [fetchPricingThunk.fulfilled]: fetchPricingFullfiledController,
    [fetchPricingThunk.pending]: fetchPricingPendingController,
    [fetchPricingThunk.rejected]: fetchPricingRejectedController,

    [fetchCatalogThunk.fulfilled]: fetchCatalogFulfilledController,
    [fetchCatalogThunk.pending]: fetchCatalogPendingController,
    [fetchCatalogThunk.rejected]: fetchCatalogRejectedController
  }
})

export const { select, selectBillingCycle } = plans.actions

export default plans.reducer
