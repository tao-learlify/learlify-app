import React, { memo } from 'react'
import { Badge } from 'react-bootstrap'

import Text from './Text'

/**
 * @typedef {Object} WordsCounterProps
 * @property {string} value
 * @property {number} maximum
 * @property {TextColor} color
 * @property {string} message
 */

/**
 * @type {React.FunctionComponent<WordsCounterProps>}
 */
const WordsCounter = ({ color, message, value ,maximum }) => {
  return (
    <Text bold tag="small">
      {message} <Text tag="span" color={color}>
       <Badge pill variant="info">
        {value.length}/{maximum}
        </Badge> 
      </Text>
    </Text>
  )
}


WordsCounter.defaultProps = {
  value: '',
  color: 'muted',
  maximum: 0
}


export default memo(WordsCounter)