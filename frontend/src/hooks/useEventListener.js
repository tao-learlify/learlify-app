import { useRef, useEffect } from 'react'

/** 
 * @param {EventTarget} eventName
 * @param {Function} handler
 * @param {Element} element
 * @returns {void}
 */
function useEventListener (eventName, handler, element = window) {
  const handleCallback = useRef()

  useEffect(() => {
    handleCallback.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener

    if (isSupported) {
      const listener = event => handleCallback.current(event)
      
      element.addEventListener(eventName, listener)

      return () => {
        element.removeEventListener(eventName, listener)
      }
    }
  }, [element, eventName])
}

export default useEventListener