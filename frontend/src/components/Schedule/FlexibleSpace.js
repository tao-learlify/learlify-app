import React, { memo } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { Toolbar } from '@devexpress/dx-react-scheduler-material-ui'
import EventNoteIcon from '@material-ui/icons/EventNote'

const styles = () => ({
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  root: {
    flex: 'none'
  },
  text: {
    marginLeft: 10
  }
})

const FlexibleSpace = withStyles(styles, { name: 'ToolbarRoot' })(
  ({ classes, ...props }) => (
    <Toolbar.FlexibleSpace {...props} className={classes.root}>
      <div className={classes.flex}>
        <EventNoteIcon fontSize="large" htmlColor="#b7b7b7" />
        <Typography variant="h6" className={classes.text}>
          CLASES
        </Typography>
      </div>
    </Toolbar.FlexibleSpace>
  )
)

export default memo(FlexibleSpace)
