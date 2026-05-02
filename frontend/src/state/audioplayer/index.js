import { createSlice } from '@reduxjs/toolkit'
import { getMaxDuration, timerOf } from 'utils/functions'
import moment from 'moment'

const timestampText = '0:00'

export const initialState = {
  controls: false,
  currentTimer: timestampText,
  maxDuration: timestampText,
  isPlaying: false,
  progress: {
    right: -8
  }
}

/**
 * @description
 * Ratio time increased each tick.
 */
const INCREASE_TIMER_RATIO = 0.25

const INCREASE_PROGRESS_VALUE = 100

const OFFSET_STYLE_RIGHT = -8

const FORMAT_STYLE = 'mm:ss'

const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    endPlayingRecord (state) {
      state.currentTimer = timestampText
      state.progress.right = OFFSET_STYLE_RIGHT
      state.isPlaying = false
    },

    setTimerAndProgress(state, action) {
      const { currentTime, duration } = action.payload

      state.currentTimer = timerOf(currentTime)
      state.progress.right =
        OFFSET_STYLE_RIGHT -
        ((currentTime + INCREASE_TIMER_RATIO) / duration) *
          INCREASE_PROGRESS_VALUE
    },

    togglePlayerState(state) {
      state.isPlaying = !state.isPlaying
    },

    toggleControlsState (state) {
      state.controls = !state.controls
    },

    setMaxDuration (state, action) {
      const duration = action.payload

      const handleTimer = Math.floor(duration)

      const miliseconds = getMaxDuration(handleTimer)

      state.maxDuration = moment.utc(miliseconds).format(FORMAT_STYLE)
    }   
  }
})

export const {
  endPlayingRecord,
  setMaxDuration,
  setTimerAndProgress,
  toggleControlsState,
  togglePlayerState
} = audioPlayerSlice.actions

export default audioPlayerSlice.reducer
