import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchYoutubeVideosThunk = createAsyncThunk(
  'fetch/videos', async (arg = null, { rejectWithValue, signal }) => {
    try {
      const videos = await api.settings.fetchYoutubeVideos({
        signal
      })

      return videos
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)