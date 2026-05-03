import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { UnitView } from 'views/courses/unit'
import useConnectedUnit from 'hooks/useConnectedUnit'
import useCourses from 'hooks/useCourses'
import useAdvance from 'hooks/useAdvance'
import useProgressTracking from 'hooks/useProgressTracking'
import useProgressPolling from 'hooks/useProgressPolling'
import { parseCourseParam, resolveCourse, parseUnitParam } from 'utils/courseParams'
import PATH from 'utils/path'

/**
 * Load unit from samples (schemas/course/samples/unit-N.ts)
 * Only used in development during the schema migration phase.
 *
 * @param {number} unitOrder - 1-based unit number
 * @returns {Promise<import('schemas/course/hierarchy').Unit|null>}
 */
async function loadSampleUnit(unitOrder) {
  if (process.env.NODE_ENV !== 'development') return null
  try {
    const module = await import('schemas/course/samples/index')
    return (await module.getCourseUnit(unitOrder)) || null
  } catch {
    return null
  }
}

// ── Loading skeleton ──────────────────────────────────────────

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

// ── Shared action button ──────────────────────────────────────

function ActionButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      {children}
    </button>
  )
}

// ── Terminal states ───────────────────────────────────────────

function ErrorState({ message, onRetry, onBack }) {
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
      <div style={{ display: 'flex', gap: '12px' }}>
        {onRetry && <ActionButton onClick={onRetry}>Try again</ActionButton>}
        <ActionButton onClick={onBack}>Back to courses</ActionButton>
      </div>
    </div>
  )
}

function TimeoutState({ onRetry, onBack }) {
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
      <p style={{ color: 'var(--color-text-muted, #888)', fontSize: '16px', textAlign: 'center', maxWidth: '420px' }}>
        This is taking longer than expected. Check your connection and try again.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <ActionButton onClick={onRetry}>Try again</ActionButton>
        <ActionButton onClick={onBack}>Back to courses</ActionButton>
      </div>
    </div>
  )
}

function EmptyState({ onBack }) {
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
      <p style={{ color: 'var(--color-text-muted, #888)', fontSize: '16px', textAlign: 'center', maxWidth: '420px' }}>
        This unit is not available yet.
      </p>
      <ActionButton onClick={onBack}>Back to courses</ActionButton>
    </div>
  )
}

// ── ConnectedUnitView ─────────────────────────────────────────

/**
 * ConnectedUnitView — connection layer between API/CDN and UnitView.
 *
 * Route params:
 *   :courseSlug  — opaque course param (e.g. "c1") or real slug
 *   :unitSlug    — opaque unit param (e.g. "u3") or real slug
 *
 * Status contract — this component ALWAYS resolves to one of:
 *   ready   → renders <UnitView>
 *   empty   → renders EmptyState
 *   error   → renders ErrorState with retry
 *   timeout → renders TimeoutState with retry
 *
 * Progress loading is non-blocking. If progress fails, unit still renders
 * from an empty state — the user can study without prior progress data.
 */
export default function ConnectedUnitView() {
  const history = useHistory()
  const { courseSlug, unitSlug } = useParams()

  // ── Sample unit (dev migration phase, non-blocking) ──────────────────────
  const parsedUnit = parseUnitParam(unitSlug)
  const unitOrderNum = parsedUnit?.order ?? 1

  const [sampleUnit, setSampleUnit] = useState(null)

  useEffect(() => {
    loadSampleUnit(unitOrderNum).then(u => setSampleUnit(u || null)).catch(() => null)
  }, [unitOrderNum])

  // ── Backend unit ─────────────────────────────────────────────────────────
  const { unit: backendUnit, status, error, retry } = useConnectedUnit(courseSlug, unitSlug)

  // ── Progress — resolved course ID for tracking ───────────────────────────
  const { data: coursesData } = useCourses()
  const advance = useAdvance()

  const actualCourseId = useMemo(() => {
    const parsedCourse = parseCourseParam(courseSlug)
    // Fast path: opaque slug already encodes the ID (e.g. "c1" → 1)
    if (parsedCourse?.id) return parsedCourse.id
    // Fallback: look up by real slug when courses data is available
    const course = resolveCourse(parsedCourse, coursesData)
    return course?.id ?? null
  }, [courseSlug, coursesData])

  const currentSectionIndex = useMemo(() => {
    const content = advance?.data?.[0]?.content
    if (!content) return 1
    const lastKey = Object.keys(content).find(k => content[k]?.last === true)
    return lastKey ? parseInt(lastKey, 10) : 1
  }, [advance])

  // Skip the intro if this unit has already been started (has an advance content entry)
  const hasStarted = useMemo(() => {
    const content = advance?.data?.[0]?.content
    if (!content) return false
    const unitKey = String(unitOrderNum)
    return !!content[unitKey]
  }, [advance, unitOrderNum])

  // Restore saved v2 block-level progress (completedBlockIds, xpRecord, currentBlockId)
  const savedProgress = useMemo(() => {
    const content = advance?.data?.[0]?.content
    if (!content) return undefined
    const unitEntry = content[String(unitOrderNum)]
    if (!unitEntry?.v2) return undefined
    return unitEntry.v2
  }, [advance, unitOrderNum])

  // Progress is non-blocking: if hooks fail (e.g. no courseId yet), unit still renders.
  const { updateProgress, completeSection, flush } = useProgressTracking(actualCourseId, currentSectionIndex)
  useProgressPolling(actualCourseId, 5000)

  // Save any pending debounced progress when the user leaves this page
  useEffect(() => () => flush(), [flush])

  const handleBack = () => history.push(PATH.COURSES)

  // ── Unit resolution: sample wins over backend in dev ─────────────────────
  const unit = sampleUnit || backendUnit

  // ── Ready: we have a unit — render immediately regardless of status ───────
  if (unit) {
    return (
      <UnitView
        unit={unit}
        onBackToCourse={handleBack}
        skipIntro={hasStarted}
        savedProgress={savedProgress}
        onProgressUpdate={(xp, exercisesCompleted, progressPercent, v2) =>
          updateProgress(xp, exercisesCompleted, progressPercent, v2)
        }
        onSectionComplete={(finalXp, examScore) => completeSection(finalXp, examScore)}
      />
    )
  }

  // ── Terminal states ───────────────────────────────────────────────────────
  if (status === 'timeout') return <TimeoutState onRetry={retry} onBack={handleBack} />
  if (status === 'empty') return <EmptyState onBack={handleBack} />
  if (status === 'error') {
    return (
      <ErrorState
        message={error?.message}
        onRetry={retry}
        onBack={handleBack}
      />
    )
  }

  // ── Loading (idle / loading) ──────────────────────────────────────────────
  return <LoadingSkeleton />
}

