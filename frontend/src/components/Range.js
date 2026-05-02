import React, { memo } from 'react'
import clsx from 'clsx'
import 'assets/css/range.css'

/**
 * @type {React.FunctionComponent<React.InputHTMLAttributes<HTMLInputElement>>}
 */
const Range = props => {
  return (
    <input
      className={clsx('slider', props.className)}
      {...props}
    />
  )
}

Range.defaultProps = {
  type: 'range'
}

export default memo(Range)
