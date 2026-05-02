import decode from 'jwt-decode'

/**
 * @param {import ('store/@reducers/auth').AuthState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const loginFullfiledController = (state, action) => {
  state.loading = false
  state.isLoggedIn = true
  state.demo = null;
  state.user = {
    ...decode(action.payload.response.token),
    token: action.payload.response.token
  }
}

/**
 * @param {import ('store/@reducers/auth').AuthState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const demoFullfiledController = (state, action) => {
  state.loading = false
  state.isLoggedIn = true
  state.user = {
    ...decode(action.payload.response.token),
    token: action.payload.response.token
  }
  state.demo = true
}

/**
 * @param {import ('store/@reducers/auth').AuthState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const loginRejectedController = state => {
  state.loading = false
  state.error = true
}

/**
 * @param {import ('store/@reducers/auth').AuthState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const loginPendingController = state => {
  state.loading = true
}

/**
 * @param {import ('store/@reducers/auth').AuthState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const logoutController = state => {
  state.isLoggedIn = false
  state.user = null
  state.demo = null
}


export const recoverPasswordMailController = state => {
  state.loading = false
}

