export const fetchLanguagesFullfiled = (state, action) => {
  const [first] = action.payload.response

  state.data = action.payload.response
  state.loading = false
  state.selected = first
}

export const fetchLanguagesRejected = (state) => {
  state.loading = false
}

export const fetchLanguagesPending = (state) => {
  state.loading = true
}

export const selectLanguageStaged = (state, action) => {
  state.selected = action.payload
}