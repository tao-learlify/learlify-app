import { client } from 'providers/sockets'
import { useRef } from 'react'
import useAuthProvider from './useAuthProvider'
import useInterval from './useInterval'

const useSocketReconnectAttempDelay = 5000

function useSocket () {
  const user = useAuthProvider()

  const io = useRef(client)

  const reconnectAttempt = () => {
    const runtime = io.current.connected

    if (io.current.disconnected) {
      console.info('Attemp', { ping: runtime })

      io.current.connect()

      if (user.isLoggedIn) {
        io.current.emit('reconnection', {
          id: user.profile.id
        })
      }
    }
  }
  
  useInterval(reconnectAttempt, useSocketReconnectAttempDelay)

  return io.current
}


export default useSocket