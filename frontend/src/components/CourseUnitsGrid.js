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
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Lightning,
  Lock,
  Play
} from '@phosphor-icons/react'
import { buildUnitPath } from 'utils/courseParams'
import styles from './CourseUnitsGrid.module.scss'

const CourseUnitsGrid = memo(function CourseUnitsGrid({ units = [], courseId = 1, compact = false, onLockedUnitClick }) {
  const history = useHistory()

  const handleUnitClick = (unit) => {
    if (unit.state !== 'locked' || unit.type === 'challenge-premium') {
      // Navigate to the unit if not locked (or premium locked)
      if (unit.unitOrder) {
        history.push(buildUnitPath(courseId, unit.unitOrder))
      } else if (unit.examId) {
        history.push(`/exam/${unit.examId}`)
      }
    } else if (onLockedUnitClick) {
      onLockedUnitClick(unit)
    }
  }

  const regularUnits = units.filter(u => !u.type || u.type === 'lesson')
  const challengeUnits = units.filter(u => u.type === 'challenge' || u.type === 'challenge-premium')

  return (
    <div className={clsx(styles.container, compact && styles.containerCompact)}>
      {/* Regular units */}
      {regularUnits.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Your route</span>
            <h2 className={styles.sectionTitle}>Course Units</h2>
          </div>
          <div className={styles.grid}>
            {regularUnits.map((unit) => (
              <UnitCard
                key={unit.id || unit.unitOrder}
                unit={unit}
                onClick={() => handleUnitClick(unit)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Challenge units */}
      {challengeUnits.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Checkpoints</span>
            <h2 className={styles.sectionTitle}>Challenges</h2>
          </div>
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

function getUnitPresentation(unit) {
  const progressValue = Math.round((unit.progressPercent || 0) * 100)
  const hasProgress = progressValue > 0

  if (unit.state === 'completed') {
    return {
      label: 'Completed',
      action: 'Review',
      icon: <CheckCircle weight="fill" size={18} aria-hidden="true" />
    }
  }

  if (unit.state === 'locked') {
    return {
      label: 'Locked',
      action: 'Locked',
      icon: <Lock weight="fill" size={18} aria-hidden="true" />
    }
  }

  if (unit.state === 'current') {
    return {
      label: hasProgress ? 'In progress' : 'Current',
      action: hasProgress ? 'Resume' : 'Continue',
      icon: <Play weight="fill" size={16} aria-hidden="true" />
    }
  }

  if (hasProgress) {
    return {
      label: 'In progress',
      action: 'Resume',
      icon: <Play weight="fill" size={16} aria-hidden="true" />
    }
  }

  return {
    label: 'Available',
    action: 'Start',
    icon: <ArrowRight weight="bold" size={16} aria-hidden="true" />
  }
}

function UnitProgressState({ unit, accentColor }) {
  const progressValue = Math.round((unit.progressPercent || 0) * 100)
  const isCompleted = unit.state === 'completed'
  const isLocked = unit.state === 'locked'

  if (isCompleted) {
    return (
      <div className={styles.cardProgressComplete}>
        <CheckCircle weight="fill" size={16} aria-hidden="true" />
        <span>Unit complete</span>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className={styles.cardProgressLocked}>
        <Lock weight="fill" size={15} aria-hidden="true" />
        <span>Complete previous unit first</span>
      </div>
    )
  }

  return (
    <div className={styles.cardProgress}>
      <div
        className={styles.cardProgressBar}
        role="progressbar"
        aria-label={`Unit ${unit.unitOrder || ''} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
      >
        <div
          className={styles.cardProgressFill}
          style={{
            width: `${progressValue}%`,
            backgroundColor: accentColor
          }}
        />
      </div>
      <span className={styles.cardProgressLabel}>{progressValue}%</span>
    </div>
  )
}

function UnitMetadata({ unit }) {
  return (
    <div className={styles.metadata} aria-label="Unit details">
      {unit.difficulty && (
        <span className={styles.tag}>
          <span className={styles.label}>Level</span>
          {unit.difficulty}
        </span>
      )}
      {unit.estimatedDurationMin && (
        <span className={styles.tag}>
          <Clock size={14} weight="bold" aria-hidden="true" />
          <span>{unit.estimatedDurationMin} min</span>
        </span>
      )}
      {unit.xp > 0 && (
        <span className={styles.tag}>
          <Lightning size={14} weight="fill" aria-hidden="true" />
          <span>{unit.xp} XP</span>
        </span>
      )}
    </div>
  )
}

function UnitActionButton({ presentation }) {
  return (
    <span className={styles.actionButton} aria-hidden="true">
      <span className={styles.actionIcon}>{presentation.icon}</span>
      <span className={styles.actionText}>{presentation.action}</span>
    </span>
  )
}

function UnitCard({ unit, onClick }) {
  const isLocked = unit.state === 'locked'
  const isCompleted = unit.state === 'completed'
  const isCurrent = unit.state === 'current'
  const isInProgress = unit.progressPercent > 0 && !isCompleted
  const theme = unit.theme || {}
  const description = unit.subtitle || unit.learningObjective
  const descriptionId = `unit-${unit.id || unit.unitOrder}-description`

  const accentColor = theme.accent || '#1CB0F6'
  const backgroundColor = theme.accentSoft || '#E0F2FE'
  const presentation = getUnitPresentation(unit)

  return (
    <button
      type="button"
      className={clsx(
        styles.unitCard,
        isCompleted && styles.unitCardCompleted,
        isCurrent && styles.unitCardCurrent,
        isInProgress && styles.unitCardInProgress,
        isLocked && styles.unitCardLocked
      )}
      onClick={onClick}
      aria-label={`Unit ${unit.unitOrder || ''}: ${unit.title}. ${presentation.label}.`}
      aria-describedby={description ? descriptionId : undefined}
      aria-disabled={isLocked}
      style={{
        '--accent-color': accentColor,
        '--bg-color': backgroundColor
      }}
    >
      <div className={styles.cardTopline}>
        <span className={styles.unitNumber}>Unit {unit.unitOrder || '?'}</span>
        <span className={styles.statusPill}>{presentation.label}</span>
      </div>

      <div className={styles.header}>
        <h3 className={styles.title}>{unit.title}</h3>
        <UnitActionButton presentation={presentation} />
      </div>

      {description && (
        <p id={descriptionId} className={styles.subtitle}>
          {description}
        </p>
      )}

      <div className={styles.footer}>
        <UnitMetadata unit={unit} />
      </div>

      <UnitProgressState unit={unit} accentColor={accentColor} />

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
      type="button"
      className={clsx(
        styles.challengeCard,
        isCompleted && styles.challengeCardCompleted,
        isPremium && styles.challengeCardPremium,
        isLocked && !isPremium && styles.challengeCardLocked
      )}
      onClick={onClick}
      aria-label={`${unit.title}. ${isPremium ? 'Premium challenge' : 'Challenge'}. ${isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Available'}.`}
      aria-disabled={isLocked && !isPremium}
    >
      <div className={styles.challengeBadge}>
        {isPremium ? 'Premium' : 'Challenge'}
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
