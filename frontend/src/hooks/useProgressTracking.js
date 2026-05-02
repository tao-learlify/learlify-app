import { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import api from 'api'
import { fetchAdvanceThunk } from 'store/@thunks/courses'

const DEBOUNCE_MS = 1500
const MAX_RETRIES = 2

/** Retry fn up to maxRetries extra times with linear back-off. */
async function callWithRetry(fn, maxRetries) {
  let lastErr
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
      }
    }
  }
  throw lastErr
}

/**
 * useProgressTracking — Update and track user progress through sections.
 *
 * - Debounced backend sync (1500ms) — only the last call per window hits the network
 * - Auto-creates advance record on first save (PUT returns 404 → POST → retry PUT)
 * - Retry up to MAX_RETRIES times with back-off
 * - flush() persists any pending save immediately (call on unmount / navigation)
 * - completeSection never throws — UI stays alive even on save failure
 *
 * @param {number|string} courseId
 * @param {number|string} sectionIndex — 1-based
 * @param {number} [totalExercises=10]
 * @returns {{ updateProgress, completeSection, flush, localProgress, localXp, loading, error }}
 */
function useProgressTracking(courseId, sectionIndex, totalExercises = 10) {
  const dispatch = useDispatch()
  const [localXp, setLocalXp] = useState(0)
  const [localProgress, setLocalProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const numericCourseId = courseId ? Number(courseId) : null
  const numericSectionIndex = sectionIndex ? Number(sectionIndex) : null

  const debounceTimer = useRef(null)
  const pendingPayload = useRef(null)
  // Track whether we've already confirmed the record exists in this session
  const advanceExistsRef = useRef(false)

  /**
   * Ensure an advance record exists for this course.
   * On first call creates it via POST; subsequent calls are a no-op.
   */
  const _ensureAdvanceRecord = useCallback(async () => {
    if (advanceExistsRef.current) return
    console.log('[progress] creating advance record for courseId:', numericCourseId)
    await api.courses.createAdvance({ courseId: numericCourseId })
    advanceExistsRef.current = true
    console.log('[progress] advance record created ✓')
  }, [numericCourseId])

  /**
   * Sync payload to backend.
   * If the advance record doesn't exist yet (404), creates it first then retries.
   */
  const _syncToBackend = useCallback(async (payload) => {
    console.log('[progress] _syncToBackend payload:', payload, '| recordExists:', advanceExistsRef.current)
    const doUpdate = () => api.courses.updateAdvance(payload)
    try {
      if (advanceExistsRef.current) {
        // Fast path: record known to exist
        console.log('[progress] PUT /advance (fast path)')
        await callWithRetry(doUpdate, MAX_RETRIES)
        console.log('[progress] PUT /advance OK ✓')
      } else {
        // Optimistic: try PUT first (record may already exist from another session)
        try {
          console.log('[progress] PUT /advance (optimistic)')
          await doUpdate()
          advanceExistsRef.current = true
          console.log('[progress] PUT /advance OK ✓')
        } catch (err) {
          console.warn('[progress] PUT failed, statusCode:', err?.statusCode, err)
          if (err?.statusCode === 404) {
            // Record doesn't exist — create then retry
            await _ensureAdvanceRecord()
            console.log('[progress] retrying PUT after create...')
            await callWithRetry(doUpdate, MAX_RETRIES)
            console.log('[progress] PUT /advance OK after create ✓')
          } else {
            throw err
          }
        }
      }
    } catch (err) {
      console.error('[progress] _syncToBackend FINAL FAILURE:', err)
    }
  }, [_ensureAdvanceRecord])

  /** Flush any pending debounced save immediately (call on unmount/navigation). */
  const flush = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    if (pendingPayload.current) {
      const payload = pendingPayload.current
      pendingPayload.current = null
      _syncToBackend(payload)
    }
  }, [_syncToBackend])

  /**
   * Update progress mid-section. UI updates immediately; backend is debounced.
   * @param {number} xp
   * @param {number} exercisesCompleted
   * @param {number|null} progressPercent
   * @param {object|null} v2 — block-level state { completedBlockIds, xpRecord, currentBlockId, updatedAt }
   */
  const updateProgress = useCallback(
    (xp, exercisesCompleted, progressPercent = null, v2 = null) => {
      console.log('[progress] updateProgress called — xp:', xp, 'exercises:', exercisesCompleted, 'courseId:', numericCourseId, 'section:', numericSectionIndex)
      if (!numericCourseId || !numericSectionIndex) {
        console.warn('[progress] updateProgress aborted — missing courseId or sectionIndex')
        return
      }

      const actualProgress = progressPercent !== null
        ? progressPercent
        : (totalExercises > 0 ? exercisesCompleted / totalExercises : 0)

      // Optimistic — instant UI, no loading spinner
      setLocalXp(xp)
      setLocalProgress(actualProgress)

      // Debounce: reset timer, keep latest payload only
      const payload = {
        courseId: numericCourseId,
        unit: numericSectionIndex,
        last: Math.round(xp),
        completed: false,
        ...(v2 ? { v2 } : {})
      }
      pendingPayload.current = payload
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        debounceTimer.current = null
        pendingPayload.current = null
        _syncToBackend(payload)
      }, DEBOUNCE_MS)
    },
    [numericCourseId, numericSectionIndex, totalExercises, _syncToBackend]
  )

  /**
   * Mark section complete. Flushes pending save first, then persists completion.
   * Never throws — UI must not break on save failure.
   */
  const completeSection = useCallback(
    async (finalXp, examScore = null) => {
      console.log('[progress] completeSection called — finalXp:', finalXp, 'courseId:', numericCourseId, 'section:', numericSectionIndex)
      if (!numericCourseId || !numericSectionIndex) {
        console.warn('[progress] completeSection aborted — missing courseId or sectionIndex')
        return
      }

      flush()
      setLoading(true)
      setError(null)

      const payload = {
        courseId: numericCourseId,
        unit: numericSectionIndex,
        last: Math.round(finalXp),
        completed: true
      }

      try {
        await _syncToBackend(payload)
        dispatch(fetchAdvanceThunk(numericCourseId))
        setLocalXp(0)
        setLocalProgress(0)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useProgressTracking] completeSection failed:', err)
        }
        setError(err?.message ?? 'Failed to save progress')
      } finally {
        setLoading(false)
      }
    },
    [numericCourseId, numericSectionIndex, dispatch, flush, _syncToBackend]
  )

  return {
    updateProgress,
    completeSection,
    flush,
    localProgress,
    localXp,
    loading,
    error
  }
}

export default useProgressTracking


