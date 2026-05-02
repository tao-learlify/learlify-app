import React from 'react'
import * as PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'clsx'

const styles = ({ spacing }) => ({
  button: {
    backgroundColor: '#FFB300',
    '&:hover': {
      backgroundColor: '#E2A204'
    },
    '&:focus': {
      outline: 'none'
    },
    minWidth: 'unset',
    width: spacing(4),
    height: '100%',
    padding: 0
  },
  buttonLeft: {
    borderRadius: '2px 0 0 2px'
  },
  buttonRight: {
    borderRadius: '0 2px 2px 0'
  }
})

const NavigationButtonBase = React.memo(
  ({ type, onClick, classes, className, ...restProps }) => (
    <Button
      onClick={onClick}
      className={classNames(
        classes.button,
        type === 'back' ? classes.buttonLeft : classes.buttonRight
      )}
      {...restProps}
    >
      {type === 'back' ? <ChevronLeft /> : <ChevronRight />}
    </Button>
  )
)

NavigationButtonBase.propTypes = {
  type: PropTypes.oneOf(['forward', 'back']).isRequired,
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
}

NavigationButtonBase.defaultProps = {
  onClick: () => {},
  className: undefined
}

export default withStyles(styles, { name: 'NavigationButton' })(
  NavigationButtonBase
)
