import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './Section.module.scss'

/**
 * Section — Consistent vertical rhythm container for page sections.
 *
 * @param {React.ReactNode}   children  - Section content
 * @param {'sm'|'md'|'lg'}    spacing   - Vertical spacing below section
 * @param {string}            className - Additional class names
 */
function Section({ children, spacing = 'md', className }) {
  return (
    <section className={clsx(styles.section, styles[spacing], className)}>
      {children}
    </section>
  )
}

/**
 * SectionHeader — Title + optional subtitle + optional right-side action.
 *
 * @param {string}          title     - Section title
 * @param {string}          subtitle  - Optional supporting text
 * @param {React.ReactNode} action    - Optional right-side content (button, link)
 * @param {string}          className - Additional class names
 */
function SectionHeader({ title, subtitle, action, className }) {
  return (
    <div className={clsx(styles.header, className)}>
      <div className={styles.headerText}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}

Section.Header = SectionHeader

export default Section
export { Section, SectionHeader }
