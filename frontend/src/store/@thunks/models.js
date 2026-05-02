import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchModelsThunk = createAsyncThunk(
  'models/fetch',
  async (args = null, { rejectWithValue, signal }) => {
    try {
      const models = await api.models.fetchModels({ signal })

      return models
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const patchModelThunk = createAsyncThunk(
  'models/patch',
  async (name, { rejectWithValue }) => {
    try {
      const model = await api.models.patchModel({
        name
      })


      return model
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
