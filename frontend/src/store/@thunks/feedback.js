import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFeedbackThunk = createAsyncThunk(
  'feedback/fetchOne',
  async (data, { rejectWithValue, signal }) => {
    try {
      const feedback = await api.feedback.getFeedback({
        ...data,
        signal
      })

      return feedback
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)