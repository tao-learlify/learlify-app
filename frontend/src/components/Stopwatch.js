import React, { memo, useReducer, useEffect } from 'react'

import { formatStopwatchDate } from 'modules/dates'

import reducer, {
  initialState,
  increaseTimer,
  setSnapshot,
  refreshTimer
} from 'state/stopwatch'

import useInterval from 'hooks/useInterval'

import Text from 'components/Text'

/**
 * @typedef {Object} StopwatchProps
 * @property {number} delay
 * @property {boolean} running
 * @property {number} duration
 * @property {Function} onTimeExceed
 * @property {number} snapshots
 */

const DEFAULT_DELAY_TIMER = 49.95

/**
 * @type {React.FunctionComponent<StopwatchProps>} Stopwatch
 */
const Stopwatch = ({ delay, running, duration, onTimeExceed, snapshots }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useInterval(() => {
    if (running) {
      dispatch(increaseTimer())
    }
  }, delay)

  useEffect(() => {
    if (state.timer >= duration) {
      onTimeExceed()

      dispatch(setSnapshot(state.timer))
    }
  }, [duration, onTimeExceed, state.timer])


  useEffect(() => {
    dispatch(refreshTimer())
  }, [snapshots])

  return (  
    <Text tag="span" color="muted">
      {state.snapshot
        ? formatStopwatchDate(state.snapshot)
        : formatStopwatchDate(state.timer)}
    </Text>
  )
}

Stopwatch.defaultProps = {
  delay: DEFAULT_DELAY_TIMER,
  onTimeExceed: () => null
}

export default memo(Stopwatch)
