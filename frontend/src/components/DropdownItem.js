import React from 'react'
import Icon from 'react-icons-kit'
import { Dropdown } from 'react-bootstrap'

import Text from './Text'

/**
 * @typedef {Object} DropdownItemProps
 * @property {boolean} disabled
 * @property {TextColor} color
 * @property {React.Component} icon
 * @property {() => void} onClick
 * @property {string} value
 */

/** 
 * @type {React.FunctionComponent<DropdownItemProps>} 
 */
const DropdownItem = ({ disabled, icon, onClick, value, color }) => {
  return (
    <Dropdown.Item disabled={disabled} onClick={onClick}>
      {icon && <Icon icon={icon} className="icon mr-2 text-blue" />}
      <Text lighter tag="small" color={color}>
        {value}
      </Text>
    </Dropdown.Item>
  )
}

Dropdown.defaultProps = {
  color: 'gray'
}

export default React.memo(DropdownItem)
