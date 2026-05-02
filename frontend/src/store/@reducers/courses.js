import { createSlice } from '@reduxjs/toolkit'
import {
  createAdvanceFullfiled,
  createAdvancePending,
  createAdvanceRejected,
  fetchAdvanceFulfilled,
  fetchAdvancePending,
  fetchAdvanceRejected,
  fetchCoursesControllerFulfilled,
  fetchCoursesControllerPending,
  fetchCoursesControllerRejected
} from 'store/@controllers/courses'
import { createAdvanceThunk, fetchAdvanceThunk, fetchCoursesThunk } from 'store/@thunks/courses'

const initialState = {
  advance: {
    data: [],
    loading: false,
    selected: null,
    unlockedUnits: [],
  },
  courses: {
    data: [],
    loading: false,
    selected: null
  }
}

const coursesSlice = createSlice({
  extraReducers: {
    [fetchCoursesThunk.fulfilled]: fetchCoursesControllerFulfilled,
    [fetchCoursesThunk.rejected]: fetchCoursesControllerRejected,
    [fetchCoursesThunk.pending]: fetchCoursesControllerPending,
    [createAdvanceThunk.fulfilled]: createAdvanceFullfiled,
    [createAdvanceThunk.pending]: createAdvancePending,
    [createAdvanceThunk.rejected]: createAdvanceRejected,
    [fetchAdvanceThunk.fulfilled]: fetchAdvanceFulfilled,
    [fetchAdvanceThunk.pending]: fetchAdvancePending,
    [fetchAdvanceThunk.rejected]: fetchAdvanceRejected
  },
  initialState,
  name: 'courses',
  reducers: {
    unmountCoursesProcess (state) {
      state.courses.data = []
      state.courses.advance = []
    },

    updateLocalUnit (state, action) {}
  }
})

export const { unmountCoursesProcess, updateLocalUnit } = coursesSlice.actions

export default coursesSlice.reducer
