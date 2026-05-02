import produce from 'immer'
import { SELECT_NAVIGATION_TOUR } from 'store/actions/types'

/**
 * @typedef {Object} SessionState
 * @property {boolean} shouldTourNavigationBar
 */

/**
 * @type {SessionState}
 */
const initialState = {
  shouldTourNavigationBar: true
}

const sessionReducer = produce(
  /**
   * @param {SessionState} state
   * @param {import ('redux').Action}
   */
  (state = initialState, { payload, type }) => {
    switch (type) {
      case SELECT_NAVIGATION_TOUR:
        state.shouldTourNavigationBar = payload
        return

      default:
        return state
    }
  }
)

export default sessionReducer
