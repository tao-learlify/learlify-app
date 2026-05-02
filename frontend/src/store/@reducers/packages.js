import { createSlice } from '@reduxjs/toolkit'
import { createPackageThunk, fetchPackagesThunk } from 'store/@thunks/packages'
import {
  fetchPackagesFullfiledController,
  fetchPackagesPendingController,
  fetchPackagesRejectedController
} from 'store/@controllers/packages'

/**
 * @typedef {Object} PackageEntity
 * @property {Package []} data
 * @property {boolean} loading
 * @property {string | null} error
 */

/**
 * @typedef {Object} PackageState
 * @property {PackageEntity} packages
 * @property {string []} entities
 */

/**
 * @type {PackageState}
 */
const initialState = {
  packages: {
    data: [],
    loading: false,
    error: null
  }
}

const packages = createSlice({
  name: 'packages',
  initialState,
  extraReducers: {
    [fetchPackagesThunk.fulfilled]: fetchPackagesFullfiledController,
    [fetchPackagesThunk.pending]: fetchPackagesPendingController,
    [fetchPackagesThunk.rejected]: fetchPackagesRejectedController,
    [createPackageThunk.fulfilled]: (state, action) => {
      if (action.payload.response.package) {
        state.packages.data.push(action.payload.response.package)
      }
    }
  }
})

export default packages.reducer
