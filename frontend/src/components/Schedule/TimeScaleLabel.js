import React, { memo } from 'react'
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui'
import moment from 'moment'
import ErrorHandler from 'views/errors'

const formatTimeScaleDate = date => moment(date).format('hh:mm A')

export default memo(({ formatDate, ...props }) =>
  import.meta.env.DEV ? (
    <ErrorHandler>
      <WeekView.TimeScaleLabel {...props} formatDate={formatTimeScaleDate} />
    </ErrorHandler>
  ) : (
    <WeekView.TimeScaleLabel {...props} formatDate={formatTimeScaleDate} />
  )
)
