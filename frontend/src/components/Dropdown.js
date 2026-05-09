import React, { memo, useState } from 'react'
import clsx from 'clsx'
import { Dropdown as DropdownUI } from 'components/ui'

const space = '\xa0'.repeat(20)

/**
 * @typedef {Object} DropdownProps
 * @property {string} className
 * @property {boolean} disabled
 * @property {string} id
 * @property {string} name
 */

/**
 * @type {React.FunctionComponent<DropdownProps>}
 */
const Dropdown = ({ children, className, disabled, id, name }) => {
  const [open, setOpen] = useState(false)
  const displayName = name === '' ? space : name

  return (
    <DropdownUI
      title={<small>{displayName}</small>}
      className={className}
    >
      {children}
    </DropdownUI>
  )
}

Dropdown.defaultProps = {
  className: 'btn btn-light border dropdown-style d-inline'
}

export default memo(Dropdown)
