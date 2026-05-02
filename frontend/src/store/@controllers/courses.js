export const fetchCoursesControllerPending = (state) => {
  state.courses.loading = true
}

export const fetchCoursesControllerRejected = (state) => {
  state.courses.error = true
  state.courses.loading = false
}

export const fetchCoursesControllerFulfilled = (state, action) => {
  state.courses.data = action.payload.response.courses
  const advance = action.payload.response.advance
  if (Array.isArray(advance)) {
    state.advance.data = advance
  }
  state.courses.loading = false
}

export const fetchAdvanceFulfilled = (state, action) => {
  const response = action.payload?.response
  state.advance.loading = false

  if (!response) return

  // Always store unlockedUnits when backend provides them
  if (Array.isArray(response.unlockedUnits)) {
    state.advance.unlockedUnits = response.unlockedUnits
  }

  // Only update advance data if a full record exists (has an id)
  if (response.id) {
    if (!Array.isArray(state.advance.data)) state.advance.data = []
    const idx = state.advance.data.findIndex(a => a.id === response.id)
    if (idx >= 0) {
      state.advance.data[idx] = response
    } else {
      state.advance.data = [response]
    }
  }
}

export const fetchAdvancePending = (state) => {
  state.advance.loading = true
}

export const fetchAdvanceRejected = (state) => {
  state.advance.loading = false
}


export const fetchCourseFromS3OriginFullfiled = (state, action) => {
  state.courses.loading = false
}

export const fetchCourseFromS3OriginRejected = (state) => {
  state.courses.loading = false
}

export const fetchCourseFromS3OriginPending = (state) => {
  state.courses.loading = true
}


export const createAdvanceFullfiled = (state, action) => {
  state.advance.data.push(action.payload.response)
  state.advance.loading = false
}

export const createAdvancePending = (state) => {
  state.advance.loading = true
}

export const createAdvanceRejected = (state) => {
  state.advance.loading = false
}