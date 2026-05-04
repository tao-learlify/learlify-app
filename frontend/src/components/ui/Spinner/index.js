import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './Spinner.module.scss'

/**
 * Spinner — Loading indicator in Duolingo green.
 *
 * @param {'sm'|'md'|'lg'} size
 * @param {string} className
 *
 * @example
 * <Spinner size="md" />
 * <Button disabled><Spinner size="sm" /> Loading...</Button>
 */
const Spinner = memo(function Spinner({ size = 'md', className, ...rest }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(styles.spinner, styles[size], className)}
      {...rest}
    />
  )
})

export default Spinner
export { Spinner }
