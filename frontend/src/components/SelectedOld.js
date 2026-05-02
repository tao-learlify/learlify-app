import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmptyString } from 'utils/functions'

const SelectContainer = styled.select`
  border-radius: 5px;
`

const Select = ({
  keyName,
  options,
  onChange,
  value,
  className,
  dissabledOn
}) => {

  const disasbled = useCallback(answer =>  {
    const titles = dissabledOn.reduce((previous, next) => {
      return previous.concat(next[keyName])
    }, [])

    const index = titles.findIndex(
      value => value === answer && !isEmptyString(value)
    )

    return titles[index] === answer
  }, [dissabledOn, keyName])

  return (
    <SelectContainer
      onChange={onChange ? onChange : null}
      className={`${className} select-css`}
      value={value}
    >
      {options.map(option => (
        <option
          key={option.id}
          value={option[keyName]}
          className={
            disasbled(option[keyName]) ? 'text-danger' : 'text-muted'
          }
          disabled={disasbled(option[keyName])}
        >
          {option[keyName]}
        </option>
      ))}
    </SelectContainer>
  )
}

Select.defaultProps = {
  className: 'text-muted'
}

Select.propTypes = {
  keyName: PropTypes.string.isRequired,
  options: PropTypes.array,
  onChange: PropTypes.func
}

export default React.memo(Select)