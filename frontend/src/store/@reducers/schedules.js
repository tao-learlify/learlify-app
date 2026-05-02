import { createSlice } from '@reduxjs/toolkit'
import { createScheduleThunk, fetchSchedulesThunk } from 'store/@thunks/schedules'

import * as controller from 'store/@controllers/schedules'

/**
 * @typedef {Object} ClassEntity
 * @property {Classes []} data
 * @property {boolean} loading
 * @property {Classes} instance
 * @property {Error | null} error
 */

/**
 * @typedef {Object} MeetingsEntity
 * @property {Meeting []} data
 * @property {boolean} loading
 * @property {Meeting} instance
 */

 /**
 * @typedef {Object} SchedulesEntity
 * @property {Schedule []} data
 * @property {boolean} loading
 * @property {Schedule} instance
 */

/**
 * @typedef {Object} ScheduleState
 * @property {ClassEntity} classes
 * @property {MeetingsEntity} meetings
 * @property {SchedulesEntity} schedules
 * @property {string []} entities
 */

/**
 * @type {ScheduleState}
 */
const initialState = {
  schedules: {
    data: [],
    loading: false,
    selected: null,
    staged: null
  }
}

const slice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    createStagedSchedule: (state, action) => {
      state.schedules.staged = action.payload
    }
  },
  extraReducers: {
    [fetchSchedulesThunk.pending]: controller.fetchSchedulesPending,
    [fetchSchedulesThunk.rejected]: controller.fetchSchedulesRejected,
    [fetchSchedulesThunk.fulfilled]: controller.fetchSchedulesFullfiled,
    [createScheduleThunk.fulfilled]: controller.createScheduleFullfiled,
    [createScheduleThunk.pending]: controller.fetchSchedulesPending,
    [createScheduleThunk.rejected]: controller.fetchSchedulesRejected,
  }
})

export const { createStagedSchedule } = slice.actions

export default slice.reducer
