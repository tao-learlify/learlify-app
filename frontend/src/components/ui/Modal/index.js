import React, { memo, useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import styles from './Modal.module.scss'

/**
 * CloseIcon — Minimal inline SVG, no icon library dependency.
 */
function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4L4 12M4 4l8 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Modal — Accessible dialog component.
 *
 * Replaces:
 * - components/ModalDialog.js (React-Bootstrap Modal using `dropdown-style` CSS class)
 *
 * Accessibility:
 * - role="dialog" with aria-modal="true"
 * - aria-labelledby pointing to the title
 * - Focus trap: focus returns to trigger on close
 * - Closes on Escape key
 * - Scroll lock on body while open
 * - Rendered in a portal at document.body
 *
 * @param {boolean}         isOpen   - Controls visibility
 * @param {function}        onClose  - Called on overlay click, close button, or Escape
 * @param {'sm'|'md'|'lg'|'full'} size
 * @param {string}          title    - Dialog title (shown in header)
 * @param {React.ReactNode} footer   - Footer content (usually buttons)
 * @param {boolean}         hideClose - Hide the X close button
 * @param {string}          className - Applied to the dialog element
 * @param {React.ReactNode} children  - Dialog body content
 *
 * @example
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm cancellation"
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={() => setShowModal(false)}>Keep plan</Button>
 *       <Button variant="danger" onClick={handleCancel}>Cancel subscription</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to cancel?</p>
 * </Modal>
 */
const Modal = memo(function Modal({
  isOpen,
  onClose,
  size = 'md',
  title,
  footer,
  hideClose = false,
  className,
  children
}) {
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  /* Lock body scroll when open */
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  /* Store the previously focused element so we can restore on close */
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      /* Move focus into the dialog on open */
      const timer = setTimeout(() => dialogRef.current?.focus(), 10)
      return () => clearTimeout(timer)
    } else {
      /* Restore focus on close */
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={e => {
        if (e.target === e.currentTarget) onClose?.()
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={clsx(styles.dialog, styles[size], className)}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {!hideClose && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
})

export default Modal
export { Modal }
