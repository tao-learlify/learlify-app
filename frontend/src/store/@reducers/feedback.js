import { createSlice } from '@reduxjs/toolkit'
import { fetchFeedbackThunk } from 'store/@thunks/feedback'
import {
  fetchFeedbackFullfiledController,
  fetchFeedbackPendingController,
  fetchFeedbackRejectedController
} from 'store/@controllers/feedback'
import { exams, courses } from 'store/@entities/feedback'
import { clearErrorController } from 'store/@controllers'

/**
 * @typedef {Object} ExamEntity
 * @property {{}} data
 * @property {string | null} error
 * @property {boolean} loading
 */

/**
 * @typedef {Object} CourseEntity
 * @property {{}} data
 * @property {boolean} loading
 */

/**
 * @typedef {Object} FeedbackState
 * @property {ExamEntity} exams
 * @property {CourseEntity} courses
 */

const initialState = {
  [exams]: {
    data: null,
    error: null,
    loading: false
  },
  [courses]: {
    data: null,
    loading: false
  }
}

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearAsyncError: clearErrorController,
    clearFeedbackSync: (state) => {
      state[exams] = initialState[exams]
    }
  },
  extraReducers: {
    [fetchFeedbackThunk.pending]: fetchFeedbackPendingController,
    [fetchFeedbackThunk.rejected]: fetchFeedbackRejectedController,
    [fetchFeedbackThunk.fulfilled]: fetchFeedbackFullfiledController
  }
})

export const { clearAsyncError, clearFeedbackSync } = feedbackSlice.actions

export default feedbackSlice.reducer
