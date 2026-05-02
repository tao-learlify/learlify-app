/**
 * @param {import ('store/@reducers/models').ModelsState} state 
 * @param {import ('@reduxjs/toolkit').Action} action 
 */
export const fetchModelsFullfiledController = (state, action) => {
  state.models.data = action.payload.response
  state.models.loading = false
}

/**
 * @param {import ('store/@reducers/models').ModelsState} state 
 */
export const fetchModelsRejectedController = (state, action) => {
  state.models.loading = false
}

/**
 * @param {import ('store/@reducers/models').ModelsState} state 
 */
export const fetchModelsPendingController = (state) => {
  state.models.loading = true
}