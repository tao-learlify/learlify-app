import React, { memo, useMemo } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

/**
 * @typedef {Object} OverlayMessageProps
 * @property {string} message
 */

/**
 * @type {React.FunctionComponent<OverlayMessageProps>}
 */
const OverlayMessage = ({ children, message }) => {
  const content = useMemo(() => {
    return (
      <Tooltip id="overlay-message">
        {message}
      </Tooltip>
    )
  }, [message])

  return (
    <OverlayTrigger overlay={content}>
      {children}
    </OverlayTrigger>
  )
}


export default memo(OverlayMessage)