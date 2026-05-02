import React from 'react'
import Dropdown from 'components/Dropdown'
import DropdownItem from 'components/DropdownItem'

/**
 * @typedef {Object} Option
 * @property {string} eventKey
 * @property {string} name
 * @property {React.Component} icon
 */

/**
 * @typedef {Object} OptionsProps
 * @property {Option []} data
 * @property {() => { emit?: string }} onClick
 */

/**
 * @type {React.FunctionComponent<OptionsProps>}
 */
const Options = ({ data, onClick }) => {
  return (
    <Dropdown name="Opción">
      {data.map(option => (
        <DropdownItem
          key={option.eventKey}
          icon={option.icon}
          value={option.name}
          onClick={() => onClick({ option: option.eventKey })}
        />
      ))}
    </Dropdown>
  )
}

Options.defaultProps = {
  data: [],
  onClick: () => ({ emit: null })
}

export default React.memo(Options)
