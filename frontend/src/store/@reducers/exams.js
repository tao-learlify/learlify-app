import { createSlice } from '@reduxjs/toolkit'
import {
  createProgressThunk,
  fetchExamsThunk,
  fetchExamThunk,
  fetchProgressThunk,
  updateProgressThunk
} from 'store/@thunks/exams'
import * as controller from 'store/@controllers/exams'
import { clearErrorController } from 'store/@controllers'
/**
 * @typedef {Object} ExamsEntity
 * @property {Exam []} data
 * @property {boolean} loading
 */

/**
 * @typedef {Object} ProgressEntity
 * @property {Progress []} data
 * @property {boolean} loading
 * @property {string | null} error
 * @property {boolean} synchronizing
 */

/**
 * @typedef {Object} ExamsState
 * @property {ExamsEntity} exams
 * @property {ProgressEntity} progress
 * @property {string []} entities
 */

/**
 * @type {ExamsState}
 */
const initialState = {
  exams: {
    data: [],
    error: null,
    instance: [],
    loading: false
  },
  progress: {
    cache: null,
    data: null,
    loading: false,
    synchronizing: false,
    error: null
  }
}

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearAsyncError: clearErrorController,
    syncCache: controller.syncProgressCached,
    grantControls: controller.grantControls,
    clearProgressSync: (state) => {
      state.progress = initialState.progress
    }
  },
  extraReducers: {
    [createProgressThunk.fulfilled]: controller.progressFullfiled,
    [createProgressThunk.pending]: controller.progressPending,
    [createProgressThunk.rejected]: controller.progressRejected,

    [updateProgressThunk.fulfilled]: controller.syncProgressFulliled,
    [updateProgressThunk.pending]: controller.syncProgressPending,
    [updateProgressThunk.rejected]: controller.syncProgressRejected,

    [fetchExamsThunk.fulfilled]: controller.examsFullfiled,
    [fetchExamsThunk.pending]: controller.examsPending,
    [fetchExamsThunk.rejected]: controller.examsRejected,

    [fetchExamThunk.fulfilled]: controller.examFullfiled,
    [fetchExamThunk.pending]: controller.examsPending,
    [fetchExamThunk.rejected]: controller.examsRejected,

    [fetchProgressThunk.fulfilled]: controller.progressFullfiled,
    [fetchProgressThunk.pending]: controller.progressPending,
    [fetchProgressThunk.rejected]: controller.progressRejected,
  }
})

export const { clearAsyncError, clearProgressSync, grantControls, syncCache } = examsSlice.actions

export default examsSlice.reducer
