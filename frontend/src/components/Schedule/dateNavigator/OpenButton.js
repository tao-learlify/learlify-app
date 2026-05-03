import * as React from 'react'
import * as PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import CalendarToday from '@material-ui/icons/CalendarToday'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'clsx'

function WrapperOpenButton({ children }) {
  return <div className="tw:w-full tw:flex tw:justify-center tw:pr-4">{children}</div>
}

const styles = ({ spacing }) => ({
  textButton: {
    '@media (max-width: 700px)': {
      display: 'none'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  iconButton: {
    '@media (min-width: 700px)': {
      display: 'none'
    },
    '@media (max-width: 500px)': {
      width: spacing(4),
      height: spacing(4),
      padding: 0
    },
    '&:focus': {
      outline: 'none'
    }
  }
})

const OpenButtonBase = React.memo(
  ({ text, onVisibilityToggle, classes, className, ...restProps }) => {
    return (
      <WrapperOpenButton>
        <Button
          onClick={onVisibilityToggle}
          className={classNames(classes.textButton, className)}
          {...restProps}
        >
          {text}
        </Button>
        <IconButton
          onClick={onVisibilityToggle}
          className={classNames(classes.iconButton, className)}
          {...restProps}
        >
          <CalendarToday />
        </IconButton>
      </WrapperOpenButton>
    )
  }
)

OpenButtonBase.propTypes = {
  onVisibilityToggle: PropTypes.func.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
}

OpenButtonBase.defaultProps = {
  text: '',
  className: undefined
}

export default withStyles(styles, { name: 'OpenButton' })(OpenButtonBase)
