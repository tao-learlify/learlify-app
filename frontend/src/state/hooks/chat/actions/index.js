import * as ACTION from './types'

/**
 * @param {import ('components/chat').Message} message
 * @returns {import ('redux').ActionCreator} 
 */
function chatMessage (message) {
  return {
    type: ACTION.CHAT_MESSAGE,
    payload: message
  }
}

/**
 * @param {string} message
 * @returns {import ('redux').ActionCreator} 
 * */
function chatTyping (message) {
  return {
    type: ACTION.CHAT_TYPING,
    payload: message
  }
}


/**
 * @param {number} unreads 
 * @returns {import ('redux').ActionCreator}
 */
function chatUnreads (unreads) {
  return {
    type: ACTION.CHAT_UNREADS,
    payload: unreads
  }
}

export {
  chatMessage,
  chatUnreads,
  chatTyping
}