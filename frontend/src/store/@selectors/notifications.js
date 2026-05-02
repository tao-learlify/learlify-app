import { createSelector } from '@reduxjs/toolkit'

const notifications = state => state.notifications

export const notificationsSelector = createSelector(
  notifications,
  state => state
)