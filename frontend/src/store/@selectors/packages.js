import { createSelector } from '@reduxjs/toolkit'

const packagesPieceOfState = state => state.packages

export const packagesSelector = createSelector(
  packagesPieceOfState,
  ({ packages }) => packages
)