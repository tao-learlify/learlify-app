export const fetchSchedulesFullfiled = (state, action) => {
  if (action.payload.push) {
    state.schedules.data = state.schedules.data.concat(action.payload.response)
  } else {
    state.schedules.data = action.payload.response
  }

  state.schedules.loading = false
}

export const fetchSchedulesPending = (state) => {
  state.schedules.loading = true
}

export const fetchSchedulesRejected = (state) => {
  state.schedules.loading = false
}

export const createScheduleFullfiled = (state, action) => {
  state.schedules.data.push(action.payload.response)
}