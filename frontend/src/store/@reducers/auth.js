import { createSlice } from '@reduxjs/toolkit'
import { demoThunk, forgotPasswordThunk, loginThunk, signUpThunk, socialThunk, telegramThunk, updateProfileThunk, verificationThunk } from 'store/@thunks/auth'
import { clearAsyncError } from 'store/@actions'
import * as localStorageHydrate from 'store/functions/auth'

import {
  demoFullfiledController,
  loginFullfiledController,
  loginPendingController,
  loginRejectedController,
  logoutController,
  recoverPasswordMailController
} from 'store/@controllers/auth'
import { patchModelThunk } from 'store/@thunks/models'

/**
 * Hydrates if the user is a demo authentication flow.
 */
const demo = localStorageHydrate.isDemo()

/**
 * Hydrates if the user is authenticated.
 */
const isLoggedIn = localStorageHydrate.isLoggedIn()

/**
 * Once user is lodeaded should return the previous authentication flow.
 */
const user = localStorageHydrate.getTokenSession()

/**
 * @typedef {Object} AuthState
 * @property {User} user
 * @property {boolean} isLoggedIn
 * @property {boolean} loading
 * @property {Error} errors
 */

/**
 * @type {AuthState}
 */
const initialState = {
  user: user,
  demo: demo,
  isLoggedIn: isLoggedIn,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    logOut: logoutController
  },
  extraReducers: {
    [clearAsyncError]: (state) => {
      state.error = null
      state.loading = false
    },

    [patchModelThunk.fulfilled]: loginFullfiledController,

    [socialThunk.fulfilled]: loginFullfiledController,
    [socialThunk.pending]: loginPendingController,
    [socialThunk.rejected]: loginRejectedController,

    [telegramThunk.fulfilled]: loginFullfiledController,
    [telegramThunk.pending]: loginPendingController,
    [telegramThunk.rejected]: loginRejectedController,

    [loginThunk.fulfilled]: loginFullfiledController,
    [loginThunk.pending]: loginPendingController,
    [loginThunk.rejected]: loginRejectedController,

    [demoThunk.fulfilled]: demoFullfiledController,
    [demoThunk.pending]: loginPendingController,
    [demoThunk.rejected]: loginRejectedController,

    [forgotPasswordThunk.fulfilled]: recoverPasswordMailController,
    [forgotPasswordThunk.pending]: loginPendingController,
    [forgotPasswordThunk.rejected]: loginRejectedController,


    [updateProfileThunk.fulfilled]: loginFullfiledController,
    [updateProfileThunk.pending]: loginPendingController,
    [updateProfileThunk.rejected]: loginRejectedController,

    [signUpThunk.fulfilled]: loginFullfiledController,
    [signUpThunk.rejected]: loginRejectedController,
    [signUpThunk.pending]: loginPendingController,

    [verificationThunk.fulfilled]: loginFullfiledController,
    [verificationThunk.pending]: loginPendingController,
    [verificationThunk.rejected]: loginRejectedController
  }
})


export const { logOut } = authSlice.actions

export default authSlice.reducer
