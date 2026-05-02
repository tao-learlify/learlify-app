import { createSelector } from '@reduxjs/toolkit'

const hook = state => state.roles

export const rolesSelector = createSelector(
  hook,
  ({ roles }) => roles 
)