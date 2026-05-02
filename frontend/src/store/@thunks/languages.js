import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'api'

export const fetchLanguagesThunk = createAsyncThunk(
  'languages/fetch',
  async (_, { rejectWithValue, signal }) => {
    try {
      const languages = await api.languages.fetchLanguages({
        signal
      })

      return languages
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
