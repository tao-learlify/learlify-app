import { useEffect, useRef } from 'react'

/**
 * Executes a callback every amount of time.
 * @param {() => void} callback 
 * @param {number} delay 
 */
function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    let id = setInterval(tick, delay)

    return () => clearInterval(id)
  }, [delay])
}



export default useInterval