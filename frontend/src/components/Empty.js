import React, { memo } from 'react'

import Animate from './Animate'
import Text from './Text'

/**
 * @typedef {Object} EmptyDataProps
 * @property {boolean} status
 * @property {string} message
 */

/**
 * @type {React.FunctionComponent<EmptyDataProps>}
 */
const Empty = ({ status, message }) => {
  return (
    status && (
      <Animate type="zoomInLeft">
        <Text center color="muted" tag="p">
          {message}
        </Text>
      </Animate>
    )
  )
}

export default memo(Empty)
