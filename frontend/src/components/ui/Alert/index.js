import React, { memo, useState } from 'react'
import clsx from 'clsx'
import { CheckCircle, Warning, Info, XCircle, X } from '@phosphor-icons/react'
import styles from './Alert.module.scss'

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: Warning,
  info: Info,
}

/**
 * Alert — Semantic notification banner.
 *
 * @param {'success'|'error'|'warning'|'info'} variant
 * @param {boolean} dismissible - Show close button
 * @param {function} onDismiss - Called when dismissed
 * @param {string} title - Optional alert title
 * @param {string} className
 * @param {React.ReactNode} children
 */
const Alert = memo(function Alert({
  variant = 'info',
  dismissible = false,
  onDismiss,
  title,
  className,
  children,
  ...rest
}) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const Icon = ICON_MAP[variant] || Info

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      role="alert"
      className={clsx(styles.alert, styles[variant], className)}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={20} weight="fill" />
      </span>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X size={16} weight="bold" />
        </button>
      )}
    </div>
  )
})

export default Alert
export { Alert }
