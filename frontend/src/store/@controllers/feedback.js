/**
 * @param {import ('store/@reducers/feedback').FeedbackState} state 
 * @param {import ('@reduxjs/toolkit').Action} action 
 */
export const fetchFeedbackFullfiledController = (state, action) => {
  state.exams.data = action.payload.response
  state.exams.loading = false
}

/**
 * @param {import ('store/@reducers/feedback').FeedbackState} state 
 */
export const fetchFeedbackRejectedController = (state, action) => {
  state.exams.loading = false
  state.exams.error = action.payload
}

/**
 * @param {import ('store/@reducers/feedback').FeedbackState} state 
 */
export const fetchFeedbackPendingController = (state) => {
  state.exams.loading = true
}

