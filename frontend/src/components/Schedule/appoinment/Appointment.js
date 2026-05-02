import React, { memo } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui'

const styles = () => ({
  appointment: {
    width: '100%',
    borderRadius: '10px',
    '&:hover': {
      opacity: 0.6
    }
  },
  John: {
    backgroundColor: '#03A9F4'
  },
  Kate: {
    backgroundColor: '#3F51B5'
  },
  Sophie: {
    backgroundColor: '#536DFE'
  },
  Stefan: {
    backgroundColor: '#FFA000'
  },
  Rebecca: {
    backgroundColor: '#E040FB'
  },
  Josh: {
    backgroundColor: '#F44336'
  },
  Loto: {
    backgroundColor: '#E91E63'
  },
  disabledBackground: {
    backgroundColor: '#607D8B'
  },
})

const Appointment = withStyles(styles, {
  name: 'Appointment'
})(({ classes, ...props }) => {
  return (
    <Appointments.Appointment
      className={classNames(
        classes.appointment,
        classes[props.data.teacher.firstName],
        props.data.taken && classes.disabledBackground
      )}
      {...props}
    />
  )
})

export default memo(Appointment)
