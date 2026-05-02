import { useState } from 'react'
import useEventListener from './useEventListener'

/**
 * @example
 * return [window.document.body.clientHeight, window.document.body.clientWidth]
 * @description
 * Returns the clientHeigt and clientWidth of browser.
 * @returns {[number, number]}
 */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState([
    window.document.body.clientHeight,
    window.document.body.clientWidth
  ])

  useEventListener('resize', () => {
    setWindowSize([
      window.document.body.clientHeight,
      window.document.body.clientWidth
    ])
  })

  return windowSize
}

export default useWindowSize  