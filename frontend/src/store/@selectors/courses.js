import { createSelector } from '@reduxjs/toolkit'

const hook = state => state.courses

export const coursesSelector = createSelector(
  hook,
  ({ courses }) => courses
)


export const advanceSelector = createSelector(
  hook,
  ({ advance }) => advance
)

export const unlockedUnitsSelector = createSelector(
  hook,
  ({ advance }) => advance.unlockedUnits || []
)