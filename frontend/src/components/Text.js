import React, { memo } from 'react'
import clsx from 'clsx'

/**
 * @typedef {Object} TextProps
 * @property {boolean} dunkin
 * @property {boolean} bold
 * @property {boolean} left
 * @property {boolean} lighter
 * @property {boolean} center
 * @property {boolean} right
 * @property {string} className
 * @property {TextColor} color
 * @property {string} href
 * @property {boolean} hovered
 * @property {() => void?} onClick
 * @property {TextTag} tag
 * @property {boolean?} shadow?
 * */

/**
 * @type {React.FunctionComponent<TextProps>}
 */
const Text = ({
  ref,
  dunkin,
  bold,
  center,
  children,
  className,
  color,
  hovered,
  href,
  lighter,
  left,
  onClick,
  right,
  shadow,
  tag
}) => {
  const classNames = clsx(
    lighter && 'monserrat-light',
    dunkin && 'dunkin',
    left && 'text-left',
    right && 'text-right',
    center && 'text-center',
    bold && 'font-weight-bold',
    color && `text-${color}`,
    className && className,
    hovered && 'hovered',
    shadow && 'text-shadow'
  )

  return React.createElement(tag, {
    ref,
    className: classNames,
    onClick: onClick && onClick,
    href: href,
  }, children)
}

Text.defaultProps = {
  bold: false,
  tag: 'h5',
  hovered: false,
  onClick: null
}

export default memo(Text)
