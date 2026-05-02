import React from 'react'
import { Select, withStyles, MenuItem } from '@material-ui/core'
import { ResourceSwitcherStyle } from '@styles'

const ResourceSwitcher = withStyles(ResourceSwitcherStyle, {
  name: 'ResourceSwitcher'
})(({ mainResourceName, onChange, classes, resources }) => (
  <div className={classes.container}>
    <div className={classes.text}></div>
    <Select value={mainResourceName} onChange={onChange}>
      {resources.map(resource => (
        <MenuItem key={resource.fieldName} value={resource.fieldName}>
          {resource.title}
        </MenuItem>
      ))}
    </Select>
  </div>
))

export default ResourceSwitcher
