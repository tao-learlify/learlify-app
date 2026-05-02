import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './AuthShell.module.scss'

/**
 * AuthShell — Full-page layout shell for all authentication screens.
 *
 * Provides:
 * - Centered vertical + horizontal layout
 * - Soft page background (--color-bg-page)
 * - Optional full-page loading overlay (while auth state resolves)
 * - Semantic <main> wrapper
 *
 * Used by: Login, SignUp, ResetPassword, MagicLink, etc.
 *
 * @param {React.ReactNode} children
 * @param {boolean}         [loading=false] - Shows a loading overlay (replaces Template withLoader)
 * @param {string}          [className]
 *
 * @example
 * <AuthShell loading={user.loading}>
 *   <AuthCard>...</AuthCard>
 * </AuthShell>
 */
const AuthShell = memo(function AuthShell({ children, loading = false, className }) {
  return (
    <div className={clsx(styles.shell, className)}>
      {loading && (
        <div
          className={styles.loadingOverlay}
          aria-live="polite"
          aria-label="Loading…"
        >
          <div className={styles.spinner} role="status" aria-hidden="true" />
        </div>
      )}

      <main className={styles.main} id="main-content">
        {children}
      </main>
    </div>
  )
})

export default AuthShell
export { AuthShell }
