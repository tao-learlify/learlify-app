import React, { memo } from 'react'
import clsx from 'clsx'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import styles from './StatCard.module.scss'

/**
 * StatCard — Compact metric display card.
 *
 * Designed for dashboard stat grids: scores, counts, percentages, durations.
 *
 * @param {string|number}          metric     - Primary value displayed large
 * @param {string}                 label      - Descriptive label below the metric
 * @param {string}                 [sublabel] - Optional secondary line (e.g. "vs last week")
 * @param {{ value: number|string, direction: 'up'|'down'|'neutral' }} [trend]
 *                                            - Trend indicator. direction determines color/arrow.
 * @param {React.ReactNode}        [icon]     - Optional icon (emoji, SVG, img)
 * @param {'default'|'accent'|'success'|'warning'|'danger'} [variant]
 *                                            - Accent color applied to metric text
 * @param {boolean}                [elevated] - Stronger shadow
 * @param {function}               [onClick]  - Makes card interactive
 * @param {string}                 [className]
 *
 * @example
 * // Score
 * <StatCard metric="8.5" label="Overall Score" variant="success" trend={{ value: '+0.5', direction: 'up' }} />
 *
 * // Count
 * <StatCard metric={42} label="Lessons completed" icon="📚" />
 *
 * // Duration
 * <StatCard metric="3h 20m" label="Study time this week" sublabel="Goal: 5h" variant="accent" />
 */
const StatCard = memo(function StatCard({
  metric,
  label,
  sublabel,
  trend,
  icon,
  variant = 'default',
  elevated = false,
  onClick,
  className,
}) {
  const isInteractive = !!onClick
  const trendUp   = trend?.direction === 'up'
  const trendDown = trend?.direction === 'down'

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? (e) => e.key === 'Enter' && onClick?.(e) : undefined}
      className={clsx(
        styles.card,
        styles[variant],
        elevated && styles.elevated,
        isInteractive && styles.interactive,
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className={styles.iconSlot} aria-hidden="true">
          {icon}
        </div>
      )}

      {/* Metric */}
      <div className={styles.metricRow}>
        <span className={styles.metric}>{metric}</span>

        {trend != null && (
          <span
            className={clsx(
              styles.trend,
              trendUp   && styles.trendUp,
              trendDown && styles.trendDown
            )}
            aria-label={
              trendUp   ? `Increased by ${trend.value}` :
              trendDown ? `Decreased by ${trend.value}` :
                          `No change`
            }
          >
            {trendUp   && <TrendUp  weight="fill" size="var(--icon-sm)" aria-hidden="true" />}
            {trendDown && <TrendDown weight="fill" size="var(--icon-sm)" aria-hidden="true" />}
            {!trendUp && !trendDown && <Minus weight="bold" size="var(--icon-sm)" aria-hidden="true" />}
            {trend.value}
          </span>
        )}
      </div>

      {/* Labels */}
      <p className={styles.label}>{label}</p>
      {sublabel && <p className={styles.sublabel}>{sublabel}</p>}
    </div>
  )
})

StatCard.defaultProps = {
  variant:  'default',
  elevated: false,
}

export default StatCard
export { StatCard }
