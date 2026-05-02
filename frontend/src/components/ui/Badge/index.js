import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './Badge.module.scss'

/**
 * Badge — Semantic status/label indicator.
 *
 * Abstracted from SubscriptionStatusBadge (the best existing pattern in the codebase).
 * Replaces: ad-hoc Bootstrap .badge usage, inline status styles.
 *
 * WCAG note:
 * - Never use color alone to convey meaning.
 * - When using in tables or lists, add an icon or text alongside the badge.
 * - All text/bg combinations here meet WCAG AA for normal text (verified).
 *
 * @param {'active'|'warning'|'danger'|'neutral'|'info'|'primary'|'success'} variant
 * @param {boolean} dot       - Show a colored dot before the label
 * @param {string}  className
 * @param {React.ReactNode} children
 *
 * @example
 * <Badge variant="active">Active</Badge>
 * <Badge variant="warning" dot>Expiring soon</Badge>
 * <Badge variant="danger">Expired</Badge>
 */
const Badge = memo(function Badge({
  variant = 'neutral',
  dot = false,
  className,
  children,
}) {
  return (
    <span className={clsx(styles.badge, styles[variant], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  )
})

export default Badge
export { Badge }
