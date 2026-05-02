import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './PageShell.module.scss'

/**
 * PageShell — Inner page wrapper.
 *
 * Provides consistent max-width, horizontal padding, and top spacing.
 * Wrap view content inside this after AppShell.
 *
 * @param {React.ReactNode} children             - Page content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} maxWidth  - Constrain content width
 * @param {string}          className             - Additional class names
 */
function PageShell({ children, maxWidth = 'xl', className }) {
  return (
    <div className={clsx(styles.page, styles[maxWidth], className)}>
      {children}
    </div>
  )
}

export default memo(PageShell)
export { PageShell }
