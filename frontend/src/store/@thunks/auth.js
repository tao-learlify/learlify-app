import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const loginThunk = createAsyncThunk(
  'auth/login',
  /**
   * @param {{ email?: string, password?: string }} user
   */
  async (user, middleware) => {
    try {
      const login = await api.auth.login(user, middleware.signal)

      return login
    } catch (err) {
      return middleware.rejectWithValue(err)
    }
  }
)

export const demoThunk = createAsyncThunk(
  'auth/demo',
  async (_arg = null, { rejectWithValue }) => {
    try {
      const demo = await api.auth.demo()

      return demo
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const socialThunk = createAsyncThunk(
  'auth/social',
  async ({ user, provider }, { rejectWithValue }) => {
    try {
      const service = await api.auth.loginSocial(user, provider)

      return service
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgot',
  async ({ email}, { rejectWithValue }) => {
    try {
      const recover = await api.auth.forgotPassword(email)

      return recover
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const updateProfileThunk = createAsyncThunk(
  'auth/update',
  async ({ email, firstName, lastName }, { rejectWithValue }) => {
    try {
      const update = await api.auth.updateProfile({
        email,
        firstName,
        lastName
      })

      return update
    } catch (err) {
      return rejectWithValue(rejectWithValue)
    }
  }
)

export const signUpThunk = createAsyncThunk(
  'auth/register',
  async ({ email, firstName, lastName, password }, { rejectWithValue }) => {
    try {
      const token = await api.auth.signUp({
        email,
        firstName,
        lastName,
        password
      })

      return token
    } catch (err) {
      return rejectWithValue(err) 
    }
  }
) 

export const verificationThunk = createAsyncThunk(
  'auth/verify',
  async ({ code }, { rejectWithValue }) => {
    try {
      const token = await api.auth.verifyAccount({
        code
      })

      return token
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)