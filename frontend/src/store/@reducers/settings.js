import { createSlice } from '@reduxjs/toolkit'
import { updateDocumentTitleWithNotification } from 'providers/document'
import { fetchYoutubeVideosThunk } from 'store/@thunks/settings'

/**
 * @typedef {Object} SettingsState
 * @property {string} appTitle
 * @property {boolean} network
 * @property {boolean} darkMode
 */

/**
 * @type {SettingsState}
 */
const initialState = {
  darkMode: false,
  network: window.navigator.onLine,
  appTitle: document.title,
  videos: null
}

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateNetwork(state, action) {
      state.network = action.payload
    },

    switchDarkMode(state, action) {
      state.darkMode = action.payload
    },
  },
  extraReducers: {
    [fetchYoutubeVideosThunk.fulfilled]: (state, action) => {
      state.videos = action.payload.response
    }
  }
})

export const { switchDarkMode, updateNetwork } = settings.actions

export default settings.reducer