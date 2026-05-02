/**
 * @param {import ('store/@reducers/categories').CategoryState} state 
 * @param {import ('@reduxjs/toolkit').Action} action 
 */
export const fetchCategoriesFullfiledController = (state, action) => {
  state.categories.data = action.payload.response
  state.categories.loading = false
}

/**
 * @param {import ('store/@reducers/categories').CategoryState} state 
 */
export const fetchCategoriesRejectedController = (state) => {
  state.categories.loading = false
}

/**
 * @param {import ('store/@reducers/categories').CategoryState} state 
 */
export const fetchCategoriesPendingController = (state) => {
  state.categories.loading = true
}