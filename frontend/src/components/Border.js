import React from 'react'

/**
 * @type {React.FunctionComponent<React.AnchorHTMLAttributes<HTMLDivElement>>} 
 */
const Border = ({ children, ...props }) => (
  <div className='border-style' {...props}>
    {children}
  </div>
)

export default React.memo(Border)