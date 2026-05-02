import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchLatestEvaluationsThunk = createAsyncThunk(
  'latests/fetch',
  /**
   * @param {number} page
   */
  async ({ page }, { rejectWithValue, signal }) => {
    try {
      const evaluations = await api.evaluations.fetchLatests({
        page,
        signal
      })

      return evaluations
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchEvaluationsThunk = createAsyncThunk(
  'evaluations/fetch',
  async ({ page, own, model }, { rejectWithValue, signal }) => {
    try {
      const evaluations = await api.evaluations.fetchEvaluations({
        own,
        page,
        signal,
        model
      })
      
      return {
        ...evaluations,
        own
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchEvaluationThunk = createAsyncThunk(
  'evaluation/fetch',
  async (id, { rejectWithValue, signal }) => {
    try {
      const evaluation = await api.evaluations.fetchEvaluation({
        id,
        signal
      })

      return evaluation
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchLatestThunk = createAsyncThunk(
  'latest/fetch',
  async (id, { rejectWithValue, signal }) => {
    try {
      const latest = await api.evaluations.fetchLatest({
        id,
        signal
      })

      return latest
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const updateEvaluationThunk = createAsyncThunk(
  'evaluations/update',
  async (data, { rejectWithValue }) => {
    try {
      /**
       * @description
       * You should not pass "own" argument to api call, should only patch to redux thunk promise.
       */
      const evaluation = await api.evaluations.updateEvaluation(data)

      return evaluation
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)


export const fetchTeacherOverviewThunk = createAsyncThunk(
  'evaluations/count',
  async (data = null, { rejectWithValue }) => {
    try {
      const count = await api.evaluations.fetchTeacherOverview()

      return count
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const patchEvaluationProcess = createAsyncThunk(
  'evaluations/patch',
  async ({ id }, { rejectWithValue }) => {
    try {
      const evaluation = await api.evaluations.patchEvaluation({ id })
      return evaluation
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)