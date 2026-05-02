import React from 'react'
import moment from 'moment'

import Text from 'components/Text'


/**
 * @typedef {Object} FormattedProps
 * @property {Date} startDate
 * @property {Date} endDate
 */

/**
 * @type {React.FunctionComponent<FormattedProps>}
 */
const Formatted = ({ startDate, endDate }) => {
  return (
    <>
      <Text tag="small">
        {moment(startDate).utc().format('dddd')} {moment(endDate).format('DD, hh')}
      </Text>
     </>
  )
}

export default Formatted