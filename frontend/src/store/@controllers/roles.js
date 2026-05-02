/**
 * @param {import ('store/@reducers/roles').RolesState} state 
 * @param {import ('@reduxjs/toolkit').Action} action 
 */
export const fetchRolesFullfiledController = (state, action) => {
  state.roles.data = action.payload.response
  state.roles.loading = false
}

/**
 * @param {import ('store/@reducers/roles').RolesState} state 
 */
export const fetchRolesRejectedController = (state) => {
  state.roles.loading = false
}

/**
 * @param {import ('store/@reducers/roles').RolesState} state 
 */
export const fetchRolesPendingController = (state) => {
  state.roles.loading = true
}