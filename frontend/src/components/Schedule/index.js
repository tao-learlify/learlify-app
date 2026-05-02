import React, { createContext, memo, useContext, useCallback } from 'react'
import { schedule } from 'common/module.schedule'
import { Animated } from 'react-animated-css'
import { Button, Paper, withStyles, Typography } from '@material-ui/core'
import { Assignment } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import {
  ViewState,
  EditingState,
  IntegratedEditing
} from '@devexpress/dx-react-scheduler'
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  ConfirmationDialog,
  DateNavigator,
  Scheduler,
  Toolbar,
  DayView,
  WeekView,
  ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui'
import classNames from 'clsx'

import useMedia from 'hooks/useMedia'

import Appointment from './appoinment/Appointment'
import AppointmentContent from './appoinment/AppointmentContent'

import ErrorHandler from 'views/errors'
import TimeScaleLabel from './TimeScaleLabel'

import DayScaleCell from './DayScaleCell'
import OpenButton from './dateNavigator/OpenButton'
import NavigationButton from './dateNavigator/NavigationButton'
import Root from './dateNavigator/root'

/**
 * @typedef {Object} ScheduleMeeting
 * @property {Date} endDate
 * @property {Date} startDate
 * @property {string} title
 */

/**
 * @typedef {{ addedAppointment: {}, appointmentChanges: {}, editingAppointment: {} }} EditingState
 */

/**
 * @typedef {Object} ScheduleProps
 * @property {boolean} editable
 * @property {ScheduleMeeting []} data
 * @property {Date} date
 * @property {() => {}} onCommit
 * @property {() => {}} onSelectMeeting
 */

const styles = theme => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(1) * 3,
    right: theme.spacing(1) * 4
  }
})

const headerStyles = ({ palette }) => ({
  icon: {
    color: palette.action.active
  },
  textCenter: {
    textAlign: 'center'
  },
  header: {
    height: '40px',
    backgroundSize: 'cover'
  },
  commandButton: {
    backgroundColor: 'red'
  },
  iconButton: {
    paddingBottom: '5px',
    marginBottom: '5px'
  },
  base: {
    marginTop: '8px'
  },
  typography: {
    color: 'rgba(0, 0, 0, 0.54)'
  }
})

const EditingStateDefaultProps = {
  defaultAddedAppointment: {},
  defaultAppointmentChanges: {},
  defaultEditingAppointment: undefined
}

export const ScheduleContext = createContext({
  onHandleMeeting() {}
})

const paperStyles = {
  mobile: {
    backgroundColor: '#F8F9FB',
    boxShadow: 'unset',
    '@media(min-width: 641px)': {
      boxShadow:
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)'
    }
  }
}

const PaperCustom = withStyles(paperStyles)(({ classes, children }) => (
  <Paper className={classes.mobile}>{children}</Paper>
))

const viewsOptions = {
  dayView: {
    displayName: '1 Day'
  },
  threeDaysView: {
    displayName: '3 days'
  },
  weekView: {
    displayName: 'Week'
  }
}

/**
 * @type {React.FunctionComponent<ScheduleProps>}
 */
const Schedule = ({ editable, data, onCommit }) => {
  const isMobile = useMedia(`(max-width: 700px)`, true)

  const views = useCallback(() => {
    const viewsArray = [
      <DayView
        displayName={
          isMobile
            ? viewsOptions.dayView.displayName
            : viewsOptions.threeDaysView.displayName
        }
        timeScaleLabelComponent={TimeScaleLabel}
        dayScaleCellComponent={DayScaleCell}
        cellDuration={schedule.classIntervalMinutesForUser}
        intervalCount={isMobile ? 1 : 3}
        {...schedule.view.props}
      />,
      <WeekView
        displayName={viewsOptions.weekView.displayName}
        timeScaleLabelComponent={TimeScaleLabel}
        dayScaleCellComponent={DayScaleCell}
        cellDuration={schedule.classIntervalMinutesForUser}
        {...schedule.view.props}
      />
    ]
    return isMobile
      ? viewsArray.map((view, index) => (
          <React.Fragment key={index}>{view}</React.Fragment>
        ))
      : [...viewsArray]
          .reverse()
          .map((view, index) => (
            <React.Fragment key={index}>{view}</React.Fragment>
          ))
  }, [isMobile])

  return editable ? (
    <ErrorHandler>
      <PaperCustom elevation={4}>
        <Scheduler title="AptisGo Horarios" height={600} data={data}>
          <ViewState />
          <Toolbar />
          <DateNavigator
            openButtonComponent={OpenButton}
            navigationButtonComponent={NavigationButton}
            rootComponent={Root}
          />
          <EditingState
            onCommitChanges={onCommit}
            {...EditingStateDefaultProps}
          />
          <IntegratedEditing />
          <ViewSwitcher />
          {views()}
          <ConfirmationDialog />
          <Appointments
            appointmentComponent={Appointment}
            appointmentContentComponent={AppointmentContent}
          />
          <AppointmentTooltip showCloseButton showOpenButton showDeleteButton />
          <AppointmentForm />
        </Scheduler>
      </PaperCustom>
    </ErrorHandler>
  ) : (
    <ErrorHandler>
      <PaperCustom elevation={4}>
        <Scheduler title="AptisGo Horarios" height={600} data={data}>
          <ViewState />
          <Toolbar />
          <DateNavigator
            openButtonComponent={OpenButton}
            navigationButtonComponent={NavigationButton}
            rootComponent={Root}
          />
          <ViewSwitcher />
          {views()}
          <Appointments
            appointmentComponent={Appointment}
            appointmentContentComponent={AppointmentContent}
          />
          <Animated animationIn="fadeIn" animationOut="fadeOut">
            <AppointmentTooltip
              headerComponent={ScheduleAppointment}
              showCloseButton
            />
          </Animated>
        </Scheduler>
      </PaperCustom>
    </ErrorHandler>
  )
}

const ScheduleAppointment = withStyles(headerStyles, {
  name: 'Header'
})(({ children, appointmentData, classes, ...props }) => {
  const { t } = useTranslation() 

  const context = useContext(ScheduleContext)

  const handleContext = useCallback(() => {
    context(appointmentData)
  }, [appointmentData, context])

  return (
    <AppointmentTooltip.Header
      {...props}
      className={classNames(classes.header, classes.iconButton)}
      appointmentData={appointmentData}
    >
      {appointmentData.taken ? (
        <Typography
          className={classNames(classes.base, classes.typography)}
          variant="h6"
        >
          {t('AGREEMENT.reserved')}
        </Typography>
      ) : (
        <Button
          className={classes.base}
          variant="outlined"
          size="small"
          onClick={handleContext}
          startIcon={<Assignment />}
        >
          {t('AGREEMENT.reserve')}
        </Button>
      )}
    </AppointmentTooltip.Header>
  )
})

Schedule.defaultProps = {
  editable: true,
  data: [],
  onCommit: () => null,
  onSelectMeeting: () => null
}

const ScheduleCoreStyle = withStyles(styles, { name: 'Schedule' })(Schedule)

export default memo(ScheduleCoreStyle)
