import React, { memo } from 'react'
import styled from 'styled-components'

const SelectContainer = styled.select`
  border-radius: 5px;
`

const Select = ({ disabled, className, onPick, options, optionKeyName, value }) => {
  const classNames = 'select-css '.concat(className)

  return (
    <SelectContainer disabled={disabled} className={classNames} onChange={onPick} value={value.trim()}>
      {options.map((option, index) => (
        <option
          className={
            option[optionKeyName].trim() === value.trim() ? 'text-primary' : 'text-muted'
          }
          key={index}
          disabled={option[optionKeyName].trim() === value.trim()}
        >
          {option[optionKeyName]}
        </option>
      ))}
    </SelectContainer>
  )
}

Select.defaultProps = {
  className: '',
  options: []
}

export default memo(Select)
