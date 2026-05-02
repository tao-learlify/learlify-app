export const createConfirmedClassPending = (state) => {
  state.classes.loading = true
}

export const createConfirmedClassRejected = (state) => {
  state.classes.loading = false
}

export const createConfirmedClassFullfiled = (state, action) => {
  state.classes.data.push(action.payload.response)
  state.classes.loading = false
}

export const createOnlineStream = (state, action) => {
  state.classes.online = action.payload.response
}

export const fetchConfirmedClassFullfiled = (state, action) => {
  state.classes.data = action.payload.response
  state.classes.loading = false
}

export const fetchConfirmedClassPending = (state) => {
  state.classes.loading = true
}

export const fetchConfirmedClassRejected = (state) => {
  state.classes.loading = false
}

export const fetchOnlineClassFullfiled = (state, action) => {
  state.classes.online = action.payload.response
  state.classes.loading = false
}