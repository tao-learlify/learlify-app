/**
 * @description
 * Fetch the current exams and extract the information about the current resource.
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const examFullfiled= (state, action) => {
  const data = action.payload.response.schema.find(
    context => context.category === action.payload.category
  )
  state.exams.instance = data.exercises
  state.exams.loading = false
}

/**
 * 
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const examsFullfiled = (state, action) => {
  state.exams.data = action.payload.response
  state.exams.loading = false
}

/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 */
export const examsRejected = state => {
  state.exams.loading = false
}

/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 */
export const examsPending = state => {
  state.exams.loading = true
}

/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 */
export const progressPending = state => {
  state.progress.loading = true
}

/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 */
export const progressRejected = (state, action) => {
  state.progress.loading = false
  state.progress.synchronizing = false
  state.progress.error = action.payload
}


/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const progressFullfiled = (state, action) => {
  state.progress.data = action.payload.response
  state.progress.synchronizing = false
  state.progress.loading = false
}


/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const syncProgressFulliled = (state, action) => {
  const { progress } = action.payload.response

  state.progress.synchronizing = false
  
  if (progress) {
    state.progress.data = action.payload.response.progress
  }
} 

/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const syncProgressPending = (state) => {
  state.progress.synchronizing = true
}


/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const syncProgressRejected = (state, action) => {
  state.progress.error = action.payload
  state.progress.synchronizing = false
}

/**
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const syncProgressCached = (state, action) => {
  state.progress.cache = action.payload
}


/**
 * Unblock controls on exams.
 * @param {import ('store/@reducers/exams').ExamsState} state
 * @param {import ('@reduxjs/toolkit').Action} action
 */
export const grantControls = (state) => {
  state.exams.data.forEach((exam, index) => {
    if (exam.blocked) {
      state.exams.data[index]['blocked'] = false
    }
  })
}