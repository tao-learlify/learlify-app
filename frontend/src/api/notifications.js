import httpClient, { GET, PUT } from 'providers/http'

/** 
 * @description
 * Service to fetch all notifications.
 * @param {CommonFetchRequest}
 */
export function fetchNotifications ({ page, signal }) { 
  /**
   * @description
   * If the page is present will fetch only notifications by page.
   * */ 
  if (page) {
    return httpClient({
      endpoint: '/api/v1/notifications/all',
      method: GET,
      queries: {
        page
      },
      requiresAuth: true,
      signal
    })
  }
    
  return httpClient({
    endpoint: '/api/v1/notifications/all',
    method: GET,
    queries: {
      unreads: true
    },
    requiresAuth: true,
    signal
  })
}

/**
 * @param {{ id: number }}
 * @description
 * Mark as read one notification endpoint.
 */
export function markAsReadNotification ({ id }) {
  return httpClient({
    body: {
      read: true
    },
    endpoint: '/api/v1/notifications',
    method: PUT,
    params: [
      id
    ],
    requiresAuth: true
  })
}

/**
 * @description
 * Mark all as read all notifications.
 */
export function markAllAsRead () {
  return httpClient({
    endpoint: '/api/v1/notifications/all',
    method: PUT,
    requiresAuth: true
  })
}