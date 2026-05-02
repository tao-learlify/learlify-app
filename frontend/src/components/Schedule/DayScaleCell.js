import React from 'react'
import { withStyles } from '@material-ui/core'
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui'
import clsx from 'clsx'
import moment from 'moment'
import 'moment/locale/es'



const styles = {
  dayScaleCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: '#ACE0EB',
    padding: '1px',
    '& > div': {
      display: 'flex !important',
      alignItems: 'center',
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      '& > div': {
        fontSize: '15px',
        color: 'black'
      },
      '& > p': {
        fontSize: '15px',
        paddingLeft: '5px',
        color: 'black'
      }
    }
  }
}

const DayScaleCell = withStyles(
  styles,
  'DayScaleCell'
)(({ formatDate, classes, ...restProps }) => (
  <WeekView.DayScaleCell
    {...restProps}
    formatDate={formatDayScaleDate}
    className={clsx(classes.dayScaleCell, 'customRadius')}
  />
))

const formatDayScaleDate = (date, options) => {
const { weekday } = options

  const momentDate = moment(date)

  return momentDate.format(weekday ? 'ddd' : 'D')
}

export default DayScaleCell
