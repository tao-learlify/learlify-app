import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import api from 'api'
import useCourses from 'hooks/useCourses'
import useModels from 'hooks/useModels'
import { fetchCoursesThunk } from 'store/@thunks/courses'
import { adaptLegacyCourse } from 'views/courses/unit/api/adaptLegacyCourse'

/**
 * @typedef {'idle' | 'loading_courses' | 'loading_unit' | 'error' | 'ready'} ConnectedUnitStatus
 */

/**
 * useConnectedUnit — orchestrates loading and adapting a course unit.
 *
 * This hook sits at the boundary between the API/CDN data world
 * and the schema v2 runtime. It fetches whatever is needed, then
 * runs the adapter to produce a clean Unit v2 object. The result
 * is what ConnectedUnitView passes to UnitView.
 *
 * Data flow:
 *   Redux courses store (courses.data[])
 *     → find course matching courseId (or first course)
 *     → fetch CDN JSON via course.views.url
 *     → adaptLegacyCourse(json, unitIndex)
 *     → return { unit, status, error }
 *
 * The hook dispatches fetchCoursesThunk automatically when the
 * courses store is empty. It does NOT duplicate a fetch that is
 * already in-flight.
 *
 * @param {string | number | null} courseId  - Course identifier from route params.
 *   Pass null to use the first available course.
 * @param {number} [unitOrder=1]            - 1-based unit order within the course.
 * @returns {{ unit: import('schemas/course/hierarchy').Unit | null, status: ConnectedUnitStatus, error: Error | null }}
 */
function useConnectedUnit(courseId, unitOrder = 1) {
  const dispatch = useDispatch()
  const { data: coursesData, loading: coursesLoading } = useCourses()
  const { model } = useModels()

  const [unit, setUnit] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')

  // Tracks the CDN URL we last fetched so we don't refetch on unrelated re-renders
  const lastFetchedUrl = useRef(null)

  // Step 1 — ensure courses are loaded in Redux
  useEffect(() => {
    if (coursesData.length === 0 && !coursesLoading) {
      const modelName = model?.name || model?.model
      if (modelName && typeof modelName === 'string' && !modelName.startsWith('[object')) {
        dispatch(fetchCoursesThunk({ model: modelName, demo: false }))
      }
    }
  }, [coursesData.length, coursesLoading])

  // Step 2 — once courses are available, find the right course
  //           and fetch + adapt its CDN content
  useEffect(() => {
    if (coursesData.length === 0) {
      // Still waiting for courses to load
      if (coursesLoading) {
        setStatus('loading_courses')
      }
      return
    }

    // Find the target course by ID, or fall back to the first one
    const course = courseId
      ? coursesData.find(c => String(c.id) === String(courseId)) || coursesData[0]
      : coursesData[0]

    if (!course) {
      setStatus('error')
      setError(new Error('No course found for the requested ID'))
      return
    }

    const cdnUrl = course.views && course.views.url

    if (!cdnUrl) {
      setStatus('error')
      setError(new Error('Course has no CDN content URL (course.views.url is missing)'))
      return
    }

    // Avoid duplicate fetches if URL hasn't changed
    if (cdnUrl === lastFetchedUrl.current) return
    lastFetchedUrl.current = cdnUrl

    const controller = new AbortController()

    async function fetchAndAdapt() {
      setStatus('loading_unit')
      setError(null)

      try {
        const raw = await api.courses.fetchCourse(cdnUrl, controller.signal)

        // unitOrder is 1-based; adapt expects 0-based
        const unitIndex = Math.max(0, (unitOrder || 1) - 1)
        const adapted = adaptLegacyCourse(raw, unitIndex)

        setUnit(adapted)
        setStatus('ready')
      } catch (err) {
        if (err && err.name === 'AbortError') return // Unmounted — ignore
        setError(err instanceof Error ? err : new Error(String(err)))
        setStatus('error')
      }
    }

    fetchAndAdapt()

    return () => {
      controller.abort()
    }
  }, [coursesData, coursesLoading, courseId, unitOrder])

  return { unit, status, error }
}

export default useConnectedUnit
