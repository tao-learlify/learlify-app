import React, { memo, useState, useCallback, useId } from 'react'
import clsx from 'clsx'
import { CaretDown } from '@phosphor-icons/react'
import styles from './Accordion.module.scss'

/**
 * Accordion — Expandable content sections.
 *
 * @param {string} className
 * @param {React.ReactNode} children — AccordionItem elements
 *
 * @example
 * <Accordion>
 *   <Accordion.Item eventKey="0" title="Section 1">
 *     <p>Content for section 1</p>
 *   </Accordion.Item>
 * </Accordion>
 */
const Accordion = memo(function Accordion({
  className,
  children,
  defaultActiveKey,
  ...rest
}) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || null)

  const context = { activeKey, setActiveKey }

  return (
    <div className={clsx(styles.accordion, className)} {...rest}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, { _context: context })
      })}
    </div>
  )
})

function AccordionItem({
  eventKey,
  title,
  _context,
  className,
  children,
  ...rest
}) {
  const id = useId()
  const isOpen = _context?.activeKey === eventKey

  const toggle = useCallback(() => {
    _context?.setActiveKey((prev) => (prev === eventKey ? null : eventKey))
  }, [_context, eventKey])

  return (
    <div className={clsx(styles.item, isOpen && styles.open, className)} {...rest}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
      >
        <span className={styles.triggerText}>{title}</span>
        <CaretDown
          size={18}
          weight="bold"
          className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        className={clsx(styles.panel, isOpen && styles.panelOpen)}
        hidden={!isOpen}
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  )
}

Accordion.Item = AccordionItem

export default Accordion
export { Accordion }
