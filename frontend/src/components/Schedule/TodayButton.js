import * as React from 'react'
import * as PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import classNames from 'clsx'

const styles = ({ spacing }) => ({
  button: {
    backgroundColor: '#FFB300',
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: '#E2A204'
    },
    '&:focus': {
      outline: 'none'
    },
    marginLeft: spacing(0.5),
    '&:first-child': {
      marginLeft: 0
    },
    '@media (max-width: 700px)': {
      fontSize: '0.75rem'
    }
  }
})

const TodayButtonBase = ({
  setCurrentDate,
  classes,
  getMessage,
  className,
  ...restProps
}) => {
    
  const handleClick = () => {
    setCurrentDate(new Date())
  }

  return (
    <Button
      className={classNames(classes.button, className)}
      onClick={handleClick}
      {...restProps}
    >
      {getMessage('today')}
    </Button>
  )
}

TodayButtonBase.propTypes = {
  setCurrentDate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  getMessage: PropTypes.func.isRequired
}

TodayButtonBase.defaultProps = {
  className: undefined
}

export default withStyles(styles)(TodayButtonBase, { name: 'TodayButton' })
