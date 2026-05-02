/**
 * 
 * @param {{ statusCode: number }} httpRequest 
 * @param {Function} callback
 * @returns {() => boolean} 
 */
export function httpMiddleware(httpRequest = { statusCode: 500 }, callback) {
  if (!httpRequest && !httpRequest.statusCode) {
    return callback(false)
  }

  return callback(httpRequest.statusCode === 200 || httpRequest.statusCode === 201)
}