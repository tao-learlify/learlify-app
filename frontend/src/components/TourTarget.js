import React from 'react'

/**
 * @typedef {Object} TourTargetProps
 * @property {string} tour
 * @property {React.Node} children
 */

/**
 * @type {React.FunctionComponent<TourTargetProps>} 
 */
const TourTarget = ({ tour, ignore, children }) => {
  return ignore ? children : <div tour={tour}>{children}</div>
}

export default TourTarget