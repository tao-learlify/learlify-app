import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { updateDocumentTitleWithNotification } from 'providers/document'

/**
 * @description
 * All notifications fetch.
 */
export const fetchNotificationsThunk = createAsyncThunk(
  'notifications/fetch',
  async ({ page } = { page: null }, { rejectWithValue, signal }) => {
    try {
      const notifications = await api.notifications.fetchNotifications({
        page,
        signal
      })

      /**
       * @description
       * Shows the title like (12) B1B2 Top
       */
      page || updateDocumentTitleWithNotification(notifications.response.unreads)

      return notifications
    } catch (err) {

      return rejectWithValue(err)
    }
  }
)


/**
 * @description
 * All notifications marked as read.
 */
export const markAllAsReadThunk = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.notifications.markAllAsRead()

      return {
        read: true
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)