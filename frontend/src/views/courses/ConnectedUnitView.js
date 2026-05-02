import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { UnitView } from 'views/courses/unit'
import useConnectedUnit from 'hooks/useConnectedUnit'
import useCourses from 'hooks/useCourses'
import useAdvance from 'hooks/useAdvance'
import useProgressTracking from 'hooks/useProgressTracking'
import useProgressPolling from 'hooks/useProgressPolling'
import PATH from 'utils/path'

/**
 * Load unit from samples (schemas/course/samples/unit-N.ts)
 * Used during migration before all units are on backend.
 * 
 * @param {number} unitOrder - Unit number (1-15)
 * @returns {Promise<Unit|null>}
 */
async function loadSampleUnit(unitOrder) {
  if (process.env.NODE_ENV !== 'development') return null
  
  try {
    const module = await import(`schemas/course/samples/index`)
    const unit = await module.getCourseUnit(unitOrder)
    return unit || null
  } catch {
    return null
  }
}

// ── Loading skeleton ───────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--color-bg-page, #f9f9f9)'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-brand-primary, #6c63ff)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite'
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--color-text-muted, #999)', fontSize: '14px', margin: 0 }}>
        Loading unit…
      </p>
    </div>
  )
}

// ── Error state ───────────────────────────────────────────────

function ErrorState({ message, onBack }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
        padding: '32px',
        background: 'var(--color-bg-page, #f9f9f9)'
      }}
    >
      <p style={{ color: 'var(--color-error, #e53e3e)', fontSize: '16px', textAlign: 'center', maxWidth: '420px' }}>
        {message || 'Failed to load unit content. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onBack}
        style={{
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          background: 'var(--color-brand-primary, #6c63ff)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Back to courses
      </button>
    </div>
  )
}

// ── ConnectedUnitView ─────────────────────────────────────────

/**
 * ConnectedUnitView — the connection layer between API/CDN and UnitView.
 *
 * Architecture role:
 *
 *   API/CDN payload
 *     → useConnectedUnit (fetch + adapt)
 *       → adaptLegacyCourse (schema boundary)
 *         → Unit v2 object
 *           → UnitView (schema-first runtime)
 *
 * Migration strategy (unit-1 through unit-15):
 *   1. Try to load from schemas/course/samples/unit-N.ts (development only)
 *   2. Fall back to API/CDN fetch
 *   3. Show error state if both fail
 *
 * Route params:
 *   :courseId  — optional; falls back to first available course
 *   :unitOrder — 1-based unit index within the course (defaults to 1)
 */
export default function ConnectedUnitView() {
  const history = useHistory()
  const { courseId, unitOrder } = useParams()
  const unitOrderNum = unitOrder ? parseInt(unitOrder, 10) : 1

  // Get courses and advance data for progress tracking
  const { data: coursesData } = useCourses()
  const advance = useAdvance()

  // Determine actual courseId (from params or first available course)
  // useParams() returns strings — parse to integer for backend validation
  const actualCourseId = courseId ? parseInt(courseId, 10) : (coursesData[0]?.id)
  
  // Get current section index from advance (1-based)
  // API returns content = { "1": { completed, general, last }, ... }
  // Find the section with last: true
  const currentSectionIndex = useMemo(() => {
    const content = advance?.data?.[0]?.content
    if (!content) return 1

    const lastSection = Object.keys(content).find(key => content[key]?.last === true)
    return lastSection ? parseInt(lastSection, 10) : 1
  }, [advance])

  // Initialize progress tracking hooks
  // ✅ Now using existing PUT /advance API endpoint
  const {
    updateProgress,
    completeSection,
    localProgress,
    localXp,
    loading: progressLoading,
    error: progressError
  } = useProgressTracking(actualCourseId, currentSectionIndex)

  // Poll backend every 5s to keep learning path graph in sync
  useProgressPolling(actualCourseId, 5000)

  // Try to load sample unit first (migration phase)
  const [sampleUnit, setSampleUnit] = useState(null)
  const [sampleLoading, setSampleLoading] = useState(true)
  const [sampleError, setSampleError] = useState(null)

  useEffect(() => {
    loadSampleUnit(unitOrderNum)
      .then((unit) => {
        setSampleUnit(unit)
        setSampleLoading(false)
      })
      .catch((err) => {
        setSampleError(err)
        setSampleLoading(false)
      })
  }, [unitOrderNum])

  // Fetch from backend (always, will be skipped if sample loads first)
  const { unit: backendUnit, status, error } = useConnectedUnit(
    courseId || null,
    unitOrderNum
  )

  const handleBack = () => history.push(PATH.COURSES)

  // Use sample unit if available, otherwise use backend unit
  const unit = sampleUnit || backendUnit

  // Loading states
  if ((sampleLoading && !unit) || status === 'idle' || status === 'loading_courses' || status === 'loading_unit') {
    return <LoadingSkeleton />
  }

  // Error handling
  if (!unit) {
    const errorMsg = sampleError?.message || error?.message || 'Failed to load unit'
    return (
      <ErrorState
        message={errorMsg}
        onBack={handleBack}
      />
    )
  }

  // Adapted unit is ready — pass to runtime unchanged
  if (status === 'ready' && unit) {
    return (
      <UnitView
        unit={unit}
        onBackToCourse={handleBack}
        onProgressUpdate={(xp, exercisesCompleted, progressPercent) => {
          updateProgress(xp, exercisesCompleted, progressPercent)
        }}
        onSectionComplete={(finalXp, examScore) => {
          completeSection(finalXp, examScore)
        }}
      />
    )
  }

  // Fallback guard (should not reach in normal operation)
  return <LoadingSkeleton />
}
