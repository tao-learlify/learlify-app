import React from 'react'
import 'assets/css/ping.css'

/**
 * @typedef {Object} PingIndicatorProps
 * @property {React.Node} children
 */

/**
 * @type {React.FunctionComponent<PingIndicatorProps>}
 */
const PingIndicator = props => (
  <div className='ping'>
    {props.children}
  </div>
)

export default PingIndicator
