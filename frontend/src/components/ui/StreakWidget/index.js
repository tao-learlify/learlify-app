import React, { memo } from 'react'
import clsx from 'clsx'
import { Fire, Trophy } from '@phosphor-icons/react'
import styles from './StreakWidget.module.scss'

const MOTIVATIONAL_COPY = [
  'Keep going!',
  "You're on fire!",
  'Unstoppable!',
  'Incredible!',
  'Legendary!'
]

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/**
 * StreakWidget — Displays the user's current study streak.
 *
 * Two modes:
 * - Default: compact inline widget (flame + count + motivational copy)
 * - Featured: full amber card with weekly day tracker + daily goal (dashboard hero)
 *
 * @param {number}   streakDays      - Current consecutive days (0+)
 * @param {number}   [longestStreak] - All-time best streak
 * @param {boolean}  [isActive]      - Whether the user has studied today
 * @param {boolean}  [featured]      - Full amber card mode for dashboard hero
 * @param {boolean[]} [weekDays]     - 7-element array (Sun→Sat), true = completed
 * @param {number}   [dailyGoal]     - XP goal for the day (shown in featured mode)
 * @param {number}   [dailyXP]       - XP earned today (shown in featured mode)
 * @param {'sm'|'md'|'lg'} [size]   - Widget size (non-featured mode)
 * @param {string}   [className]
 *
 * @example
 * // Compact:
 * <StreakWidget streakDays={14} longestStreak={30} isActive />
 *
 * // Featured (dashboard hero):
 * <StreakWidget
 *   featured
 *   streakDays={14}
 *   weekDays={[true, true, true, false, true, true, false]}
 *   dailyGoal={50}
 *   dailyXP={30}
 * />
 */
const StreakWidget = memo(function StreakWidget({
  streakDays = 0,
  longestStreak,
  isActive = true,
  featured = false,
  weekDays,
  dailyGoal,
  dailyXP = 0,
  size = 'md',
  className
}) {
  const copyIndex = Math.min(
    Math.floor(streakDays / 7),
    MOTIVATIONAL_COPY.length - 1
  )
  const motivational =
    streakDays >= 7
      ? MOTIVATIONAL_COPY[copyIndex]
      : streakDays > 0
        ? 'Keep going!'
        : 'Start your streak today!'

  const isRecord =
    longestStreak != null && streakDays > 0 && streakDays >= longestStreak
  const goalProgress = dailyGoal
    ? Math.min((dailyXP / dailyGoal) * 100, 100)
    : 0

  if (featured) {
    return (
      <div
        className={clsx(
          styles.featured,
          !isActive && styles.featuredInactive,
          className
        )}
        aria-label={`Streak: ${streakDays} day${streakDays !== 1 ? 's' : ''}`}
      >
        {/* Flame circle + count — matches code.html vertical center layout */}
        <div className={styles.featuredTop}>
          <div className={styles.featuredFlameCircle} aria-hidden="true">
            <Fire
              weight="fill"
              size="var(--icon-2xl)"
              className={styles.featuredFlame}
            />
          </div>
          <div className={styles.featuredCountWrap}>
            <span className={styles.featuredCount}>
              {streakDays} Day Streak!
            </span>
            <span className={styles.featuredUnit}>{motivational}</span>
          </div>
          {isRecord && (
            <span
              className={styles.featuredRecord}
              aria-label="Personal record"
            >
              <Trophy weight="fill" size="var(--icon-md)" aria-hidden="true" />{' '}
              PR
            </span>
          )}
        </div>

        {/* Weekly day tracker — label lives inside the square (code.html style) */}
        {weekDays && weekDays.length === 7 && (
          <div className={styles.weekRow} aria-label="This week">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className={clsx(
                  styles.dayDot,
                  weekDays[i] && styles.dayDotDone
                )}
                aria-label={`${label}: ${weekDays[i] ? 'completed' : 'not completed'}`}
              >
                <span
                  className={clsx(
                    styles.dayLabel,
                    weekDays[i] && styles.dayLabelDone
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Daily XP goal */}
        {dailyGoal != null && (
          <div className={styles.goalSection}>
            <div className={styles.goalHeader}>
              <span className={styles.goalLabel}>Daily goal</span>
              <span className={styles.goalValue}>
                {dailyXP} / {dailyGoal} XP
              </span>
            </div>
            <div
              className={styles.goalTrack}
              role="progressbar"
              aria-valuenow={dailyXP}
              aria-valuemax={dailyGoal}
            >
              <div
                className={styles.goalFill}
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Nudge if streak at risk */}
        {!isActive && streakDays > 0 && (
          <p className={styles.featuredNudge} role="status">
            Study today to keep your streak!
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        styles.widget,
        styles[size],
        !isActive && styles.inactive,
        className
      )}
      aria-label={`Current streak: ${streakDays} day${streakDays !== 1 ? 's' : ''}`}
    >
      {/* Flame icon */}
      <div
        className={clsx(
          styles.flameWrapper,
          isActive && streakDays > 0 && styles.flameActive
        )}
        aria-hidden="true"
      >
        <Fire weight="fill" className={styles.flame} aria-hidden="true" />
      </div>

      {/* Count + label */}
      <div className={styles.content}>
        <div className={styles.countRow}>
          <span className={styles.count}>{streakDays}</span>
          <span className={styles.unit}>
            {streakDays === 1 ? 'day' : 'days'}
          </span>
          {isRecord && (
            <span className={styles.recordBadge} aria-label="Personal record">
              <Trophy weight="fill" size="var(--icon-md)" aria-hidden="true" />
            </span>
          )}
        </div>

        <p className={styles.motivational}>{motivational}</p>

        {longestStreak != null && streakDays < longestStreak && (
          <p className={styles.record}>Best: {longestStreak} days</p>
        )}
      </div>

      {/* Inactive nudge */}
      {!isActive && streakDays > 0 && (
        <div className={styles.nudge} role="status">
          Study today to keep your streak!
        </div>
      )}
    </div>
  )
})

export default StreakWidget
export { StreakWidget }
