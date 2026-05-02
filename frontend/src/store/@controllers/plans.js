/**
 * @param {import ('store/@reducers/plans').PlansState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const fetchPlansFullfiledController = (state, action) => {
  const [initial] = action.payload.response

  state.plans.data = action.payload.response
  state.plans.selected = initial
  state.plans.loading = false
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchPlansRejectedController = state => {
  state.plans.loading = false
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchPlansPendingController = state => {
  state.plans.loading = true
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const fetchOffersFullfiledController = (state, action) => {
  const [initial] = action.payload.response

  state.plans.selected = initial

  state.offers.data = action.payload.response

  state.offers.loading = false
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchOffersRejectedController = state => {
  state.offers.loading = false
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchOffersPendingController = state => {
  state.offers.loading = true
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchPricingPendingController = state => {
  state.pricing.loading = true
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchPricingFullfiledController = (state, action) => {
  state.pricing.loading = false
  state.pricing.data = action.payload.response
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchPricingRejectedController = (state, action) => {
  state.pricing.loading = false
  state.pricing.error = action.payload || true
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const selectPlanController = (state, action) => {
  const matcher = p => p.name === action.payload || p.code === action.payload

  const fromCatalog = state.catalog.data.find(matcher)
  const fromPlans = state.plans.data.find(matcher)
  const fromOffers = state.offers.data.find(matcher)
  const fromPricing = state.pricing.data.find(matcher)

  const found = fromCatalog || fromPlans || fromOffers || fromPricing
  if (found) {
    state.plans.selected = found
  }
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const selectBillingCycleController = (state, action) => {
  state.pricing.selectedBillingCycle = action.payload
}

// ---------------------------------------------------------------------------
// Catalog (GET /plans/catalog)
// ---------------------------------------------------------------------------

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 */
export const fetchCatalogPendingController = state => {
  state.catalog.loading = true
  state.catalog.error = null
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const fetchCatalogFulfilledController = (state, action) => {
  state.catalog.loading = false
  state.catalog.data = action.payload.response
}

/**
 * @param {import ('store/@reducers/plans').PlansState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const fetchCatalogRejectedController = (state, action) => {
  state.catalog.loading = false
  state.catalog.error = action.payload || true
}
