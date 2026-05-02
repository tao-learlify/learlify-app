import { createSelector } from '@reduxjs/toolkit'

/**
 * @param {AppState} state 
 */
const hook = state => state.auth

export const authSelector = createSelector(
  hook,
  auth => auth
)