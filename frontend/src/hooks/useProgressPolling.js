import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAdvanceThunk } from 'store/@thunks/courses'

/**
 * useProgressPolling — Poll backend for progress updates at regular intervals.
 *
 * Keeps frontend in sync with backend when user is actively learning.
 * Triggers automatic updates to LearningPath graph as progress changes.
 *
 * Polling strategy:
 * - Starts when component mounts
 * - Requests every N milliseconds
 * - Stops when component unmounts
 * - Skips poll if fetch already in progress
 *
 * @param {number} courseId — Course ID to poll
 * @param {number} [interval=5000] — Poll interval in milliseconds (default: 5s)
 * @param {boolean} [enabled=true] — Enable/disable polling
 * @returns {void}
 *
 * @example
 * // In ConnectedUnitView:
 * useProgressPolling(courseId, 5000, true)
 * // Poll every 5 seconds while on learning page
 */
function useProgressPolling(courseId, interval = 5000, enabled = true) {
  const dispatch = useDispatch()
  const timerRef = useRef(null)
  const isPollingRef = useRef(false)

  useEffect(() => {
    if (!enabled || !courseId) return

    const poll = () => {
      if (isPollingRef.current) return // Skip if already fetching

      isPollingRef.current = true
      dispatch(fetchAdvanceThunk(courseId))
        .finally(() => {
          isPollingRef.current = false
        })
    }

    // Poll immediately on mount, then at intervals
    poll()
    timerRef.current = setInterval(poll, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, interval, enabled])
}

export default useProgressPolling
