import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import api from 'api'
import useCourses from 'hooks/useCourses'
import useModels from 'hooks/useModels'
import { fetchCoursesThunk } from 'store/@thunks/courses'
import { safeAdaptLegacyCourse } from 'views/courses/unit/api/safeAdaptLegacyCourse'
import { parseCourseParam, parseUnitParam, resolveCourse } from 'utils/courseParams'

/**
 * @typedef {'idle' | 'loading' | 'ready' | 'empty' | 'error' | 'timeout'} ConnectedUnitStatus
 */

/** CDN fetch timeout in milliseconds. */
const FETCH_TIMEOUT_MS = 10_000

/** Courses load timeout: give Redux/API this long before declaring timeout. */
const COURSES_TIMEOUT_MS = 12_000

/**
 * useConnectedUnit — orchestrates loading and adapting a course unit.
 *
 * Accepts slug-based route params (e.g. "c1", "u3") and resolves them
 * to the correct course/unit from the Redux store.
 *
 * Status machine:
 *   idle     → loading → ready
 *                      → empty   (course/unit found but no content)
 *                      → error   (fetch or adapter failure)
 *                      → timeout (took too long)
 *
 * The hook NEVER stays loading forever. A hard timeout transitions to
 * 'timeout' so the UI can show a retry button.
 *
 * @param {string | null} courseSlug  - :courseSlug route param (e.g. "c1", "aptis-general")
 * @param {string | null} unitSlug    - :unitSlug route param (e.g. "u3")
 * @returns {{
 *   unit: import('schemas/course/hierarchy').Unit | null,
 *   status: ConnectedUnitStatus,
 *   error: Error | null,
 *   retry: () => void
 * }}
 */
function useConnectedUnit(courseSlug, unitSlug) {
  const dispatch = useDispatch()
  const { data: coursesData, loading: coursesLoading } = useCourses()
  const { model } = useModels()

  const [unit, setUnit] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')
  const [retryKey, setRetryKey] = useState(0)

  const lastFetchedUrl = useRef(null)
  const coursesTimeoutRef = useRef(null)

  const retry = useCallback(() => {
    lastFetchedUrl.current = null
    setUnit(null)
    setError(null)
    setStatus('idle')
    setRetryKey(k => k + 1)
  }, [])

  // ── Step 1: ensure courses are loaded ────────────────────────────────────
  useEffect(() => {
    if (coursesData.length === 0 && !coursesLoading) {
      const modelName = model?.name || model?.model
      if (modelName && typeof modelName === 'string' && !modelName.startsWith('[object')) {
        dispatch(fetchCoursesThunk({ model: modelName, demo: false }))
      }
    }
  }, [coursesData.length, coursesLoading, retryKey])

  // ── Step 2: hard timeout on courses loading ───────────────────────────────
  // If courses never arrive, move to 'timeout' so the UI doesn't spin forever.
  useEffect(() => {
    if (coursesData.length > 0) {
      clearTimeout(coursesTimeoutRef.current)
      return
    }

    coursesTimeoutRef.current = setTimeout(() => {
      if (coursesData.length === 0) {
        setStatus('timeout')
        setError(new Error('Courses took too long to load. Check your connection.'))
      }
    }, COURSES_TIMEOUT_MS)

    return () => clearTimeout(coursesTimeoutRef.current)
  }, [coursesData.length, retryKey])

  // ── Step 3: resolve course + fetch CDN content ───────────────────────────
  useEffect(() => {
    if (coursesData.length === 0) {
      if (coursesLoading && status === 'idle') setStatus('loading')
      return
    }

    const parsedCourse = parseCourseParam(courseSlug)
    const parsedUnit = parseUnitParam(unitSlug)

    const course = resolveCourse(parsedCourse, coursesData)

    if (!course) {
      setStatus('empty')
      setError(new Error('No course found for the requested param'))
      return
    }

    const unitOrder = parsedUnit?.order ?? 1
    const cdnUrl = course.views?.url

    if (!cdnUrl) {
      setStatus('empty')
      setError(new Error('Course has no CDN content URL'))
      return
    }

    // Avoid re-fetching on unrelated re-renders
    const fetchKey = `${cdnUrl}::${unitOrder}`
    if (fetchKey === lastFetchedUrl.current) return
    lastFetchedUrl.current = fetchKey

    const controller = new AbortController()
    let timeoutId

    async function fetchAndAdapt() {
      setStatus('loading')
      setError(null)

      // Hard timeout: abort if CDN fetch takes too long
      timeoutId = setTimeout(() => {
        controller.abort()
        setStatus('timeout')
        setError(new Error('Unit content took too long to load. Please retry.'))
      }, FETCH_TIMEOUT_MS)

      try {
        const raw = await api.courses.fetchCourse(cdnUrl, controller.signal)
        clearTimeout(timeoutId)

        if (!raw) {
          setStatus('empty')
          setError(new Error('CDN returned empty response'))
          return
        }

        // unitOrder is 1-based; adapter expects 0-based index
        const unitIndex = Math.max(0, unitOrder - 1)
        const result = safeAdaptLegacyCourse(raw, unitIndex)

        if (!result.ok) {
          if (import.meta.env.DEV) {
            console.error('[useConnectedUnit] Adapter error:', result.error)
          }
          setStatus('error')
          setError(result.error)
          return
        }

        setUnit(result.unit)
        setStatus('ready')
      } catch (err) {
        clearTimeout(timeoutId)
        if (err?.name === 'AbortError') return // Handled by timeout branch above
        const wrapped = err instanceof Error ? err : new Error(String(err))
        if (import.meta.env.DEV) {
          console.error('[useConnectedUnit] Fetch error:', wrapped)
        }
        setStatus('error')
        setError(wrapped)
      }
    }

    fetchAndAdapt()

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [coursesData, coursesLoading, courseSlug, unitSlug, retryKey])

  return { unit, status, error, retry }
}

export default useConnectedUnit
