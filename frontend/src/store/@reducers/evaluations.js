import { createSlice } from '@reduxjs/toolkit'

import {
  fetchEvaluationThunk,
  fetchEvaluationsThunk,
  fetchLatestThunk,
  fetchLatestEvaluationsThunk,
  updateEvaluationThunk,
  fetchTeacherOverviewThunk,
  patchEvaluationProcess
} from 'store/@thunks/evaluations'
import * as controller from 'store/@controllers/evaluations'
import { clearAsyncError } from 'store/@actions'
import { clearErrorController } from 'store/@controllers'

/**
 * @typedef {Object} LatestEntity
 * @property {LatestEvaluation []} data
 * @property {boolean} loading
 * @property {LatestEvaluation | null} selected
 */

/**
 * @typedef {Object} EvaluationEntity
 * @property {Evaluation []} data
 * @property {boolean} loading
 * @property {LatestEvaluation | null} selected
 */

/**
 * @typedef {Object} EvaluationState
 * @property {LatestEntity} latest
 * @property {EvaluationEntity} evaluations
 * @property {EvaluationEntity} owns
 * @property {string []} entities
 */

/**
 * @type {EvaluationState}
 */
const initialState = {
  evaluations: {
    data: [],
    loading: false,
    pagination: null,
    selected: null
  },
  latest: {
    data: [],
    loading: false,
    pagination: null,
    selected: null
  },
  owns: {
    data: [],
    loading: false,
    pagination: null,
    selected: null
  },
  count: {
    data: {
      classes: 0,
      speakings: 0,
      writings: 0
    },
    loading: false
  }
}

const evaluationSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    setEvaluation: controller.setEvaluationController,
    setComments: controller.setCommentsController,
    setScore: controller.setScoreController
  },
  extraReducers: {
    [clearAsyncError]: clearErrorController,

    [fetchTeacherOverviewThunk.fulfilled]: controller.setCountOverViewController,
    [fetchTeacherOverviewThunk.pending]: controller.setCountOverViewLoading,


    [fetchLatestEvaluationsThunk.fulfilled]: controller.fetchLatestsFullfiled,
    [fetchLatestEvaluationsThunk.pending]: controller.fetchLatestPending,
    [fetchLatestEvaluationsThunk.rejected]: controller.fetchLatestRejected,

    [fetchLatestThunk.fulfilled]: controller.fetchLatestFulfilled,
    [fetchLatestThunk.rejected]: controller.fetchLatestRejected,
    [fetchLatestThunk.pending]: controller.fetchLatestPending,

    [fetchEvaluationsThunk.fulfilled]: controller.fetchEvaluationsFullfiled,
    [fetchEvaluationsThunk.pending]: controller.fetchEvaluationsPending,
    [fetchEvaluationsThunk.rejected]: controller.fetchEvaluationsRejected,

    [fetchEvaluationThunk.fulfilled]: controller.fetchEvaluationFulfilled,
    [fetchEvaluationThunk.pending]: controller.fetchEvaluationsPending,
    [fetchEvaluationThunk.rejected]: controller.fetchEvaluationsRejected,

    [updateEvaluationThunk.fulfilled]: controller.updateEvaluationFullfiled,
    [updateEvaluationThunk.pending]: controller.updateEvaluationPending,
    [updateEvaluationThunk.rejected]: controller.updateEvaluationRejected,

    [patchEvaluationProcess.fulfilled]: controller.patchEvaluationProcessController
  }
})

export const { setEvaluation, setComments, setScore } = evaluationSlice.actions

export default evaluationSlice.reducer
