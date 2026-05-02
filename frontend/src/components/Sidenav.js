import React, { memo } from 'react'

import 'assets/css/Sidenav.css'


/**
 * @typedef {Object} SidenavProps
 * @property {boolean} isOpen
 */

/**
 * @type {React.FunctionComponent<SidenavProps>}
 */
const Sidenav = ({ children, isOpen }) => {

  return (
    <div
      className={isOpen ? 'sidenav' : 'sidenav hide-sidenav'}
    >
      {children}
    </div>
  )
}

export const Item = memo(
  /**
   * @param {{ children: React.ReactNode, onClick: () => void, onClick?: () => void, toggle?: boolean  }}
   */
  ({ children, onClick, toggle }) => {
    const toggleClassName = toggle
      ? 'sidenav-item  hovered icon border-0 p-1'
      : 'sidenav-item  hovered icon border-0 p-1'

    return (
      <div
        className={toggleClassName}
        onClick={onClick && onClick}
        aria-controls="collapse"
        aria-expanded={toggle}
      >
        {children}
      </div>
    )
  }
)

export const Main = memo(
  /**
   * @param {{ withSidenav?: boolean }} MainProps
   */
  ({ children, withSidenav }) => {
    return (
      <div className={withSidenav ? 'main' : 'main main-withoutSidenav'}>
        {children}
      </div>
    )
  }
)

export default memo(Sidenav)
