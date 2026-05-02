import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'


export const fetchStatsThunk = createAsyncThunk(
  'stats/fetch',
  async (data = null, { rejectWithValue }) => {
    try {
      const stats = await api.stats.getStats({ model: data.name })
           
      return stats
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
