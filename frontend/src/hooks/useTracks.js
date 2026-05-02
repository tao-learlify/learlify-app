import { useContext } from 'react'
import { getValuesFromArray } from 'utils/functions'
import { ClassContext } from 'views/meetings/components/classRoom/ClassRoom'

export default function useTracks () {
  const room = useContext(ClassContext)

  const detachAndStopAll = () => {
    const getTrack = publication => publication.track

    const tracks = {
      audio: getValuesFromArray(room.localParticipant.audioTracks).map(getTrack),
      video: getValuesFromArray(room.localParticipant.videoTracks).map(getTrack)
    }

    Object.keys(tracks).forEach(key => {
      tracks[key].forEach(track => {
        if (track) {
          track.detach()
        }
      })
    })
  }

  return {
    detachAndStopAll
  }
}