import { useCallback, useState } from 'react'
import { LocalVideoTrack } from 'twilio-video'

/**
 * @typedef {Object} ShareScreenState
 * @property {Error} shareScreenTrackError
 * @property {import ('twilio-video').LocalVideoTrack} shareScreenTrack
 * @property {() => Promise<Void>} getMediaStreamTrack
 */


/**
 * @returns {ShareScreenState}
 */
function useShareScreen () {
  const [state, setState] = useState({
    shareScreenTrackError: null,
    shareScreenTrack: null
  })

  const getMediaStreamTrack = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      })

      const shareScreenTrack = stream.getTracks()[0]

      setState(state => ({
        ...state,
        shareScreenTrack: new LocalVideoTrack(shareScreenTrack)
      }))
    } catch (err) {
      setState(state => ({
        ...state,
        shareScreenTrackError: err
      }))
    }
  }, [])

  return {
    ...state,
    getMediaStreamTrack
  }
}

export default useShareScreen