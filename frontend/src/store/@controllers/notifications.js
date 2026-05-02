import { MAXIMUM_RESULTS_PAGINATION_API } from 'constant'

/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const addNotificationController = (state, action) => {
  state.unreads = state.unreads + 1

  if (state.data.length < MAXIMUM_RESULTS_PAGINATION_API) {
    state.data.push(action.payload)
  }
  /**
   * @description
   * Inserting a new element into the head.
   */
  state.data = [action.payload, ...state.data]

  /**
   * @description
   * Removing the last element due to increase size list.
   * So the user needs to see more than the current page.;l
   */
  state.data.pop()
}

/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const fetchNotificationsFullfiledController = (state, action) => {

  const { notifications, unreads } = action.payload.response

  state.data = notifications
  state.loading = false

  /**
   * @description
   * Only when notifications have unreads
   */
  if (unreads && unreads > 0) {
    state.unreads = unreads
  }

  /**
   * @description
   * If we take pagination in the response.
   */
  if (action.payload.pagination) {
    state.pagination = action.payload.pagination
  }
}

/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const fetchNotificationsRejectedController = (state) => {
  state.loading = false
  state.error = true
}

/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const fetchNotificationsPendingController = (state) => {
  state.loading = true
}


/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const markAsReadController = (state, action) => {
  /**
   * @description
   * If stash is includeds only will be transformed in store.
   */
  if (action.payload.stash) {
    const stash = state.data.findIndex(notification => notification.id === action.payload.id)

    state.data[stash].read = true

    state.unreads = state.unreads - 1 < 0 ? 0 : state.unreads - 1  
  } else {
    const remaining = state.data.filter(notification => notification.id !== action.payload.id)

    state.data = remaining

    state.unreads = state.unreads - 1 < 0 ? 0 : state.unreads - 1
  }

}

/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const markAllAsReadController = (state) => {
  state.unreads -= state.data.length
  state.data = []
}


/**
 * @param {import ('store/@reducers/notifications').NotificationState} state 
 * @param {{ payload: import ('store/@reducers/notifications').Notification }} action 
 */
export const markAllNotificationsAsReadController = (state) => {
  state.data = state.data.map(notification => ({
    ...notification,
    read: true
  }))
  state.loading = false
}