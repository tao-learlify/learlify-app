import React from 'react'


/**
 * @type {React.FunctionComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>>} 
 */
const LinkThrough = (props) => (
  <a {...props} target="_blank" rel="noopener noreferrer">
    {props.children}
  </a>
)

export default LinkThrough