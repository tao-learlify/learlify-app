import React from 'react'

/**
 * @typedef {Object} AnimateProps
 * @property {string} type
 * @property {React.ReactNode} children
 */

/**
 *  @see https://daneden.github.io/animate.css/
 *  @description
 *  @param {AnimateProps} props
 *  */
const Animate = ({ type, children }) => (
  <div className={`animated ${type}`}>{children}</div>
)

Animate.defaultProps = {
  type: 'fadeIn'
}

export default React.memo(Animate)
