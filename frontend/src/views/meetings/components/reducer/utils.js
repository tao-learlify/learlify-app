/**
 * @param {string []} tracks 
 * @param {string} identity 
 */
export function isNotIncluded (tracks, identity) {
  return !tracks.includes(identity)
}

/**
 * @param {string []} tracks 
 * @param {string} identity 
 */
export function isIncluded (tracks, identity) {
  return tracks.includes(identity)
}