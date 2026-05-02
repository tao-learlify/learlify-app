/**
 * @param {import ('store/@reducers/packages').PackagesState} state 
 * @param {import ('@reduxjs/toolkit').Action} action 
 */
export const fetchPackagesFullfiledController = (state, action) => {
  state.packages.data = action.payload.response
  state.packages.loading = false
}

/**
 * @param {import ('store/@reducers/packages').PackagesState} state 
 */
export const fetchPackagesRejectedController = (state) => {
  state.packages.loading = false
}

/**
 * @param {import ('store/@reducers/packages').PackagesState} state 
 */
export const fetchPackagesPendingController = (state) => {
  state.packages.loading = true
}

/**
 * @param {import ('store/@reducers/packages').PackagesState} state 
 */
export const createPackageController = (state, action) => {
  if (action.payload.response) {
    state.packages.data = action.payload.response.package
  }
}