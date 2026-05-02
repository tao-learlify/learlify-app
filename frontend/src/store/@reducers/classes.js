import { createSlice } from '@reduxjs/toolkit'
import { createConfirmedClassThunk, fetchClassRoomsThunk, fetchClassRoomThunk } from 'store/@thunks/classes'

import * as controller from 'store/@controllers/classes'
import { fetchOutgoingClassThunk } from 'store/@thunks/schedules'

/**
 * @typedef {Object} ClassState
 * @property {ClassEntity} classes
 */

/**
 * @typedef {Object} ClassEntity
 * @property {[]} data
 * @property {boolean} loading
 * @property {{}} selected
 */

const initialState = {
  classes: {
    data: [],
    loading: false,
    online: null,
    rooms: [],
    selected: null,
    staged: {},
  }
}

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    joimRooms: (state, action) => {
      state.classes.rooms = action.payload
    },

    openClassRoom: (state, action) => {
      state.classes.online = action.payload
    },

    endClassRoomConnection: (state) => {
      state.classes.online = null
    }
  },
  extraReducers: {
    [createConfirmedClassThunk.pending]: controller.createConfirmedClassPending,
    [createConfirmedClassThunk.rejected]: controller.createConfirmedClassRejected,
    [createConfirmedClassThunk.fulfilled]: controller.createConfirmedClassFullfiled,
    [fetchOutgoingClassThunk.fulfilled]: controller.createOnlineStream,
    [fetchClassRoomsThunk.fulfilled]: controller.fetchConfirmedClassFullfiled,
    [fetchClassRoomsThunk.rejected]: controller.fetchConfirmedClassRejected,
    [fetchClassRoomsThunk.pending]: controller.fetchConfirmedClassPending,
    [fetchClassRoomThunk.fulfilled]: controller.fetchOnlineClassFullfiled,
    [fetchClassRoomThunk.pending]: controller.createConfirmedClassPending,
    [fetchClassRoomThunk.rejected]: controller.createConfirmedClassRejected
  }
})

export const { endClassRoomConnection, joimRooms, openClassRoom } = classSlice.actions

export default classSlice.reducer