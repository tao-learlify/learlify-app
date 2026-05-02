import React, { memo } from 'react'
import 'assets/css/listening.css'

/**
 * @type {React.FunctionComponent<React.HTMLAttributes<HTMLInputElement>>}
 */
const Radio = ({ children, ...props }) => {
  return (
    <label className="radio">
      <input type="radio" {...props} />
      <span className="input-font">{children}</span>
    </label>
  )
}

export default memo(Radio)
