import { createSlice}  from '@reduxjs/toolkit'
import { fetchLanguagesThunk } from 'store/@thunks/languages'
import * as controller from 'store/@controllers/languages'

/**
 * @typedef {Object} LanguagesState
 * @property {Language []} data
 * @property {boolean} loading
 */

const initialState = {
  data: [],
  loading: false,
  selected: null
}

const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    selectLang: controller.selectLanguageStaged
  },
  extraReducers: {
    [fetchLanguagesThunk.pending]: controller.fetchLanguagesPending,
    [fetchLanguagesThunk.rejected]: controller.fetchLanguagesRejected,
    [fetchLanguagesThunk.fulfilled]: controller.fetchLanguagesFullfiled
  }
})


export const { selectLang } = languagesSlice.actions

export default languagesSlice.reducer