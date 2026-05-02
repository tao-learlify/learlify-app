import { useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import useCourses from 'hooks/useCourses'
import useAdvance from 'hooks/useAdvance'
import useModels from 'hooks/useModels'
import { fetchCoursesThunk } from 'store/@thunks/courses'

// ── Helpers ───────────────────────────────────────────────────

/**
 * Maps advance.sections data to LearningPath unit nodes, then interleaves
 * exam challenge nodes based on the provided exams array.
 *
 * Challenge nodes are inserted after every SECTION_GROUP_SIZE regular sections.
 *
 * @param {Object} advanceSections    - advance.sections from API (keyed by 1-based index)
 * @param {number} currentSectionIdx  - advance.currentSectionIndex (1-based from API)
 * @param {Array} exams              - Exam objects from useExams().data
 * @returns {Array}
 */
function buildLearningPathUnits(advanceSections, currentSectionIdx, exams) {
  if (!advanceSections || Object.keys(advanceSections).length === 0) {
    return []
  }

  const SECTION_GROUP_SIZE = 4
  const nodes = []
  let nodeId = 1
  let examIndex = 0

  // Sort section keys numerically to handle string keys like "1", "2", etc.
  const sectionKeys = Object.keys(advanceSections)
    .map(k => parseInt(k, 10))
    .filter(k => !isNaN(k))
    .sort((a, b) => a - b)

  sectionKeys.forEach((sectionKey, displayIndex) => {
    const sectionData = advanceSections[sectionKey]
    if (!sectionData) return

    // Determine state: currentSectionIdx is 1-based from API
    let state = 'locked'
    if (sectionKey < currentSectionIdx) state = 'completed'
    else if (sectionKey === currentSectionIdx) state = 'current'

    nodes.push({
      id: nodeId++,
      title: `Section ${sectionKey}`,
      state,
      xp: sectionData.xp || 0,
      completed: sectionData.completed || false,
      lastAccessedAt: sectionData.lastAccessedAt || null
    })

    // Insert challenge node after each group
    const isGroupEnd = (displayIndex + 1) % SECTION_GROUP_SIZE === 0
    const hasNextSection = displayIndex < sectionKeys.length - 1
    const exam = exams[examIndex]

    if (isGroupEnd && hasNextSection && exam) {
      let challengeState = 'locked'
      if (currentSectionIdx > sectionKey + 1) challengeState = 'completed'
      else if (currentSectionIdx === sectionKey + 1) challengeState = 'current'

      nodes.push({
        id: nodeId++,
        title: exam.title || `Challenge ${examIndex + 1}`,
        state: challengeState,
        xp: 200,
        type: exam.premium ? 'challenge-premium' : 'challenge',
        examId: exam.id
      })

      examIndex++
    }
  })

  return nodes
}

// ── Hook ──────────────────────────────────────────────────────

/**
 * useCourseLearningPath — derives LearningPath unit nodes from
 * real API data (courses + advance from Redux).
 *
 * Uses the updated backend schema where:
 *   advance.currentSectionIndex  → 1-based index of current section
 *   advance.sections             → object with section data (keyed by 1-based index)
 *   courses[].totalSections      → total section count for validation
 *
 * @param {Array} [exams=[]] - Exam objects from useExams().data (for challenge nodes)
 * @returns {{ units: Array, courseTitle: string, courseId: number, totalSections: number, currentSection: number, loading: boolean }}
 */
function useCourseLearningPath(exams = []) {
  const dispatch = useDispatch()
  const { data: coursesData, loading: coursesLoading } = useCourses()
  const advance = useAdvance()
  const { model } = useModels()

  const fetchDispatchedRef = useRef(false)

  // ── Step 1: Ensure courses are loaded in Redux ──────────────
  useEffect(() => {
    if (fetchDispatchedRef.current || coursesData.length > 0 || coursesLoading) return
    
    const modelName = model?.name || model?.model
    if (!modelName || typeof modelName !== 'string' || modelName.startsWith('[object')) return
    
    fetchDispatchedRef.current = true
    dispatch(fetchCoursesThunk({ model: modelName, demo: false }))
  }, [coursesData.length, coursesLoading])

  // ── Step 2: Extract data from Redux selectors ───────────────
  const advanceData = advance.data?.[0]      // First advance entry
  const courseData = coursesData[0]          // First course

  // These are primitives, safe as dependencies
  const courseId = courseData?.id || null
  const courseTitle = courseData?.name || 'English Path'
  const totalSections = courseData?.totalSections || 0
  const currentSectionIndex = advanceData?.currentSectionIndex || 1  // 1-based, defaults to 1

  // ── Step 3: Build LearningPath unit nodes ───────────────────
  const units = useMemo(
    () => {
      if (!advanceData?.sections) return []
      return buildLearningPathUnits(advanceData.sections, currentSectionIndex, exams)
    },
    [advanceData?.sections, currentSectionIndex, exams]
  )

  return {
    units,
    courseTitle,
    courseId,
    totalSections,
    currentSection: currentSectionIndex,
    loading: coursesLoading || advance.loading
  }
}

export default useCourseLearningPath
