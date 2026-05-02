import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} ChatState
 * @property {string | null} room 
 * @property {string []} rooms */


/**
 * @type {ChatState}
 */
const initialState = {
  room: null,
  rooms: [],
}

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {}
})


export default chatSlice.reducer