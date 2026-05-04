import React, { memo, useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { CaretDown } from '@phosphor-icons/react'
import styles from './Dropdown.module.scss'

/**
 * Dropdown — Dropdown menu, Duolingo style.
 *
 * @param {string} title — trigger text
 * @param {string} className
 * @param {string} menuClassName
 * @param {'start'|'end'} align — menu alignment
 * @param {React.ReactNode} children — DropdownItem elements
 *
 * @example
 * <Dropdown title="Options">
 *   <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
 *   <Dropdown.Item onClick={handleDelete} variant="danger">Delete</Dropdown.Item>
 * </Dropdown>
 */
const Dropdown = memo(function Dropdown({
  title,
  className,
  menuClassName,
  align = 'start',
  children,
  trigger,
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 4,
      left: align === 'end' ? rect.right : rect.left,
    })
  }, [align])

  const toggle = useCallback(() => {
    if (!open) updatePosition()
    setOpen((prev) => !prev)
  }, [open, updatePosition])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // Scroll lock
  useEffect(() => {
    if (!open) return
    function handleScroll() {
      updatePosition()
    }
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [open, updatePosition])

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger, {
          ref: (el) => {
            triggerRef.current = el
          },
          onClick: (e) => {
            trigger.props.onClick?.(e)
            toggle()
          },
          'aria-expanded': open,
          'aria-haspopup': 'menu',
        })
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={clsx(styles.trigger, className)}
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
          {...rest}
        >
          <span>{title}</span>
          <CaretDown
            size={14}
            weight="bold"
            className={clsx(styles.chevron, open && styles.chevronOpen)}
          />
        </button>
      )}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={clsx(styles.menu, menuClassName)}
            style={{
              position: 'fixed',
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              minWidth: triggerRef.current
                ? `${triggerRef.current.offsetWidth}px`
                : undefined,
            }}
            onClick={() => setOpen(false)}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  )
})

function DropdownItem({ onClick, variant, className, children, ...rest }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={clsx(
        styles.item,
        variant === 'danger' && styles.danger,
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}

Dropdown.Item = DropdownItem

export default Dropdown
export { Dropdown }
