import { createSelector } from '@reduxjs/toolkit'

/**
 * @type {import('store/reducers/plans').PlansState} state
 */
const selector = state => state.plans

export const plansSelector = createSelector(selector, ({ plans }) => plans)

export const offersSelector = createSelector(selector, ({ offers }) => offers)

export const pricingSelector = createSelector(
  selector,
  ({ pricing }) => pricing
)

export const billingCycleSelector = createSelector(
  selector,
  ({ pricing }) => pricing.selectedBillingCycle
)

export const catalogSelector = createSelector(
  selector,
  ({ catalog }) => catalog
)
