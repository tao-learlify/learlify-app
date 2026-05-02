import React, { useEffect } from 'react'

/**
 * @typedef {Object} WindowAPIProps
 * @property {() => void} callback
 * 
 * @type {React.FunctionComponent<WindowAPIProps>}
 */
const Callback = ({ fn }) => {
  useEffect(fn, [])

  return (
    <React.Fragment />
  )
}

export default Callback