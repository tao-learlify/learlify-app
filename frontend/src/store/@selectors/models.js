import { createSelector } from '@reduxjs/toolkit'

/**
 * @param {AppState} state 
 */
const hook = state => state.models


/**
 * @type {import('store/@reducers/models').ModelState}
 */
export const modelSelector = createSelector(
  [hook],
  models => models
)