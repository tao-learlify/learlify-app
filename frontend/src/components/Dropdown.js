import React, { memo } from 'react'
import { Dropdown as DropdownButton } from 'react-bootstrap'

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
  return (
    <DropdownButton alignRight>
      <DropdownButton.Toggle
        disabled={disabled}
        size="sm"
        id={id}
        drop="left"
        className={className}
      >
        <small>{name === '' ? space : name}</small>
      </DropdownButton.Toggle>
      <DropdownButton.Menu>{children}</DropdownButton.Menu>
    </DropdownButton>
  )
}

Dropdown.defaultProps = {
  className: 'btn btn-light border dropdown-style d-inline'
}

export default memo(Dropdown)
