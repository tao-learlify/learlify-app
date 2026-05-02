import { createSelector } from '@reduxjs/toolkit'

const selector = state => state.classes

export const onlineFlowStream = createSelector(
  selector,
  ({ classes }) => classes.online
)

export const classesSelector = createSelector(
  selector, 
  ({ classes }) => classes
)