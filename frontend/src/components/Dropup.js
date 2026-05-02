import React, { memo } from 'react'
import { Dropdown as DropdownButton } from 'react-bootstrap'

const space = '\xa0'.repeat(20)

const Dropdown = ({ children, className, disabled, id, name }) => {
  return (
    <DropdownButton alignRight drop="up">
      <DropdownButton.Toggle
        disabled={disabled}
        size="sm"
        id={id}
        drop="left"
        className={className}
      >
        <small>{name === '' ? space : name}</small>
      </DropdownButton.Toggle>
      <DropdownButton.Menu className="scrollbar">
        {children}
      </DropdownButton.Menu>
    </DropdownButton>
  )
}

Dropdown.defaultProps = {
  className: 'btn-secondary text-light'
}

export default memo(Dropdown)
