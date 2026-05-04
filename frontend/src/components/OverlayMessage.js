import React, { memo } from 'react'
import { Tooltip } from 'components/ui'

/**
 * @typedef {Object} OverlayMessageProps
 * @property {string} message
 */

/**
 * @type {React.FunctionComponent<OverlayMessageProps>}
 */
const OverlayMessage = ({ children, message }) => {
  return (
    <Tooltip text={message} placement="top">
      {children}
    </Tooltip>
  )
}


export default memo(OverlayMessage)