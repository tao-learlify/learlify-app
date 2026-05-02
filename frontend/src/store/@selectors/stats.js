import { createSelector } from '@reduxjs/toolkit'

const statsPieceOfState = state => state.stats

/**
 * @returns {import ('@reduxjs/toolkit').OutputSelector<import ('store/@reducers/stats').StatsState>}
 */
export const statsSelector = createSelector(
  statsPieceOfState,
  ({ stats }) => stats
)
