import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './Progress.module.scss'

/**
 * Progress — Accessible progress bar for learning metrics.
 *
 * New component (no equivalent in the current codebase).
 * Designed for: course completion, lesson progress, streak milestones, quiz scores.
 *
 * Accessibility:
 * - Uses native <progress> semantics via role="progressbar"
 * - aria-valuenow/min/max always present
 * - aria-label or aria-labelledby required (use the label prop)
 *
 * @param {number}                              value    - 0 to 100
 * @param {'default'|'success'|'warning'|'accent'} variant
 * @param {'sm'|'md'|'lg'}                      size
 * @param {boolean}                             animated - Shimmer animation
 * @param {string}                              label    - Accessible label + shown above bar
 * @param {boolean}                             showValue - Show percentage value
 * @param {string}                              className
 *
 * @example
 * <Progress value={65} label="Course progress" showValue />
 * <Progress value={100} variant="success" size="sm" label="Completed" />
 * <Progress value={30} variant="warning" animated label="Loading..." />
 */
const Progress = memo(function Progress({
  value = 0,
  variant = 'default',
  size = 'md',
  animated = false,
  label,
  showValue = false,
  className,
}) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className={clsx(
        styles.wrapper,
        styles[size],
        styles[variant],
        animated && styles.animated,
        className
      )}
    >
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.labelText}>{label}</span>}
          {showValue && (
            <span className={styles.valueText} aria-hidden="true">
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={styles.fill}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
})

export default Progress
export { Progress }
