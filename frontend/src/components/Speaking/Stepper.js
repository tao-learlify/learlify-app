import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Check from '@material-ui/icons/Check'
import SettingsIcon from '@material-ui/icons/Settings'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import VideoLabelIcon from '@material-ui/icons/VideoLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { TURQUOISE } from 'assets/colors'
import { StepContent } from '@material-ui/core'

const useQontoStepIconStyles = makeStyles({
  root: {
    display: 'flex',
    color: TURQUOISE,
    height: 22
  },
  active: {
    color: TURQUOISE
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  },
  completed: {
    color: TURQUOISE,
    zIndex: 1,
    fontSize: 18
  }
})

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles()
  const { active, completed } = props

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  )
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool
}

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
  }
})

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles()
  const { active, completed } = props

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />
  }

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed
      })}
    >
      {icons[String(props.icon)]}
    </div>
  )
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

const Steps = ({ disabled, step, steps, onReset, onBack, onNext }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel activeStep={step}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel color={TURQUOISE} />
          </Step>
        ))}
      </Stepper>
      <div>
        {StepContent === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={onReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <div>
              <Button
                disabled={step === 0 || disabled}
                onClick={onBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                disabled={disabled}
                variant="contained"
                color="inherit"
                onClick={onNext}
                className={classes.button}
              >
                {step === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Steps
