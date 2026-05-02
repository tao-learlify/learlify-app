import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getFilename } from 'utils/functions'

const FILES = 'files'

export const fetchExamsThunk = createAsyncThunk(
  'exams/fetchAll',
  /**
   * @param {string} model
   */
  async (model, { signal, rejectWithValue }) => {
    try {
      const exams = await api.exams.fetchExams({ model, signal })

      return {
        ...exams,
        entity: 'exams'
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchExamThunk = createAsyncThunk(
  'exams/fetchOne',
  async ({ id, category }, { signal, rejectWithValue }) => {
    try {
      const exam = await api.exams.fetchExam({ id, signal })

      return {
        ...exam,
        category,
        entity: 'exams'
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const createProgressThunk = createAsyncThunk(
  'progress/create',

  async (data, { rejectWithValue }) => {
    try {
      const progress = await api.exams.createProgress(data)

      return {
        ...progress,
        entity: 'progress'
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchProgressThunk = createAsyncThunk(
  'progress/fetch',
  async (data, { rejectWithValue }) => {
    try {
      const progress = await api.exams.fetchProgress(data)

      return progress
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

/**
 * Updates progress synchronously.
 */
export const updateProgressThunk = createAsyncThunk(
  'progress/update',
  async ({ recordings, ...data}, { rejectWithValue, getState }) => {
    try {
      /**
       * @see https://redux.js.org/api/store
       */
      const { auth: { user }} = getState()

      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
       */
      const multipart = new FormData()
      /**
       * @description
       * If recordings are being presented we should make a multipart form data.
       */
      if (recordings.length > 0) {
        /**
         * @description
         * Transforrm all multipart form data into a single chuck of blobs.
         */
        recordings.forEach((recording) =>
          multipart.append(
            FILES,
            recording.blob,
            getFilename(user),
          )
        )
      }

      /**
       * @description
       * Saving JSON file.
       */
      multipart.append(FILES, JSON.stringify(data))

      const progress = await api.exams.updateProgress({
        formData: multipart,
        token: user.token
      })

      return progress
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const patchProgressThunk = createAsyncThunk(
  'progress/patch',
  async (data, { rejectWithValue }) => {
    try {
      const progress = await api.exams.patchProgress(data)
      

      return progress
    } catch (err) {

      return rejectWithValue(err)
    }
  }
)
