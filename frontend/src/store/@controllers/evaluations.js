/**
 * @typedef {import ('store/@reducers/evaluations').EvaluationState} ControllerState
 */

import { STATUS } from 'modules/evaluations'

/**
 * @param {ControllerState} state
 */
export const fetchEvaluationFulfilled = (state, action) => {
  state.evaluations.loading = false
  state.evaluations.selected = action.payload.response
}

/**
 * @param {ControllerState} state
 */
export const fetchEvaluationsFullfiled = (state, action) => {
  if (action.payload.own) {
    state.owns.data = action.payload.response
    state.owns.pagination = action.payload.pagination
    state.owns.loading = false
  } else {
    state.evaluations.data = action.payload.response
    state.evaluations.loading = false
    state.evaluations.pagination = action.payload.pagination
  }
}

/**
 * @param {ControllerState} state
 */
export const fetchEvaluationsRejected = state => {
  state.evaluations.loading = false
}

/**
 * @param {ControllerState} state
 */
export const fetchEvaluationsPending = state => {
  state.evaluations.loading = true
}

/**
 * @param {ControllerState} state
 */
export const fetchLatestFulfilled = (state, action) => {
  state.latest.loading = false
  state.latest.selected = action.payload.response
}

/**
 * @param {ControllerState} state
 */
export const fetchLatestsFullfiled = (state, action) => {
  state.latest.data = action.payload.response
  state.latest.loading = false
  state.latest.pagination = action.payload.pagination
}

/**
 * @param {ControllerState} state
 */
export const fetchLatestRejected = state => {
  state.latest.error = true
  state.latest.loading = false
}

/**
 * @param {ControllerState} state
 */
export const fetchLatestPending = state => {
  state.latest.loading = true
}

/**
 * @param {ControllerState} state
 */
export const updateEvaluationFullfiled = (state, action) => {
  /**
   * @description
   * If the status in the response is taken, should your own data evaluation.
   */
  if (action.payload.response.status === 'TAKEN') {
    state.evaluations.data = state.evaluations.data.filter(
      evaluation => evaluation.id !== action.payload.response.id
    )
    state.owns.data.push(action.payload.response)
  }

  /**
   * @description
   * If the status in the response is pending should not in your own data.
   */
  if (action.payload.response.status === 'PENDING') {
    state.owns.data = state.owns.data.filter(
      evaluation => evaluation.id !== action.payload.response.id
    )
    state.evaluations.data.push(action.payload.response)
  }

  state.evaluations.loading = false
}

/**
 * @param {ControllerState} state
 */
export const updateEvaluationPending = (state, action) => {
  state.evaluations.loading = true
}

/**
 * @param {ControllerState} state
 */
export const updateEvaluationRejected = (state, action) => {
  state.evaluations.loading = false
  state.evaluations.error = true
  state.evaluations.selected.status = STATUS.EVALUATED
}

/**
 * @param {ControllerState} state
 */
export const setEvaluationController = (state, action) => {
  state.evaluations.selected = action.payload
}

/**
 * @param {ControllerState} state
 */
export const setCommentsController = (state, action) => {
  const { comments, selector } = action.payload

  state.evaluations.selected.comments[selector] = comments
}

/**
 * @param {ControllerState} state
 */
export const setScoreController = (state, action) => {
  const { score, selector, current } = action.payload

  state.evaluations.selected.score[current][selector] = score
}

/**
 * @param {ControllerState}
 */
export const setCountOverViewController = (state, action) => {
  
  state.count.data = action.payload.response
  state.count.loading = false
}

/**
 * @param {ControllerState}
 */
export const setCountOverViewLoading = (state) => {
  state.count.loading = true
}

export const patchEvaluationProcessController = (state, action) => {
  if (action.payload.response) {
    const patched = state.owns.data.map(own => {
      if (own.id === action.payload.response.id) {
        return Object.assign(own, {
          status: 'TAKEN'
        })
      }
      return own
    })

    state.owns.data = patched
  }
}