import React from 'react'

/**
 * @typedef {Object} HoverProps
 * @property {React.Node []} children
 * @property {() => void} onClick
 */

/**
 * @type {React.FunctionComponent<HoverProps>}
 */
const Hover = ({ onClick, children }) => (
  <div className='hovered' onClick={onClick}>
    {children}
  </div>
)

Hover.defaultProps = {
  onClick: null
}


export default Hover