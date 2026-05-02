import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './IconBox.module.scss'

/**
 * IconBox — Rounded container for Phosphor icons.
 *
 * Wraps any Phosphor icon (or any ReactNode) in a soft-background
 * rounded container. Matches the Duolingo-style icon treatment.
 *
 * @param {'primary'|'accent'|'amber'|'teal'|'progress'|'muted'} [color] - Background palette
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} [size]
 * @param {'md'|'lg'|'xl'|'2xl'|'full'} [radius]  - 'full' = circle
 * @param {React.ReactNode} children               - The icon
 * @param {string} [className]
 *
 * @example
 * import { House } from '@phosphor-icons/react'
 * <IconBox color="primary" size="md"><House weight="fill" /></IconBox>
 */
const IconBox = memo(function IconBox({
  color = 'muted',
  size = 'md',
  radius = 'lg',
  className,
  children,
}) {
  return (
    <div
      className={clsx(
        styles.box,
        styles[`color-${color}`],
        styles[`size-${size}`],
        styles[`radius-${radius}`],
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  )
})

export default IconBox
export { IconBox }
