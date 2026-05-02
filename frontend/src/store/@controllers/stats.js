/**
 * @param {import ('store/@reducers/stats').StatsState} state 
 * @param {import ('@reduxjs/toolkit').Action} action 
 */
export const fetchStatsFullfiledController = (state, action) => {
  state.stats.data = action.payload.response
  state.stats.loading = false
}

/**
 * @param {import ('store/@reducers/stats').StatsState} state 
 */
export const fetchStatsRejectedController = (state) => {
  state.stats.loading = false
}

/**
 * @param {import ('store/@reducers/stats').StatsState} state 
 */
export const fetchStatsPendingController = (state) => {
  state.stats.loading = true
}