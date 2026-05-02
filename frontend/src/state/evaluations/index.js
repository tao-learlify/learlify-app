import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} MarkdownMode
 * @property {string} text
 * @property {string} html
 */

/**
 * @typedef {Object} EvaluationsState
 * @property {{}} data
 * @property {boolean} editor
 * @property {MarkdownMode} comments
 */

/**
 * @type {EvalautionState}
 */
export const initialState = {
  comments: {
    html: '',
    text: ''
  },
  data: [],
  editor: false
}

const evaluations = createSlice({
  name: 'evaluations',
  initialState,
}) 

export default evaluations.reducer

