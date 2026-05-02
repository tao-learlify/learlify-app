import { createSlice } from '@reduxjs/toolkit'
import { fetchRolesThunk } from 'store/@thunks/roles'
import {
  fetchRolesFullfiledController,
  fetchRolesPendingController,
  fetchRolesRejectedController
} from 'store/@controllers/roles'

/**
 * @typedef {Object} RolesEntity
 * @property {Role []} data
 * @property {boolean} loading
 */

/**
 * @typedef {Object} RolesState
 * @property {RolesEntity} roles
 * @property {string []} entities
 */

/**
 * @type {RolesState}
 */
const initialState = {
  roles: {
    data: [],
    loading: false
  }
}

const roles = createSlice({
  name: 'roles',
  initialState,
  extraReducers: {
    [fetchRolesThunk.fulfilled]: fetchRolesFullfiledController,
    [fetchRolesThunk.pending]: fetchRolesPendingController,
    [fetchRolesThunk.rejected]: fetchRolesRejectedController
  }
})

export default roles.reducer
