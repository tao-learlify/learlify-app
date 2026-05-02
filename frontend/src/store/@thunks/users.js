import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'


/**
 * @typedef {Object} FetchUserThunk
 * @property {string} role
 * @property {number} page
 * @property {string} search
 * @property {AbortSignal} signal
 */

export const fetchUsersThunk = createAsyncThunk(
  'users/fetch',
  /**
   * @param {FetchUserThunk}
   */
  async ({ role, page, search }, { signal, rejectWithValue }) => {
    try {
      const users = await api.users.fetchUsers({
        role,
        page,
        search,
        signal
      })

      return users
    } catch (err) {
      return rejectWithValue(err)
    }
  })

  export const fetchTeachersThunk = createAsyncThunk(
    'teachers/fetch',
    /**
     * @param {FetchUserThunk}
     */
    async ({ role, page, search }, { signal, rejectWithValue }) => {
      try {
        const users = await api.users.fetchUsers({
          role,
          page,
          search,
          signal
        })
  
        return users
      } catch (err) {
        return rejectWithValue(err)
      }
    })
  