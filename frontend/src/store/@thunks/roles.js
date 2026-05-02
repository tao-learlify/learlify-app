import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRolesThunk = createAsyncThunk(
  'roles/fetch',
  async (data = null, { signal, rejectWithValue }) => {
    try {
      const roles = await api.roles.fetcRoles({ signal })

      return roles
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
