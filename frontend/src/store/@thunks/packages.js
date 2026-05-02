import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPackagesThunk = createAsyncThunk(
  'packages/fetch',
  async (args = null, middleware) => {

    try {
      const packages = await api.packages.fetchPackages({
        signal: middleware.signal
      })

      return packages
    } catch (err) {
      return middleware.rejectWithValue(err)
    }
  }
)

export const createPackageThunk = createAsyncThunk(
  'packages/create',
  async (data, middleware) => {
    try {
      const intent = await api.packages.createPackage(data)

      return intent
    } catch (err) {
      return middleware.rejectWithValue(err)
    }
  }
)