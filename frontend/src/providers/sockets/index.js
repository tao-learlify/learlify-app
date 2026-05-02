import io from 'socket.io-client'
import config from 'config'
import { clientEvent } from 'providers/events/socket'

export const client = io.connect(config.WEBSOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax : 5000,
  reconnectionAttempts: Infinity
})

client.on('disconnect', () => {
  console.info('disconnect', { ping: true })
})


client.on('connect', () => {
  client.emit('reconnection')
})
/**
 * @typedef {Object} SubscriberListener
 * @property {import ('redux').Dispatch} dispatch
 */

/**
 * @param {SubscriberListener}
 */
export function socketListenerSubscriber({ dispatch }) {
  clientEvent({ dispatch })
}
