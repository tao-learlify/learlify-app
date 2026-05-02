import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} ConfigState
 * @property {boolean} edit
 */

/**
 * @type {ConfigState}
 */
export const initialState = {
  edit: false
}

const configSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {}
})

export default configSlice.reducer