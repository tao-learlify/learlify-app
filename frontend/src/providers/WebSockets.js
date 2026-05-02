  
import { useEffect } from 'react'
import { socketListenerSubscriber } from './sockets'
import { useDispatch } from 'react-redux'

/**
 * @typedef {Object} SocketProviderProps
 * @property {React.ReactNode} children
 */

/**
 * @description
 * This component allow to manage all socket calls, and emits.
 * @type {React.FunctionComponent<SocketProviderProps>}
 */
const WebSockets = ({ children }) => {
  const dispatch = useDispatch()
  

  useEffect(() => {
    /**
     * @description
     * We can isolate redux dispatch in a store pattern, that allows to us to control the flux our socket calls.
     */
    socketListenerSubscriber({ dispatch })
  }, [dispatch])

  return children
}

export default WebSockets