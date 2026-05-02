const ACCEPT_STATUS_CODE = [200, 201]
/**
 * @param {{ }} action
 */
export function isHttpRequest(action) {
  return (
    action.payload.statusCode &&
    ACCEPT_STATUS_CODE.includes(action.payload.statusCode)
  )
}


export function isClientError (action) {
  return (
    action.payload.statusCode &&
    action.payload.statusCode >= 400 && 500 <= action.payload.statusCode
  )
}

/**
 * 
 * @param {{ payload?: { entity: string } }} action 
 * @param {string []} entities 
 */
export function isEntity (action, entities) {
  const { entity } = action.payload

  return entities.includes(entity)
}