/**
 * @param {boolean} demoApply
 * @param {Function} callback
 * @param {{}} thunk
 */
export function getResponseCallback(thunk, demoApply, callback) {
  if (callback) {
    if (thunk && demoApply) {
      return callback(true)
    }

    if (thunk && thunk.response && thunk.response.advance && thunk.response.advance.length > 0) {
      return callback(true)
    }
  }
}


/**
 * @description
 * Get content from advance
 */
export function getAdvance({ content } = { content: {} }) {
  try {
    const data = Object.entries(content).find(([key, value]) => value.last)

    if (data) {
      return {
        unit: Number.parseInt(data[0]) - 1,
        props: data[1]
      }
    }
    return {}
  } catch {
    return {}
  }
}


/**
 * @param {string} label 
 */
export function splitContextFromSection (label) {
  try {
    const split = label.split(' ')

    return split[0]
  } catch {
    return 'Undefined Label'
  }
}