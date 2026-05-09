import React, { memo, useMemo } from 'react'
import clsx from 'clsx'
import {
  CheckCircle,
  Lock,
  Trophy,
  Star,
  Crown,
  BookOpen,
  Fire,
  Lightning
} from '@phosphor-icons/react'
import styles from './LearningPath.module.scss'

// ── Layout constants ──────────────────────────────────────────────────────────
const DESIGN_W = 520 // SVG coordinate space width — must match .pathArea CSS width
const NODE_R = 32 // Node radius (px) → 64px diameter (was 44 → 88px)
const NODE_STEP = 130 // Vertical distance between consecutive nodes (was 175)
const MILESTONE_H = 80 // Vertical space consumed by each milestone (was 112)
const SECTION_SIZE = 5 // Units per section

// Zig-zag x positions as fraction of DESIGN_W (repeats every SECTION_SIZE)
// More dramatic spread: far-left → center → far-right → center → far-left
const SECTION_X = [0.15, 0.5, 0.85, 0.5, 0.15]

// ── Build layout ──────────────────────────────────────────────────────────────
function buildItems(units, sectionMilestones = []) {
  const items = []
  let y = NODE_R + 36 // initial top padding

  units.forEach((unit, index) => {
    const posInSection = index % SECTION_SIZE
    const x = Math.round(SECTION_X[posInSection] * DESIGN_W)

    items.push({ type: 'node', unit, unitIndex: index, x, y })

    const isLastInSection = posInSection === SECTION_SIZE - 1
    const hasNext = index < units.length - 1

    if (isLastInSection && hasNext) {
      const sectionNum = Math.floor(index / SECTION_SIZE) + 1
      const milestoneY = y + Math.round(NODE_STEP * 0.55)
      items.push({
        type: 'milestone',
        sectionNum,
        label:
          sectionMilestones[sectionNum - 1] ||
          `Section ${sectionNum} Complete!`,
        x: Math.round(DESIGN_W * 0.5),
        y: milestoneY,
        isCompleted: unit.state === 'completed'
      })
      y = milestoneY + Math.round(MILESTONE_H * 0.5)
    } else {
      y += NODE_STEP
    }
  })

  return { items, totalHeight: y + NODE_R + 52 }
}

// ── Build SVG path segments ───────────────────────────────────────────────────
// Connects every consecutive pair of items (node→node, node→milestone, milestone→node)
function buildSegments(items) {
  // Index of the current node in items (first one with state 'current')
  const currentItemIdx = items.findIndex(
    it => it.type === 'node' && it.unit.state === 'current'
  )

  return items.slice(0, -1).map((from, i) => {
    const to = items[i + 1]
    const midY = Math.round((from.y + to.y) / 2)
    // The segment approaching a challenge node turns amber — "boss level ahead"
    const toType = to.unit?.type ?? 'lesson'
    const isChallengeSeg =
      to.type === 'node' &&
      (toType === 'challenge' || toType === 'challenge-premium')
    return {
      d: `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`,
      done: i < currentItemIdx,
      active: i === currentItemIdx - 1,
      isChallengeSeg
    }
  })
}

// ── PathHeader ────────────────────────────────────────────────────────────────
function PathHeader({
  title,
  description,
  completed,
  total,
  streak,
  xp,
  compact
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className={clsx(styles.header, compact && styles.headerCompact)}>
      {(title || description) && (
        <div className={styles.headerText}>
          {title && <h1 className={styles.courseTitle}>{title}</h1>}
          {description && <p className={styles.courseDesc}>{description}</p>}
        </div>
      )}

      <div className={styles.progressRow}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completed} of ${total} units completed`}
        >
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressLabel}>
          {completed}/{total}
        </span>
      </div>

      {(streak != null || xp != null) && (
        <div className={styles.headerStats}>
          {streak != null && (
            <span className={styles.statPill}>
              <Fire weight="fill" size={16} aria-hidden="true" />
              {streak} day streak
            </span>
          )}
          {xp != null && (
            <span className={clsx(styles.statPill, styles.statPillXP)}>
              <Lightning weight="fill" size={16} aria-hidden="true" />
              {xp} XP
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── PathNode ──────────────────────────────────────────────────────────────────
//
// Renders three node flavours via data-type + data-state attributes:
//   lesson           — default: blue (current) / green (done) / gray (locked)
//   challenge        — amber gold: free exam milestone
//   challenge-premium — indigo: paid exam milestone (clickable even when locked)
//
const PathNode = memo(function PathNode({ item, onUnitClick }) {
  const { unit, unitIndex } = item
  const { state, title, Icon: UnitIcon } = unit
  const type = unit.type ?? 'lesson'

  const isCompleted = state === 'completed'
  const isCurrent = state === 'current'
  const isLocked = state === 'locked'
  const isChallenge = type === 'challenge' || type === 'challenge-premium'
  const isPremium = type === 'challenge-premium'

  // Premium locked nodes are still clickable → parent shows unlock modal
  const isDisabled = isLocked && !isPremium

  const ariaLabel =
    `${isPremium ? 'Premium Challenge' : isChallenge ? 'Challenge' : 'Unit'} ` +
    `${unitIndex + 1}: ${title}` +
    (isPremium && isLocked
      ? ' — unlock to access'
      : isLocked
        ? ' — locked'
        : '')

  return (
    <div className={styles.nodeWrapper}>
      {/* ── Challenge / Premium badge — floats ABOVE the node ─────────── */}
      {isChallenge && (
        <span
          className={clsx(
            styles.challengeBadge,
            isPremium && styles.challengeBadgePremium,
            isCompleted && styles.challengeBadgeDone,
            isLocked && !isPremium && styles.challengeBadgeLocked
          )}
          aria-hidden="true"
        >
          {isPremium ? '★ Premium' : '✦ Challenge'}
        </span>
      )}

      {/* ── Node button ───────────────────────────────────────────────── */}
      <button
        className={clsx(
          styles.node,
          // Lesson-only state classes (challenge nodes use data-attr styles)
          !isChallenge && isCompleted && styles.nodeCompleted,
          !isChallenge && isCurrent && styles.nodeCurrent,
          !isChallenge && isLocked && styles.nodeLocked
        )}
        data-type={type}
        data-state={state}
        style={{
          '--progress-percent': unit.progressPercent
            ? `${unit.progressPercent * 100}%`
            : '0%'
        }}
        onClick={isDisabled ? undefined : () => onUnitClick?.(unit, unitIndex)}
        disabled={isDisabled}
        aria-label={ariaLabel}
      >
        {/* ── Progress ring: current node only */}
        {isCurrent && unit.progressPercent > 0 && (
          <svg
            className={styles.progressRing}
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              className={styles.progressRingTrack}
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              className={styles.progressRingFill}
              style={{
                strokeDasharray: `${unit.progressPercent * 175.8} 175.8`,
                transition: 'stroke-dasharray 0.3s ease-out'
              }}
            />
          </svg>
        )}

        {/* Pulse rings: regular current (blue) */}
        {isCurrent && !isChallenge && (
          <>
            <span className={styles.nodePulse} aria-hidden="true" />
            <span className={styles.nodePulse2} aria-hidden="true" />
            <span className={styles.nodeShine} aria-hidden="true" />
          </>
        )}

        {/* Pulse rings: challenge current (amber) */}
        {isCurrent && isChallenge && !isPremium && (
          <>
            <span className={styles.nodePulseChallenge} aria-hidden="true" />
            <span className={styles.nodePulseChallenge2} aria-hidden="true" />
            <span className={styles.nodeShine} aria-hidden="true" />
          </>
        )}

        {/* Pulse rings: premium current (indigo) */}
        {isCurrent && isPremium && (
          <>
            <span className={styles.nodePulsePremium} aria-hidden="true" />
            <span className={styles.nodeShine} aria-hidden="true" />
          </>
        )}

        {/* ── Icons ──────────────────────────────────────────────────── */}
        <span className={styles.nodeIconWrap} aria-hidden="true">
          {/* Lesson — 64px node → 26px icon; 80px current → 30px icon */}
          {!isChallenge && isCompleted && (
            <CheckCircle weight="fill" size={26} />
          )}
          {!isChallenge &&
            isCurrent &&
            (UnitIcon ? (
              <UnitIcon weight="fill" size={30} />
            ) : (
              <BookOpen weight="fill" size={30} />
            ))}
          {!isChallenge && isLocked && <Lock weight="fill" size={20} />}

          {/* Challenge (free) — 72px node → 26px; 86px current → 30px */}
          {isChallenge &&
            !isPremium &&
            (isCompleted ? (
              <CheckCircle weight="fill" size={26} />
            ) : (
              <Star weight="fill" size={isCurrent ? 30 : 24} />
            ))}

          {/* Challenge (premium) — same scale */}
          {isPremium &&
            (isCompleted ? (
              <CheckCircle weight="fill" size={26} />
            ) : (
              <Crown weight="fill" size={isCurrent ? 28 : 22} />
            ))}
        </span>
      </button>

      {/* Unit number */}
      <span className={styles.nodeNum} aria-hidden="true">
        {unitIndex + 1}
      </span>

      {/* Label */}
      <span
        className={clsx(
          styles.nodeLabel,
          !isChallenge && isLocked && styles.nodeLabelLocked,
          isChallenge && styles.nodeLabelChallenge
        )}
      >
        {title}
      </span>
    </div>
  )
})

// ── MilestoneBadge ────────────────────────────────────────────────────────────
const MilestoneBadge = memo(function MilestoneBadge({ item }) {
  const { label, isCompleted } = item
  return (
    <div
      className={clsx(
        styles.milestone,
        isCompleted && styles.milestoneCompleted
      )}
    >
      <span className={styles.milestoneIcon} aria-hidden="true">
        <Trophy weight="fill" size={18} />
      </span>
      <span className={styles.milestoneLabel}>{label}</span>
      {isCompleted && (
        <Star
          weight="fill"
          size={14}
          className={styles.milestoneStar}
          aria-hidden="true"
        />
      )}
    </div>
  )
})

// ── LearningPath (main) ───────────────────────────────────────────────────────
/**
 * LearningPath — Gamified serpentine learning path.
 *
 * Visual source: Duolingo-style zig-zag journey, 15 units in 3 sections.
 * Layout: vertically scrolling path, nodes alternate left/center/right,
 * connected by smooth SVG bezier curves. Milestone badges between sections.
 *
 * @param {{ id, title, state: 'completed'|'current'|'locked', type?: 'lesson'|'challenge'|'challenge-premium', Icon?, xp?, examId? }[]} units
 * @param {string[]} [sectionMilestones]  - Label for each milestone badge
 * @param {string}   courseTitle
 * @param {string}   [courseDescription]
 * @param {number}   [streak]
 * @param {number}   [totalXP]
 * @param {function} [onUnitClick]        - (unit, index) => void
 * @param {string}   [className]
 *
 * @example
 * <LearningPath
 *   courseTitle="B2 First Certificate"
 *   courseDescription="Master English for the Cambridge exam"
 *   units={[
 *     { id: 1, title: 'Basics',    state: 'completed', xp: 20 },
 *     { id: 2, title: 'Listening', state: 'current',   xp: 25 },
 *     { id: 3, title: 'Grammar',   state: 'locked',    xp: 30 },
 *     // ... 15 total
 *   ]}
 *   sectionMilestones={['Beginner Complete!', 'Intermediate Complete!']}
 *   streak={7}
 *   totalXP={420}
 *   onUnitClick={(unit) => history.push(`/unit/${unit.id}`)}
 * />
 */
const LearningPath = memo(function LearningPath({
  units = [],
  sectionMilestones = [],
  courseTitle,
  courseDescription,
  streak,
  totalXP,
  showHeader = true,
  loading = false,
  onUnitClick,
  onLockedUnitClick,
  className
}) {
  const completedCount = useMemo(
    () => units.filter(u => u.state === 'completed').length,
    [units]
  )

  const { items, totalHeight } = useMemo(
    () => buildItems(units, sectionMilestones),
    [units, sectionMilestones]
  )

  const segments = useMemo(() => buildSegments(items), [items])

  const nodeItems = items.filter(it => it.type === 'node')
  const milestoneItems = items.filter(it => it.type === 'milestone')

  if (loading) {
    return (
      <div className={clsx(styles.root, className)}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: '16px 0'
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 64,
                borderRadius: 16,
                background:
                  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                opacity: 1 - i * 0.15
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(styles.root, className)}>
      {/* Sticky header — hidden when rendered alongside a separate PathHeader */}
      {showHeader && (
        <div className={styles.headerWrap}>
          <PathHeader
            title={courseTitle}
            description={courseDescription}
            completed={completedCount}
            total={units.length}
            streak={streak}
            xp={totalXP}
          />
        </div>
      )}

      {/* Path canvas */}
      <div className={styles.pathOuter}>
        <div className={styles.pathArea} style={{ height: totalHeight }}>
          {/* SVG — path curves only (decorative) */}
          <svg
            className={styles.pathSvg}
            width="100%"
            height={totalHeight}
            viewBox={`0 0 ${DESIGN_W} ${totalHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {segments.map((seg, i) => (
              <React.Fragment key={i}>
                {/* Gray track (always rendered) */}
                <path
                  d={seg.d}
                  fill="none"
                  strokeWidth={10}
                  strokeLinecap="round"
                  className={styles.pathTrack}
                />
                {/* Colored fill — green normally, amber when approaching a challenge */}
                {(seg.done || seg.active) && (
                  <path
                    d={seg.d}
                    fill="none"
                    strokeWidth={10}
                    strokeLinecap="round"
                    className={clsx(
                      styles.pathFill,
                      seg.isChallengeSeg && styles.pathFillChallenge
                    )}
                  />
                )}
                {/* Flowing highlight — white dashes travelling along completed fill */}
                {(seg.done || seg.active) && (
                  <path
                    d={seg.d}
                    fill="none"
                    strokeWidth={4}
                    strokeLinecap="round"
                    className={styles.pathFlow}
                  />
                )}
              </React.Fragment>
            ))}
          </svg>

          {/* HTML nodes — absolutely positioned, aligned to SVG coordinates */}
          {nodeItems.map(item => (
            <div
              key={item.unitIndex}
              className={styles.nodePosition}
              style={{
                left: `${(item.x / DESIGN_W) * 100}%`,
                top: item.y
              }}
            >
              <PathNode item={item} onUnitClick={onUnitClick} />
            </div>
          ))}

          {/* Milestone badges */}
          {milestoneItems.map(item => (
            <div
              key={item.sectionNum}
              className={styles.milestonePosition}
              style={{
                left: `${(item.x / DESIGN_W) * 100}%`,
                top: item.y
              }}
            >
              <MilestoneBadge item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default LearningPath
export { LearningPath, PathHeader }
