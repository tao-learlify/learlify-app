/**
 * CourseUnitsGrid
 * 
 * Displays course units in a responsive grid with:
 * - Unit title and subtitle
 * - Learning objective
 * - Progress (XP, completion status)
 * - Difficulty level
 * - Theme color
 * - Interactive click to navigate
 */

import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { CheckCircle, Lock, Play } from '@phosphor-icons/react'
import styles from './CourseUnitsGrid.module.scss'

const CourseUnitsGrid = memo(function CourseUnitsGrid({ units = [], courseId = 1, compact = false }) {
  const history = useHistory()

  const handleUnitClick = (unit) => {
    if (unit.state !== 'locked' || unit.type === 'challenge-premium') {
      // Navigate to the unit if not locked (or premium locked)
      if (unit.unitOrder) {
        history.push(`/courses/${courseId}/units/${unit.unitOrder}`)
      } else if (unit.examId) {
        history.push(`/exam/${unit.examId}`)
      }
    }
  }

  const regularUnits = units.filter(u => !u.type || u.type === 'lesson')
  const challengeUnits = units.filter(u => u.type === 'challenge' || u.type === 'challenge-premium')

  return (
    <div className={clsx(styles.container, compact && styles.containerCompact)}>
      {/* Regular units */}
      {regularUnits.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Course Units</h2>
          <div className={styles.grid}>
            {regularUnits.map((unit) => (
              <UnitCard
                key={unit.id || unit.unitOrder}
                unit={unit}
                onClick={() => handleUnitClick(unit)}
                courseId={courseId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Challenge units */}
      {challengeUnits.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Challenges</h2>
          <div className={styles.gridChallenges}>
            {challengeUnits.map((unit) => (
              <ChallengeCard
                key={unit.id}
                unit={unit}
                onClick={() => handleUnitClick(unit)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
})

// ── UnitCard ──────────────────────────────────────────────────────

function UnitCard({ unit, onClick, courseId }) {
  const isLocked = unit.state === 'locked'
  const isCompleted = unit.state === 'completed'
  const isCurrent = unit.state === 'current'
  const theme = unit.theme || {}

  const accentColor = theme.accent || '#3B82F6'
  const backgroundColor = theme.accentSoft || '#DBEAFE'

  return (
    <button
      className={clsx(
        styles.unitCard,
        isCompleted && styles.unitCardCompleted,
        isCurrent && styles.unitCardCurrent,
        isLocked && styles.unitCardLocked
      )}
      onClick={onClick}
      disabled={isLocked}
      style={{
        '--accent-color': accentColor,
        '--bg-color': backgroundColor,
        borderLeftColor: accentColor
      }}
    >
      {/* Status Badge */}
      <div className={styles.badge}>
        {isCompleted && <CheckCircle weight="fill" size={20} color="#10B981" />}
        {isCurrent && <Play weight="fill" size={16} color={accentColor} />}
        {isLocked && <Lock weight="fill" size={16} color="#9CA3AF" />}
      </div>

      {/* Header: Unit number and title */}
      <div className={styles.header}>
        <span className={styles.unitNumber}>Unit {unit.unitOrder || '?'}</span>
        <h3 className={styles.title}>{unit.title}</h3>
      </div>

      {/* Subtitle */}
      {unit.subtitle && <p className={styles.subtitle}>{unit.subtitle}</p>}

      {/* Learning Objective */}
      {unit.learningObjective && (
        <p className={styles.objective}>{unit.learningObjective}</p>
      )}

      {/* Footer: Metadata */}
      <div className={styles.footer}>
        <div className={styles.metadata}>
          {unit.difficulty && (
            <span className={styles.tag}>
              <span className={styles.label}>Level</span>
              {unit.difficulty}
            </span>
          )}
          {unit.estimatedDurationMin && (
            <span className={styles.tag}>
              <span className={styles.label}>Duration</span>
              {unit.estimatedDurationMin} min
            </span>
          )}
        </div>

        {/* XP Badge */}
        {unit.xp > 0 && (
          <div className={styles.xpBadge}>
            <span className={styles.xpValue}>{unit.xp}</span>
            <span className={styles.xpLabel}>XP</span>
          </div>
        )}
      </div>

      {/* Progress bar: shows progressPercent for current/in-progress units */}
      {(isCurrent || (unit.progressPercent > 0 && !isCompleted)) && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(unit.progressPercent || 0) * 100}%`,
              backgroundColor: accentColor
            }}
          />
        </div>
      )}

      {/* Progress indicator */}
      {unit.lastAccessedAt && (
        <div className={styles.lastAccessed} title={`Last accessed: ${unit.lastAccessedAt}`}>
          Last accessed
        </div>
      )}
    </button>
  )
}

// ── ChallengeCard ────────────────────────────────────────────────

function ChallengeCard({ unit, onClick }) {
  const isLocked = unit.state === 'locked'
  const isCompleted = unit.state === 'completed'
  const isPremium = unit.type === 'challenge-premium'

  return (
    <button
      className={clsx(
        styles.challengeCard,
        isCompleted && styles.challengeCardCompleted,
        isPremium && styles.challengeCardPremium,
        isLocked && !isPremium && styles.challengeCardLocked
      )}
      onClick={onClick}
    >
      <div className={styles.challengeBadge}>
        {isPremium ? '★ Premium' : '✦ Challenge'}
      </div>

      <h4 className={styles.challengeTitle}>{unit.title}</h4>

      {isCompleted && (
        <div className={styles.challengeStatus}>
          <CheckCircle weight="fill" size={24} /> Completed
        </div>
      )}

      {unit.xp > 0 && (
        <div className={styles.challengeXP}>{unit.xp} XP</div>
      )}
    </button>
  )
}

export default CourseUnitsGrid
