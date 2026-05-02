import produce from 'immer'
import * as ACTION from './actions/types'

/**
 * @typedef {Object} ChatState
 * @property {number} unreads
 * @property {boolean} toggled
 * @property {import ('components/Chat').Messsage []} messages
 * @property {{ text: string | null }} typing
 */

/**
 * @type {ChatState}
 */
export const initialState = {
  messages: [],
  unreads: 0,
  toggled: false,
  typing: {
    text: null
  }
}

const chatReducer = produce(
  /***
   * @param {ChatState} state
   * @param {import ('redux').Action}
   */
  (state = initialState, { type, payload }) => {
    switch (type) {
      case ACTION.CHAT_MESSAGE:
        state.messages = [
          ...state.messages,
          payload
        ]
        return

      case ACTION.CHAT_TYPING:
        state.typing.text = payload
        return

      case ACTION.CHAT_UNREADS:
        state.unreads = payload
        return
      
      default:
        return state
    }
  }
)

export default chatReducer
