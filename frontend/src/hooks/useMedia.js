import { useState, useEffect } from 'react'

/**
 * 
 * @param {string} media 
 * @param {boolean} defaultState 
 * @returns {boolean}
 */
function useMedia(media, defaultState) {
  const [state, setState] = useState(defaultState)

  useEffect(() => {
    const mediaQuery = window.matchMedia(media)

    const onChange = () => {
      setState(mediaQuery.matches)
    }

    mediaQuery.addListener(onChange)

    setState(mediaQuery.matches)

    return () => {
      mediaQuery.removeListener(onChange)
    }
  }, [media])

  return state
}

export default useMedia
