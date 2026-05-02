import { createSlice } from '@reduxjs/toolkit'

const defaultSelection = {
  title: '',
  label: '',
  index: 0
}

/**
 * @typedef {Object} ExamState
 * @property {boolean} allowConfetti
 */

/**
 * @type {ExamState}
 */
export const initialState = {
  allowConfetti: false,
  allowFeed: null,
  allowModularFeed: false,
  allowMultipleFeed: false,
  asserts: 0,
  error: null,
  data: {
    context: null,
    level: 0,
    levels: 0
  },
  disabled: false,
  download: null,
  exercise: {},
  feedback: {
    modular: [],
    multiple: [],
    single: null
  },
  next: false,
  recordings: [],
  report: false,
  section: [],
  selection: defaultSelection,
  selections: [],
  unit: null,
  units: []
}

const slice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    setError (state, action) {
      state.error = action.payload
    },

    setScore(state, action) {
      if (typeof action.payload === 'number') {
        state.asserts = state.asserts + action.payload
      }
    },

    setNext(state, action) {
      state.next = action.payload
    },

    setSelection(state, action) {
      state.selection = action.payload
    },

    setSelections(state, action) {
      const { index, title } = action.payload

      state.selections[index] = title
    },

    setRecord(state, action) {
      state.recordings.push(action.payload)
    },

    setUpdate(state) {
      state.allowFeed = null
      state.allowMultipleFeed = false
      state.allowConfetti = false
      state.data.levels = 0
      state.data.level = 0
      state.disabled = false
      state.feedback.modular = []
      state.feedback.multiple = []
      state.feedback.single = null
      state.next = false
      state.selection = defaultSelection
      state.recordings = []
    },

    setPreselection(state, action) {
      state.data = {
        context: null,
        level: 0,
        levels: 0
      }
      state.selections = Array(action.payload).fill(defaultSelection.title)
      state.recordings = []
    },

    setConfetti(state) {
      state.allowConfetti = true
      state.disabled = true
      state.next = true
    },

    setFeedback(state, action) {
      const { feedback, mode } = action.payload

      state.feedback[mode] = feedback

      switch (mode) {
        case 'single':
          state.allowFeed = true
          state.disabled = true
          state.next = true

          break

        case 'multiple':
          state.allowMultipleFeed = true
          state.disabled = true
          state.next = true
          break

        case 'modular':
          state.allowModularFeed = true
          state.disabled = true
          state.next = true
          state.data.level = 0
          break

        default:
          break
      }
    },

    setModules(state, action) {
      state.data = action.payload
    },

    setIncreaseLevel(state, action) {
      state.data.level = action.payload
    },

    setLevelSelection(state, action) {
      const { title, index } = action.payload

      const level = state.data.level

      state.data.context[level].selections[index] = title
    },

    resetLevels(state) {
      state.data.levels = 0
      state.data.level = 0
    },

    setDownload(state, action) {
      state.units = new Array(action.payload.units)
        .fill(null)
        .map((nullable, index) => `${index + 1}`)
        
      state.download = action.payload.views.map(view => view)
    },

    
    setUnit (state, action) {
      state.error = null
      state.unit = action.payload
    },


    setSection (state, action) {
      state.section = action.payload
    }
  }
})

/**
 * @description
 * resetLevels restores all internal data about levels.
 * setFeedback makes a context about feedback of the current module-exercise.
 * setNext continues with handling logic onButtonClick.
 * setConfetti makes a content with confetti.
 * setPreselection every UI update with the next exercise with preload information about user selections.
 * setRecord appends a recording with a BLOB file.
 * setSelection makes a simple selection like a grammar dropdown without much context.
 * setUpdate makes a UI Update with certain of parameters to be represented in UI.
 * setModulePolarization makes a HUGE computation to make a context from level modules nested, like, levels, level and data about.
 * This also makes a persistent data across the UI Changes.
 * setLevelSelection is like setModulePolarization but in this case we modify a part of the context of data in a module to be persisted.
 */

export const {
  resetLevels,
  setConfetti,
  setError,
  setDownload,
  setFeedback,
  setIncreaseLevel,
  setLevelSelection,
  setModules,
  setNext,
  setPreselection,
  setRecord,
  setScore,
  setSection,
  setSelection,
  setSelections,
  setUnit,
  setUpdate
} = slice.actions

export default slice.reducer
