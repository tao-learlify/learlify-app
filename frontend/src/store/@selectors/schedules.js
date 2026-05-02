import { createSelector } from '@reduxjs/toolkit'

const selector = state => state.schedule

export const classRoomInstanceSelector = createSelector(
  selector,
  ({ classes }) => classes.instance
)

export const scheduleSelector = createSelector(
  selector,
  ({ schedules }) => schedules
)