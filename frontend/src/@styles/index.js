/**
 * @module
 * This module only contains material UI features.
 */
const ToolTipHeaderStyle = ({ palette }) => ({
  icon: {
    color: palette.action.active
  },
  textCenter: {
    textAlign: 'center'
  },
  firstRoom: {
    background: ''
  },
  secondRoom: {
    background: ''
  },
  thirdRoom: {
    background: ''
  },
  header: {
    height: '260px',
    backgroundSize: 'cover'
  },
  commandButton: {
    backgroundColor: 'rgba(255,255,255,0.65)'
  }
})

const ResourceSwitcherStyle = theme => ({
  container: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    justifyContent: 'flex-end'
  },
  text: {
    ...theme.typography.h6,
    marginRight: theme.spacing(2)
  }
})

export { ToolTipHeaderStyle, ResourceSwitcherStyle }
