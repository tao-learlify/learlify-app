export const clearErrorController = state => {
  Object.keys(state).forEach(key => {
    if (state[key] && state[key].loading) {
      state[key].loading = false
    }
  })
}