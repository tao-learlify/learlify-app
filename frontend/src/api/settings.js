import httpClient, { GET } from 'providers/http'

/**
 * @description
 * Fetch all current youtube videos for the application.
 * @param {AbortableRequest}
 */
export function fetchYoutubeVideos ({ signal }) {
  return httpClient({
    endpoint: '/api/v1/youtube',
    method: GET,
    requiresAuth: true,
    signal
  })
}

