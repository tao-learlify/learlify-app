export const fetchUsersFullfiled = (state, action) => {
  state.users.data = action.payload.response
  state.users.pagination = action.payload.pagination
  state.users.loading = false
}

export const fetchUsersPending = (state) => {
  state.users.loading = true
}

export const fetchUsersRejected = (state) => {
  state.users.loading = false
}

export const fetchTeachersFullfiled = (state, action) => {
  state.teachers.data = action.payload.response
  state.teachers.pagination = action.payload.pagination
  state.teachers.loading = false
}

export const fetchTeachersRejected = (state) => {
  state.teachers.loading = false
}

export const fetchTeachersPending = (state) => {
  state.teachers.loading = true
}