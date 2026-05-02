import React, { memo } from 'react'

/**
 * @typedef {Object} DisplayProps
 * @property {boolean} render
 * @property {boolean} asCourseContent 
 */

/**
 * @type {React.FunctionComponent<DisplayProps>}
 */
const Display = (props) => <div className={props.render ? props.asCourseContent ? "mt-1" : "mt-4" : "mt-0"}>{props.children}</div>

Display.defaultProps ={
  render: true
}

export default memo(Display)