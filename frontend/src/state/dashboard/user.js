import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  pagination: {
    evaluations: 1
  }
}

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState: initialState,
  reducers: {
    /**
     * @typedef {Object} Pages
     * @property {'evaluations'} entity
     * @property {number} page
     */
    handleChangePage (state, action) {
      const { entity, page } = action.payload

      if (state.pagination[entity]) {
        state.pagination[entity] = page
      }
    }
  }
})

export const { handlePageChange } = userDashboardSlice.actions 

export default userDashboardSlice.reducer