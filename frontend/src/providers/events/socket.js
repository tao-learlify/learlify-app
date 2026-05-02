import decode from 'jwt-decode'
import store from 'store'
import { client } from 'providers/sockets'
import { getToken } from 'utils/localStorage'
import { addNotification } from 'store/@reducers/notifications'


import { updateDocumentTitleWithNotification } from 'providers/document'
import { joimRooms, openClassRoom } from 'store/@reducers/classes'

export const CHAT_MESSAGE = 'CHAT_MESSAGE'
export const JOIN_CHAT_ROOM = 'JOIN_CHAT_ROOM'
export const OPEN_CLASS_ROOM = 'OPEN_CLASS_ROOM'
export const TYPING_MESSAGE = 'TYPING_MESSAGE'
export const USER_ASSERT = 'USER_ASSERT'
export const USER_JOIN_ROOM = 'USER_JOIN_ROOM'
export const MEETING_STATUS = 'MEETING_STATUS'
export const EXPIRE_CLASS_ROOM = 'EXPIRE_CLASS_ROOM'
export const NOTIFICATION = 'NOTIFICATION'

/**
 * @typedef {Object} OpenClassContextData
 * @property {[]} schedules
 * @property {boolean} notification
 */

/**
 * @param {import('providers/sockets').SubscriberListener}
 */
export const clientEvent = ({ dispatch }) => {
  /**
   * @description
   * Sending to the server authentication.
   */
  client.on(USER_ASSERT, () => {
    const token = getToken()

    if (token) {
      client.emit(USER_ASSERT, decode(token))
    }
  })

  /**
   * @description
   * User joining to a specific room event.
   */
  client.on(USER_JOIN_ROOM, payload => {
    dispatch(joimRooms(payload))
  })



  client.on(OPEN_CLASS_ROOM, payload => {
    dispatch(openClassRoom(payload))
  })

  /**
   * @description
   * Notifies a user.
   */
  client.on(NOTIFICATION, notification => {
    try {
      const { settings, notifications } = store.getState()

      dispatch(addNotification(notification))

      updateDocumentTitleWithNotification(
        notifications.unreads + 1,
        settings.appTitle
      )
    } catch {
      dispatch(addNotification(notification))
    }
  })
}
