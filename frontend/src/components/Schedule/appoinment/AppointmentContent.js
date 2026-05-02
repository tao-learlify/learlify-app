import * as React from 'react'
import * as PropTypes from 'prop-types'
import { HORIZONTAL_TYPE, VERTICAL_TYPE } from '@devexpress/dx-scheduler-core'
import HorizontalAppointment from './HorizontalAppointment'
import VerticalAppointment from './VerticalAppointment'

const AppointmentContent = ({ type, ...props }) =>
  type === HORIZONTAL_TYPE ? (
    <HorizontalAppointment {...props} />
  ) : (
    <VerticalAppointment {...props} />
  )

AppointmentContent.propTypes = {
  type: PropTypes.oneOf([HORIZONTAL_TYPE, VERTICAL_TYPE]).isRequired
}

export default React.memo(AppointmentContent)
