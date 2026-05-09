/**
 * useLearningPathWithSchema
 *
 * Combines course progress data with schema v2 unit definitions to create
 * a rich learning path visualization.
 *
 * Maps:
 *   - Section indices from Redux advance → Schema unitOrder (1-15)
 *   - Progress data (xp, completed, lastAccessed) → Unit metadata
 *   - Exam challenges from exams array
 *
 * Returns units with:
 *   - title: "Unit 1 — Daily Routines" (from schema)
 *   - subtitle: "Talking about habits..."
 *   - learningObjective
 *   - difficulty: "A2"
 *   - theme: { name, accent, accent Soft, icon, mood }
 *   - xp: progress.xp
 *   - completed: progress.completed
 *   - lastAccessedAt
 *   - state: 'locked' | 'current' | 'completed'
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useCourses from 'hooks/useCourses'
import useAdvance from 'hooks/useAdvance'
import useAuthProvider from 'hooks/useAuthProvider'
import useModels from 'hooks/useModels'
import { fetchCoursesThunk } from 'store/@thunks/courses'
import { unlockedUnitsSelector } from 'store/@selectors/courses'

/**
 * Load all 15 course units from the schema
 * Returns Promise<Unit[]>
 */
async function loadAllSchemaUnits() {
  try {
    const { getAllCourseUnits } = await import('schemas/course/samples')
    return await getAllCourseUnits()
  } catch (error) {
    console.error('Failed to load schema units:', error)
    return []
  }
}

/**
 * Build learning path units combining schema + progress
 */
function buildLearningPathWithSchema(
  advanceSections,
  currentSectionIdx,
  schemaUnits,
  exams = [],
  unlockedUnits = []
) {
  if (
    !advanceSections ||
    Object.keys(advanceSections).length === 0 ||
    schemaUnits.length === 0
  ) {
    return []
  }

  const SECTION_GROUP_SIZE = 4
  const nodes = []
  let nodeId = 1
  let examIndex = 0

  const sectionKeys = Object.keys(advanceSections)
    .map(k => parseInt(k, 10))
    .filter(k => !isNaN(k))
    .sort((a, b) => a - b)

  sectionKeys.forEach((sectionKey, displayIndex) => {
    const sectionData = advanceSections[sectionKey]
    if (!sectionData) return

    // Map section index to unit (1-based)
    const schemaUnit = schemaUnits[sectionKey - 1]

    // Determine state using unlockedUnits from backend
    // If unit is not in unlockedUnits → locked (paywall)
    // Otherwise use progress to determine completed/current
    const isUnlocked =
      unlockedUnits.length === 0 || unlockedUnits.includes(sectionKey)
    let state = 'locked'
    if (isUnlocked) {
      if (sectionKey < currentSectionIdx) state = 'completed'
      else if (sectionKey === currentSectionIdx) state = 'current'
      else state = 'available'
    }

    // Build rich node from schema + progress
    const node = {
      id: nodeId++,
      unitOrder: sectionKey,
      // From schema
      title: schemaUnit?.title || `Unit ${sectionKey}`,
      subtitle: schemaUnit?.subtitle,
      learningObjective: schemaUnit?.learningObjective,
      difficulty: schemaUnit?.difficulty,
      theme: schemaUnit?.theme,
      estimatedDurationMin: schemaUnit?.estimatedDurationMin,
      // From progress
      state,
      xp: sectionData.xp || 0,
      completed: sectionData.completed || false,
      progressPercent: sectionData.progressPercent || 0,
      lastAccessedAt: sectionData.lastAccessedAt || null,
      lastAccessed: sectionData.lastAccessed || false
    }

    nodes.push(node)

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

/**
 * Hook: Load schema units once and combine with progress
 */
function useLearningPathWithSchema(exams = []) {
  const dispatch = useDispatch()
  const { data: coursesData, loading: coursesLoading } = useCourses()
  const advance = useAdvance()
  const unlockedUnits = useSelector(unlockedUnitsSelector)
  const { model } = useModels()
  const { demo } = useAuthProvider()

  const fetchDispatchedRef = useRef(false)
  const schemaUnitsRef = useRef(null)
  const schemaLoadingRef = useRef(false)
  const [schemaUnits, setSchemaUnits] = useState([])
  const [schemaLoading, setSchemaLoading] = useState(true)

  // ── Step 1: Ensure courses are loaded ──────────────
  useEffect(() => {
    // Don't fetch if already dispatched, already have data, or currently loading
    if (fetchDispatchedRef.current || coursesData.length > 0 || coursesLoading)
      return

    // Don't fetch if model is not ready or doesn't have valid name
    const modelName = model?.name || model?.model
    if (
      !modelName ||
      typeof modelName !== 'string' ||
      modelName.startsWith('[object')
    )
      return

    fetchDispatchedRef.current = true
    dispatch(fetchCoursesThunk({ model: modelName, demo: demo || false }))
  }, [coursesData.length, coursesLoading])

  // ── Step 2: Load schema units once ───────────────────
  useEffect(() => {
    if (schemaLoadingRef.current || schemaUnitsRef.current !== null) return

    schemaLoadingRef.current = true
    console.log('[useLearningPath] loading schema units...')
    loadAllSchemaUnits()
      .then(units => {
        console.log('[useLearningPath] schema units loaded:', units.length)
        schemaUnitsRef.current = units
        setSchemaUnits(units)
        setSchemaLoading(false)
      })
      .catch(error => {
        console.error('[useLearningPath] Failed to load schema units:', error)
        schemaUnitsRef.current = []
        setSchemaUnits([])
        setSchemaLoading(false)
      })
  }, [])

  // ── Step 3: Extract and memoize data ────────────────
  const advanceData = advance.data?.[0]
  const courseData = coursesData[0]

  const courseId = courseData?.id || null
  const courseTitle = courseData?.name || 'English Path'
  const totalSections = courseData?.totalSections || 15

  // ✨ Adapt API structure to expected format
  // API returns: content = { "1": { completed, general, last }, ... }
  // Code expects: currentSectionIndex (number), sections (object)
  const adaptedData = useMemo(() => {
    if (!advanceData?.content) {
      return { currentSectionIndex: 1, sections: {} }
    }

    const content = advanceData.content
    let currentSectionIndex = 1

    // Find the section with last: true
    const sections = {}
    Object.keys(content).forEach(key => {
      const sectionIndex = parseInt(key, 10)
      if (isNaN(sectionIndex)) return

      const sectionData = content[key]
      sections[sectionIndex] = {
        xp: sectionData.general || 0,
        completed: sectionData.completed || false,
        // Show progress ring on the dashboard node when the user has started a unit.
        // Exact fraction requires knowing totalBlocks — use completed/15 as a rough proxy
        // (typical unit has ~15 blocks). Falls back to 0 if no v2 state exists.
        progressPercent: sectionData.completed
          ? 1
          : sectionData.v2?.completedBlockIds?.length > 0
            ? Math.min(sectionData.v2.completedBlockIds.length / 15, 0.95)
            : 0,
        lastAccessedAt: null
      }

      // Find current section (marked with last: true)
      if (sectionData.last === true) {
        currentSectionIndex = sectionIndex
      }
    })

    return { currentSectionIndex, sections }
  }, [advanceData])

  const currentSectionIndex = adaptedData.currentSectionIndex

  // ── Step 4: Build learning path units ──────────────
  const { units, completedSections } = useMemo(() => {
    if (schemaUnits.length === 0) {
      return { units: [], completedSections: 0 }
    }

    const advanceSections = adaptedData.sections || {}

    // If no progress data, show all 15 units with first as current
    if (Object.keys(advanceSections).length === 0) {
      const defaultUnits = schemaUnits.map((schemaUnit, index) => {
        const unitNumber = index + 1
        const isUnlocked =
          unlockedUnits.length === 0 || unlockedUnits.includes(unitNumber)
        return {
          id: unitNumber,
          unitOrder: unitNumber,
          title: schemaUnit.title,
          subtitle: schemaUnit.subtitle,
          learningObjective: schemaUnit.learningObjective,
          difficulty: schemaUnit.difficulty,
          theme: schemaUnit.theme,
          estimatedDurationMin: schemaUnit.estimatedDurationMin,
          state: !isUnlocked
            ? 'locked'
            : unitNumber === 1
              ? 'current'
              : 'available',
          xp: 0,
          completed: false,
          lastAccessedAt: null,
          lastAccessed: false
        }
      })
      return { units: defaultUnits, completedSections: 0 }
    }

    // Otherwise, use the standard building function
    const builtUnits = buildLearningPathWithSchema(
      advanceSections,
      currentSectionIndex,
      schemaUnits,
      exams || [],
      unlockedUnits
    )

    const completed = builtUnits.filter(u => u.state === 'completed').length
    return { units: builtUnits, completedSections: completed }
  }, [schemaUnits, adaptedData, currentSectionIndex, exams, unlockedUnits])

  console.log('[useLearningPath] state →', {
    coursesLoading,
    schemaLoading,
    advanceLoading: advance.loading,
    schemaUnitsCount: schemaUnits.length,
    coursesCount: coursesData.length
  })
  return {
    units,
    courseTitle,
    courseId,
    totalSections,
    currentSection: currentSectionIndex,
    completedSections,
    loading: coursesLoading || schemaLoading || advance.loading,
    error: null
  }
}

export default useLearningPathWithSchema
