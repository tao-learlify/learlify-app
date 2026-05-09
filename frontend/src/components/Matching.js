import React, { memo, useMemo } from 'react'

/**
 * @typedef {Object} MatchingProps
 * @property {string} classNameInput
 * @property {string} name
 * @property {string} onChange
 * @property {string} value
 * @property {number} length
 */

/**
 * @type {React.FunctionComponent<MatchingProps>} 
 */
const Matching = ({ classNameInput, name, onChange, value, length }) => {
  const maxInputExceed = useMemo(() => {
    return value.split(' ').length > length
  }, [length, value])

  return (
    <React.Fragment>
      <input
        className={`${classNameInput} form-control tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:p-2 focus:tw:border-[#58CC02] focus:tw:ring-1 focus:tw:ring-[#58CC02]${maxInputExceed ? ' is-invalid' : ''}`}
        name={name}
        onChange={onChange}
        value={value}
      />
    </React.Fragment>
  )
}

Matching.defaultProps = {
  classNameInput: '',
  onChange: () => null,
  length: 3,
}

export default memo(Matching)
