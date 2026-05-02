import { createSelector } from '@reduxjs/toolkit'

const hook = state => state.settings

const network = state => state.settings.network

/**
 * @description
 * Selector for settings.
 */
const settingsSelector = createSelector(
  hook,
  (state) => state
)

const networkSelector = createSelector(
  network,
  state => state
)

export { settingsSelector, networkSelector }