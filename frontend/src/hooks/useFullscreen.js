import { useCallback, useState, useEffect } from 'react'
import fscreen from 'fscreen'

const event = {
  fullscreenChange: 'fullscreenchange'
}

function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = useState(fscreen.fullscreenElement)

  useEffect(() => {
    const onFullScreenChange = () => setIsFullScreen(fscreen.fullscreenElement)

    fscreen.addEventListener(event.fullscreenChange, onFullScreenChange)

    return () => {
      fscreen.removeEventListener(event.fullscreenChange, onFullScreenChange)
    }
  }, [])

  const toggleFullScreen = useCallback(
    /**
     * @param {Document} requestElement
     */
    (requestElement) => {
    isFullScreen
      ? fscreen.exitFullscreen()
      : fscreen.requestFullscreen(requestElement)
  }, [isFullScreen])

  return [isFullScreen, toggleFullScreen]
}

export default useFullScreen
