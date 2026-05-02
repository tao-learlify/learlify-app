import produce from 'immer'
import * as TYPE from '../actions/types'

/**
 * @typedef {Object} StreamingState
 * @property {{ teacher: User, language: Language }} selection
 */

export const initialState = {
  selection: {
    teacher: {
      id: 0,
      fullName: 'Seleccionar'
    },
    language: {
      id: 0,
      code: null,
      lang: 'Español/Inglés'
    },
    meeting: {
      id: 0
    }
  }
}

/**
 *
 * @param {StreamingState} state
 * @param {import('redux').Action} action
 */
const streamingReducer = produce((state = initialState, { type, payload }) => {
  switch (type) {
    case TYPE.TEACHER_CHANGE:
      state.selection.teacher = payload
      return

    case TYPE.LANGUAGE_CHANGE:
      state.selection.language = payload
      return

    case TYPE.MEETING_CHANGE:
      state.selection.meeting = payload
      return

    default:
      return state
  }
})

export default streamingReducer