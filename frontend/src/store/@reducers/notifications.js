import { createSlice } from '@reduxjs/toolkit'

import * as controller from 'store/@controllers/notifications'
import {
  fetchNotificationsThunk,
  markAllAsReadThunk
} from 'store/@thunks/notifications'

/**
 * @typedef {Object} Notification
 * @property {number | null} senderId
 * @property {string} message
 * @property {boolean} read
 * @property {number} type
 * @property {boolean} deleted
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {number} id
 */

/**
 * @typedef {Object} NotificationState
1 * @property {boolean} loading
 * @property {string | null} error
 * @property {number} unreads
 */

/**
 * @type {NotificationState}
 */
const initialState = {
  data: [],
  error: null,
  loading: false,
  unreads: 0,
  pagination: null,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    addNotification: controller.addNotificationController,

    markAsReadNotification: controller.markAsReadController,

    markAllAsRead: controller.markAllAsReadController
  },
  extraReducers: {
    [fetchNotificationsThunk.fulfilled]:
      controller.fetchNotificationsFullfiledController,
    [fetchNotificationsThunk.rejected]:
      controller.fetchNotificationsRejectedController,
    [fetchNotificationsThunk.pending]:
      controller.fetchNotificationsPendingController,
    [markAllAsReadThunk.pending]:
      controller.fetchNotificationsPendingController,
    [markAllAsReadThunk.rejected]:
      controller.fetchNotificationsRejectedController,
    [markAllAsReadThunk.fulfilled]:
      controller.markAllNotificationsAsReadController
  }
})

export const {
  addNotification,
  markAsReadNotification,
  markAllAsRead
} = notificationSlice.actions

export default notificationSlice.reducer
