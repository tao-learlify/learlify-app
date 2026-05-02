import {
  SERVICE_ERROR,
  SERVICE_ERROR_REDIRECT,
  SERVICE_ERROR_CLEAR,
  ASYNC_ACTION_END,
  FETCH_ROLES_ERROR,
  FETCH_ROLES_ERROR_CLEAR
} from '../actions/types'

const initialState = {
  errorLogin: null,
  errorRoles: null,
  redirectTo: null,
  serviceError: null
}

/**
 * @description
 * Provides an error ocurring while fetching services or something like that.
 */

/** @param {object} state */
/** @param {{ type: string, payload: any }} action  */

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SERVICE_ERROR:
      return { ...state, serviceError: action.payload }

    case SERVICE_ERROR_REDIRECT:
      return {
        ...state,
        serviceError: action.payload.message,
        redirectTo: action.payload.redirectTo
      }

    case SERVICE_ERROR_CLEAR:
      return { ...state, serviceError: null, redirectTo: null }

    case ASYNC_ACTION_END:
      return { ...state, errorLogin: null }

    case FETCH_ROLES_ERROR: {
      return { ...state, errorRoles: true }
    }

    case FETCH_ROLES_ERROR_CLEAR: {
      return { ...state, errorRoles: null }
    }

    default:
      return state
  }
}

export default errorReducer
