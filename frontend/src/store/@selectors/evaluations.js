import { createSelector } from '@reduxjs/toolkit'

const hook = state => state.evaluations

export const latestEvaluationsSelector = createSelector(
  hook,
  ({ latest }) => latest
)

export const evaluationSelector = createSelector(
  hook,
  ({ evaluations }) => evaluations
)

export const ownsSelector = createSelector(
  hook,
  ({ owns}) => owns
)

export const countSelector = createSelector(
  hook,
  ({ count }) => count
)