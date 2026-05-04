import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './Table.module.scss'

/**
 * Table — Clean data table with Duolingo styling.
 *
 * @param {boolean} striped — alternate row colours
 * @param {boolean} bordered — show outer border
 * @param {boolean} hover — highlight row on hover
 * @param {boolean} responsive — wrap in scroll container
 * @param {string} size — 'sm' for compact
 * @param {string} className
 * @param {React.ReactNode} children
 *
 * @example
 * <Table striped hover responsive>
 *   <thead><tr><th>Name</th><th>Score</th></tr></thead>
 *   <tbody><tr><td>Alice</td><td>95</td></tr></tbody>
 * </Table>
 */
const Table = memo(function Table({
  striped = false,
  bordered = false,
  hover = false,
  responsive = false,
  size,
  className,
  children,
  ...rest
}) {
  const table = (
    <table
      className={clsx(
        styles.table,
        striped && styles.striped,
        bordered && styles.bordered,
        hover && styles.hover,
        size === 'sm' && styles.sm,
        className
      )}
      {...rest}
    >
      {children}
    </table>
  )

  if (responsive) {
    return <div className={styles.responsive}>{table}</div>
  }

  return table
})

export default Table
export { Table }
