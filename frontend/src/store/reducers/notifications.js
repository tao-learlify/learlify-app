import produce from 'immer'
import { NOTIFY_END_REQUEST, NOTIFIY_REQUEST } from 'store/actions/types'

/**
 * @typedef {Object} NotificationState
 * @property {string} event
 * @property {string} message
 * @property {'warning' | 'success' | 'info'} type
 * @property {boolean} notified
 */
const initialState = {
  message: null,
  type: null,
  event: null,
  notified: false
}

const notificationReducer = produce(
  /**
   * @param {NotificationState} state
   * @param {import('redux').Action}
   */
  (state = initialState, { type, payload }) => {
    switch (type) {
      case NOTIFIY_REQUEST:
        state.event = payload.event ? payload.event : null
        state.message = payload.message
        state.notified = true
        state.type = payload.type ? payload.type : 'success'
        return

      case NOTIFY_END_REQUEST:
        state.event = null
        state.message = null
        state.notified = false
        state.type = null
        return

      default:
        return state
    }
  }
)

export default notificationReducer
