import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} StopwatchState
 * @property {number} timer
 * @property {number | null} snapshot
 */

/**
 * @type {StopwatchState}
 */
export const initialState = {
  snapshot: null,
  timer: 0
}

const FREQUENCY_RATIO_SPEED = 50

const stopwatchSlice = createSlice({
  name: 'stopwatch',
  initialState,
  reducers: {
    setSnapshot (state, action) {
      state.snapshot = action.payload
    },


    increaseTimer (state) {
      state.timer += FREQUENCY_RATIO_SPEED
    },

    refreshTimer (state) {
      state.timer = 0
      state.snapshot = null
    }
  }
})

export const { setSnapshot, increaseTimer, refreshTimer } = stopwatchSlice.actions

export default stopwatchSlice.reducer