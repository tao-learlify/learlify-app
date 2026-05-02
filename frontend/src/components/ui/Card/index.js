import React, { memo } from 'react'
import clsx from 'clsx'
import styles from './Card.module.scss'

const PADDING_MAP = {
  none: styles.padNone,
  sm:   styles.padSm,
  md:   styles.padMd,
  lg:   styles.padLg,
}

/**
 * Card — Unified surface container.
 *
 * Replaces:
 * - AptisCard.js (Bootstrap Card + global CSS classes)
 * - StyledCard (styled-components, width 250px hardcoded)
 * - Bootstrap <Card> used ad-hoc across views
 *
 * @param {boolean}               elevated      - Stronger shadow (shadow-2)
 * @param {boolean}               outlined      - Border instead of shadow
 * @param {boolean}               interactive   - Hover lift effect + cursor pointer
 * @param {boolean}               chunky        - Duolingo-style offset shadow (neutral)
 * @param {boolean}               chunkyPrimary - Duolingo-style offset shadow (brand color)
 * @param {'none'|'sm'|'md'|'lg'} padding       - Internal padding (default: none — use slots)
 * @param {function}              onClick       - Required when interactive=true
 * @param {string}                className
 * @param {React.ReactNode}       children
 *
 * @example
 * // With slots:
 * <Card elevated>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer><Button>Action</Button></Card.Footer>
 * </Card>
 *
 * // Chunky Duolingo-style:
 * <Card chunky interactive onClick={fn}><p>Press me</p></Card>
 */
const Card = memo(function Card({
  elevated = false,
  outlined = false,
  interactive = false,
  chunky = false,
  chunkyPrimary = false,
  padding,
  onClick,
  className,
  children,
  ...rest
}) {
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick?.(e) : undefined}
      className={clsx(
        styles.card,
        elevated && styles.elevated,
        outlined && styles.outlined,
        interactive && styles.interactive,
        chunky && styles.chunky,
        chunkyPrimary && styles.chunkyPrimary,
        padding && PADDING_MAP[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

function CardHeader({ children, className }) {
  return <div className={clsx(styles.header, className)}>{children}</div>
}

function CardBody({ children, className }) {
  return <div className={clsx(styles.body, className)}>{children}</div>
}

function CardFooter({ children, className }) {
  return <div className={clsx(styles.footer, className)}>{children}</div>
}

Card.Header = CardHeader
Card.Body   = CardBody
Card.Footer = CardFooter

export default Card
export { Card, CardHeader, CardBody, CardFooter }
