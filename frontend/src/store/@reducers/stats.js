import { createSlice } from '@reduxjs/toolkit'
import { fetchStatsThunk } from 'store/@thunks/stats'
import {
  fetchStatsFullfiledController,
  fetchStatsRejectedController,
  fetchStatsPendingController
} from 'store/@controllers/stats'

/**
 * @typedef {Object} StatsEntity
 * @property {[]} data
 * @property {boolean} loading
 */

/**
 * @typedef {Object} StatsState
 * @property {StatsEntity} stats
 * @property {string []} entities
 */

/**
 * @type {StatsState}
 */
export const initialState = {
  stats: {
    data: [],
    loading: false
  }
}

const stats = createSlice({
  name: 'stats',
  initialState,
  extraReducers: {
    [fetchStatsThunk.fulfilled]: fetchStatsFullfiledController,
    [fetchStatsThunk.pending]: fetchStatsPendingController,
    [fetchStatsThunk.rejected]: fetchStatsRejectedController
  }
})

export default stats.reducer
