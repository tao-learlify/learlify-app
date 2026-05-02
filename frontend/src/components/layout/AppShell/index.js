import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './AppShell.module.scss'

/**
 * AppShell — Top-level page chrome.
 *
 * Provides the sidebar + main content layout split.
 * Replaces the Template + Sidenav combination as views migrate to the new DS.
 *
 * @param {React.ReactNode} sidebar   - Sidebar content (SidebarNav etc.)
 * @param {React.ReactNode} children  - Main page content
 * @param {boolean}         hasSidebar - Whether to show the sidebar
 * @param {string}          className  - Additional class names
 */
function AppShell({ sidebar, children, hasSidebar = true, className }) {
  return (
    <div className={clsx(styles.shell, className)}>
      {hasSidebar && (
        <aside
          className={clsx(styles.sidebar, !hasSidebar && styles.sidebarCollapsed)}
          aria-label="Sidebar navigation"
        >
          {sidebar}
        </aside>
      )}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}

export default memo(AppShell)
export { AppShell }
