import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchCategoriesThunk = createAsyncThunk(
  'fetch/categories',
  async (args = null, { rejectWithValue, signal }) => {
    try {
      const categories = await api.categories.fetchCategories({ signal })

      return {
        ...categories,
        entity: 'categories'
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
