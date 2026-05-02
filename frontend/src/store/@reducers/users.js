import { createSlice } from '@reduxjs/toolkit'
import { fetchTeachersThunk, fetchUsersThunk } from 'store/@thunks/users'
import * as entity from 'store/@entities/users'
import * as controller from 'store/@controllers/users'

/**
 * @typedef {Object} UserEntity
 * @property {User []} data
 * @property {boolean} loading
 * @property {User | null} selected
 */

/**
 * @typedef {Object} TeacherEntity
 * @property {User []} data
 * @property {boolean} loading
 * @property {User | null} selected
 */

/**
 * @typedef {Object} UsersState
 * @property {UserEntity} users
 * @property {TeacherEntity} teachers
 * @property {string []} entities
 */


/**
 * @type {UsersState}
 */
const initialState = {
  [entity.users]: {
    data: [],
    loading: false,
    selected: null
  },
  [entity.teachers]: {
    data: [],
    loading: false,
    selected: null
  },
}

const usersSlice = createSlice({
  name: entity.users,
  initialState,
  extraReducers: {
    [fetchUsersThunk.fulfilled]: controller.fetchUsersFullfiled,
    [fetchUsersThunk.pending]: controller.fetchUsersPending,
    [fetchUsersThunk.rejected]: controller.fetchUsersRejected,
    [fetchTeachersThunk.fulfilled]: controller.fetchTeachersFullfiled,
    [fetchTeachersThunk.pending]: controller.fetchTeachersPending,
    [fetchTeachersThunk.rejected]: controller.fetchTeachersRejected
  }
})


export default usersSlice.reducer
