import React, { memo, useMemo } from 'react'
import { Form } from 'react-bootstrap'


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
      <Form.Control
        className={classNameInput} 
        name={name}
        onChange={onChange}
        value={value}
        isInvalid={maxInputExceed}
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