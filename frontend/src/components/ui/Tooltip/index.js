import React, { memo, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import styles from './Tooltip.module.scss'

/**
 * Tooltip — Simple hover tooltip.
 *
 * Auto-positions (top by default).
 *
 * @param {string} text — tooltip content
 * @param {'top'|'bottom'|'left'|'right'} placement
 * @param {string} className
 * @param {React.ReactNode} children — trigger element
 *
 * @example
 * <Tooltip text="Delete this item" placement="top">
 *   <button>×</button>
 * </Tooltip>
 */
const Tooltip = memo(function Tooltip({
  text,
  placement = 'top',
  className,
  children,
  ...rest
}) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const showTimer = useRef(null)
  const hideTimer = useRef(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipW = 200
    const offset = 8
    let top, left

    switch (placement) {
      case 'bottom':
        top = rect.bottom + offset
        left = rect.left + rect.width / 2 - tooltipW / 2
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - tooltipW - offset
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + offset
        break
      default: // top
        top = rect.top - offset
        left = rect.left + rect.width / 2 - tooltipW / 2
        break
    }

    setPos({ top, left })
  }, [placement])

  const show = useCallback(() => {
    clearTimeout(hideTimer.current)
    showTimer.current = setTimeout(() => {
      updatePosition()
      setVisible(true)
    }, 300)
  }, [updatePosition])

  const hide = useCallback(() => {
    clearTimeout(showTimer.current)
    hideTimer.current = setTimeout(() => {
      setVisible(false)
    }, 100)
  }, [])

  if (!children) return null

  const trigger = React.Children.only(children)
  const cloned = React.cloneElement(trigger, {
    ref: (el) => {
      triggerRef.current = el
      if (trigger.ref) {
        if (typeof trigger.ref === 'function') trigger.ref(el)
        else trigger.ref.current = el
      }
    },
    onMouseEnter: (e) => {
      trigger.props.onMouseEnter?.(e)
      show()
    },
    onMouseLeave: (e) => {
      trigger.props.onMouseLeave?.(e)
      hide()
    },
    onFocus: (e) => {
      trigger.props.onFocus?.(e)
      show()
    },
    onBlur: (e) => {
      trigger.props.onBlur?.(e)
      hide()
    },
    'aria-describedby': visible ? 'tooltip-portal' : undefined,
  })

  return (
    <>
      {cloned}
      {visible &&
        createPortal(
          <div
            id="tooltip-portal"
            role="tooltip"
            className={clsx(styles.tooltip, styles[placement], className)}
            style={{
              position: 'fixed',
              top: `${pos.top}px`,
              left: `${pos.left}px`,
            }}
            onMouseEnter={show}
            onMouseLeave={hide}
            {...rest}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  )
})

export default Tooltip
export { Tooltip }
