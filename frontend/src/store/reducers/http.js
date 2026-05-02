import produce from 'immer'
import { HTTP_ERROR, REMOVE_HTTP_ERROR } from 'store/actions/types'

const initialState = {
  statusCode: null,
  message: null,
}

const httpReducer = produce(
  /**
   * @param {HttpState} state
   * @param {Action} action
   */
  (state = initialState, action) => {
  switch (action.type) {
    case HTTP_ERROR:
      if (action.message) {
        state.message = action.message
      }
      state.statusCode = action.payload
      return 

    case REMOVE_HTTP_ERROR:
      state.message = null
      state.statusCode = null
      return

    default:
      return state
  }
})

export default httpReducer
