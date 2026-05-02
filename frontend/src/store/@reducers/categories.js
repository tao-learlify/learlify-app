import { createSlice } from '@reduxjs/toolkit'
import { fetchCategoriesThunk } from 'store/@thunks/categories'
import {
  fetchCategoriesFullfiledController,
  fetchCategoriesPendingController,
  fetchCategoriesRejectedController
} from 'store/@controllers/categories'

/**
 * @typedef {Object} CategoryEntity
 * @property {Category []} data
 * @property {boolean} loading
 */

/**
 * @typedef {Object} CategoryState
 * @property {CategoryEntity} categories
 * @property {string []} entities
 */

/**
 * @type {CategoryState}
 */
const initialState = {
  categories: {
    data: [],
    loading: false
  }
}

const categories = createSlice({
  name: 'categories',
  initialState,
  extraReducers: {
    [fetchCategoriesThunk.fulfilled]: fetchCategoriesFullfiledController,
    [fetchCategoriesThunk.pending]: fetchCategoriesPendingController,
    [fetchCategoriesThunk.rejected]: fetchCategoriesRejectedController
  }
})

export default categories.reducer
