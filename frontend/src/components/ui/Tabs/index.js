import React, { memo, useState, useCallback } from 'react'
import clsx from 'clsx'
import styles from './Tabs.module.scss'

/**
 * Tabs — Tab switcher with Duolingo-style green underline.
 *
 * @param {string} defaultActiveKey — key of initially active tab
 * @param {string} activeKey — controlled active key
 * @param {function} onSelect — called with eventKey when tab changes
 * @param {string} className
 * @param {React.ReactNode} children — Tab elements
 *
 * @example
 * <Tabs defaultActiveKey="tab1" onSelect={(k) => console.log(k)}>
 *   <Tab eventKey="tab1" title="First Tab"><Content /></Tab>
 *   <Tab eventKey="tab2" title="Second Tab"><Content /></Tab>
 * </Tabs>
 */
const Tabs = memo(function Tabs({
  defaultActiveKey,
  activeKey: controlledKey,
  onSelect,
  className,
  children,
  ...rest
}) {
  const [internalKey, setInternalKey] = useState(defaultActiveKey || null)
  const activeKey = controlledKey !== undefined ? controlledKey : internalKey

  const handleSelect = useCallback(
    (key) => {
      if (controlledKey === undefined) setInternalKey(key)
      onSelect?.(key)
    },
    [controlledKey, onSelect]
  )

  const tabs = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      tabs.push(child)
    }
  })

  const activeTab = tabs.find((t) => t.props.eventKey === activeKey)

  return (
    <div className={clsx(styles.tabs, className)} {...rest}>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.props.eventKey === activeKey
          return (
            <button
              key={tab.props.eventKey}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={clsx(styles.tab, isActive && styles.tabActive)}
              onClick={() => handleSelect(tab.props.eventKey)}
            >
              {tab.props.title}
            </button>
          )
        })}
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        {activeTab?.props?.children}
      </div>
    </div>
  )
})

function Tab({ children }) {
  return children
}

Tabs.Tab = Tab

export default Tabs
export { Tabs }
