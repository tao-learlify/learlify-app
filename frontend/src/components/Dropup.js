import React, { memo } from 'react'
import { Dropdown } from 'components/ui'

const space = '\xa0'.repeat(20)

const Dropup = ({ children, className, disabled, id, name }) => {
  return (
    <Dropdown
      title={name === '' ? space : name}
      className={`dropup ${className}`}
      align="start"
    >
      {children}
    </Dropdown>
  )
}

Dropup.defaultProps = {
  className: 'btn-secondary text-light'
}

export default memo(Dropup)
