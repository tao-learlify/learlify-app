import React, { memo } from 'react'
import clsx from 'clsx'

const Select = ({ disabled, className, onPick, options, optionKeyName = 'name', value = '' }) => {
  return (
    <select
      disabled={disabled}
      className={clsx('select-css tw:rounded-[5px]', className)}
      onChange={onPick}
      value={value?.trim?.() ?? value}
    >
      {options.map((option, index) => (
        <option
          className={option[optionKeyName]?.trim?.() === value?.trim?.() ? 'text-primary' : 'text-muted'}
          key={index}
          disabled={option[optionKeyName]?.trim?.() === value?.trim?.()}
        >
          {option[optionKeyName]}
        </option>
      ))}
    </select>
  )
}

Select.defaultProps = {
  className: '',
  options: []
}

export default memo(Select)
