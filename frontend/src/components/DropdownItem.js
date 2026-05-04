import React from 'react'
import Icon from 'react-icons-kit'

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
    <button
      className="dropdown-item tw:w-full tw:text-left tw:px-4 tw:py-2 hover:tw:bg-gray-100"
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon icon={icon} className="icon mr-2 text-blue" />}
      <Text lighter tag="small" color={color}>
        {value}
      </Text>
    </button>
  )
}

DropdownItem.defaultProps = {
  color: 'gray'
}

export default React.memo(DropdownItem)
