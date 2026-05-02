import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  audio: null,
  firstRecording: false,
  isPlaying: false,
  isRecording: false,
  mediaStream: new Audio(),
  mediaError: null,
  next: false
}

const speakingSlice = createSlice({
  name: 'speaking',
  initialState,
  reducers: {
    audioCapture (state, action) {
      state.audio = action.payload
      state.isRecording = false
      state.next = true
    },

    setAudioState (state) {
      state.isPlaying = !state.isPlaying
    },

    setNext (state) {
      state.audio = null
      state.next = false
    },

    setRecordingEnable (state) {
      state.firstRecording = true
      state.isRecording = true
    },


    setRecordingDisable (state, action) {
      state.isRecording = false
    },

    setMediaStreamTrack (state, action) {
      state.audio = action.payload
    },

    setMediaStreamError (state) {
      state.mediaError = true
    }
  }
})


export const {
  audioCapture,
  setAudioState,
  setNext,
  setMediaStreamError,
  setMediaStreamTrack,
  setRecordingEnable,
  setRecordingDisable
} = speakingSlice.actions


export default speakingSlice.reducer