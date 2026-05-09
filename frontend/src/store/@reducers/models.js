import { createSlice } from '@reduxjs/toolkit'
import { clearAsyncError } from 'store/@actions'
import { fetchModelsThunk, patchModelThunk } from 'store/@thunks/models'
import {
  fetchModelsFullfiledController,
  fetchModelsPendingController,
  fetchModelsRejectedController
} from 'store/@controllers/models'

import { clearErrorController } from 'store/@controllers'

import * as localStorageHydrate from 'utils/localStorage'

/**
 * @typedef {Object} ModelEntity
 * @property {boolean} loading
 * @property {Model []} data
 * @property {'Aptis' | 'IELTS'} selected
 */

/**
 * @typedef {Object} ModelState
 * @property {ModelEntity} models
 * @property {string []} entities
 */

/**
 * @type {ModelState}
 */
const initialState = {
  models: {
    error: null,
    data: [],
    loading: false,
    selected: localStorageHydrate.getModelSession()
  }
}

const models = createSlice({
  name: 'models',
  initialState,
  reducers: {
    selectModel(state, action) {
      state.models.selected = action.payload
    }
  },
  extraReducers: {
    [clearAsyncError]: clearErrorController,
    [fetchModelsThunk.fulfilled]: fetchModelsFullfiledController,
    [fetchModelsThunk.pending]: fetchModelsPendingController,
    [fetchModelsThunk.rejected]: fetchModelsRejectedController,
    [patchModelThunk.fulfilled]: state => {
      state.models.loading = false
    },
    [patchModelThunk.rejected]: state => {
      state.models.loading = false
    },
    [patchModelThunk.pending]: fetchModelsPendingController
  }
})

export const { selectModel } = models.actions

export default models.reducer
