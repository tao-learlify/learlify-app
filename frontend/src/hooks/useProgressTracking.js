import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import api from 'api'
import { fetchAdvanceThunk } from 'store/@thunks/courses'

/**
 * useProgressTracking — Update and track user progress through sections.
 *
 * Handles:
 * - Mid-section progress updates (exercises completed, XP earned)
 * - Section completion (mark as complete, auto-advance)
 * - Local optimistic updates (instant UI feedback)
 * - Backend sync (dispatch to Redux)
 *
 * @param {number} courseId — Current course ID
 * @param {number} sectionIndex — Current section (1-based)
 * @param {number} [totalExercises] — Total exercises in section (for progress %)
 * @returns {{ updateProgress, completeSection, localProgress, localXp, loading, error }}
 */
function useProgressTracking(courseId, sectionIndex, totalExercises = 10) {
  const dispatch = useDispatch()
  const [localXp, setLocalXp] = useState(0)
  const [localProgress, setLocalProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Ensure IDs are numbers — params from useParams() come as strings
  const numericCourseId = courseId ? Number(courseId) : null
  const numericSectionIndex = sectionIndex ? Number(sectionIndex) : null

  /**
   * Update progress mid-section (exercises completed, XP earned).
   * Uses existing PUT /api/v1/advance endpoint.
   *
   * @param {number} xp — XP earned so far
   * @param {number} exercisesCompleted — Number of exercises completed
   * @param {number} [progressPercent] — Optional progress percentage (0-1); if not provided, calculates from exercises/total
   */
  const updateProgress = useCallback(
    async (xp, exercisesCompleted, progressPercent = null) => {
      if (!numericCourseId || !numericSectionIndex) return

      try {
        setLoading(true)
        setError(null)

        // Calculate progress percent if not provided
        const actualProgress = progressPercent !== null 
          ? progressPercent 
          : (totalExercises > 0 ? exercisesCompleted / totalExercises : 0)

        // Optimistic update (instant UI feedback)
        setLocalXp(xp)
        setLocalProgress(actualProgress)

        // Sync to backend using existing PUT /advance endpoint
        if (api.courses.updateAdvance) {
          api.courses.updateAdvance({
            courseId: numericCourseId,
            unit: numericSectionIndex,
            last: Math.round(xp),
            completed: false
          }).catch(err => {
            console.warn('Failed to sync progress:', err)
          })
        }

        setLoading(false)
      } catch (err) {
        console.error('Progress update error:', err)
        setError(err.message)
        setLoading(false)
      }
    },
    [numericCourseId, numericSectionIndex, totalExercises]
  )

  /**
   * Mark section complete and auto-advance to next.
   * Uses existing PUT /api/v1/advance endpoint with completed: true.
   *
   * @param {number} finalXp — Total XP for this section
   * @param {number} [examScore] — Optional exam/quiz score (not stored in current API)
   * @returns {Promise} Resolves when backend confirms
   */
  const completeSection = useCallback(
    async (finalXp, examScore = null) => {
      if (!numericCourseId || !numericSectionIndex) return

      try {
        setLoading(true)
        setError(null)

        const response = await api.courses.updateAdvance({
          courseId: numericCourseId,
          unit: numericSectionIndex,
          last: Math.round(finalXp),
          completed: true
        })

        await dispatch(fetchAdvanceThunk(numericCourseId))

        setLocalXp(0)
        setLocalProgress(0)
        setLoading(false)
        
        return response
      } catch (err) {
        console.error('Complete section error:', err)
        setError(err.message)
        setLoading(false)
        throw err
      }
    },
    [numericCourseId, numericSectionIndex, dispatch]
  )

  return {
    updateProgress,
    completeSection,
    localProgress,
    localXp,
    loading,
    error
  }
}

export default useProgressTracking
