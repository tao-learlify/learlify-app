import { createSlice } from '@reduxjs/toolkit'

const SESSION_KEY = 'learlify_guest_session'

function loadFromSessionStorage() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistToSessionStorage(state) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch { /* quota exceeded — ignore */ }
}

const initialState = {
  examType: null,        // 'Aptis' | 'IELTS'
  competency: null,      // 'Listening' | 'Grammar'
  exerciseIndex: 0,
  totalExercises: 0,
  answers: [],           // { questionIndex, selectedAnswer, isCorrect }[]
  screensCompleted: 0,
  authIntercepted: false,
  score: null,           // 0-100
  level: null,           // 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  userId: null,
}

const guestSessionSlice = createSlice({
  name: 'guestSession',
  initialState: loadFromSessionStorage() || initialState,
  reducers: {
    selectExam(state, action) {
      state.examType = action.payload
      persistToSessionStorage(state)
    },
    selectCompetency(state, action) {
      state.competency = action.payload
      persistToSessionStorage(state)
    },
    setTotalExercises(state, action) {
      state.totalExercises = action.payload
      persistToSessionStorage(state)
    },
    recordAnswer(state, action) {
      const { questionIndex, selectedAnswer, isCorrect } = action.payload
      // Avoid duplicates for the same question
      const existing = state.answers.find(a => a.questionIndex === questionIndex)
      if (existing) {
        existing.selectedAnswer = selectedAnswer
        existing.isCorrect = isCorrect
      } else {
        state.answers.push({ questionIndex, selectedAnswer, isCorrect })
      }
      state.screensCompleted += 1
      state.exerciseIndex = questionIndex + 1
      persistToSessionStorage(state)
    },
    setAuthIntercepted(state) {
      state.authIntercepted = true
      persistToSessionStorage(state)
    },
    setGuestUserId(state, action) {
      state.userId = action.payload
      persistToSessionStorage(state)
    },
    setScore(state, action) {
      state.score = action.payload.score
      state.level = action.payload.level
      persistToSessionStorage(state)
    },
    resetGuestSession() {
      sessionStorage.removeItem(SESSION_KEY)
      return initialState
    },
  },
})

export const {
  selectExam,
  selectCompetency,
  setTotalExercises,
  recordAnswer,
  setAuthIntercepted,
  setGuestUserId,
  setScore,
  resetGuestSession,
} = guestSessionSlice.actions

export default guestSessionSlice.reducer
