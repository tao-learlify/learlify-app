import produce from 'immer'
import { audioDevice, videoDevice } from 'utils/functions'
import * as PARTICIPANT from '../actions/participant'

/**
 * @typedef {Object} ParticipantState
 * @property {import ('twilio-video').AudioTrack []} audioTracks
 * @property {import ('twilio-video').VideoTrack []} videoTracks
 * @property {boolean} camera
 * @property {boolean} microphone
 * @property {MediaDeviceInfo []} devices
 * @property {boolean} screenShare
 * @property {User | null} identity
 * @property {{ audioDevice: MediaDeviceInfo | null, videoDevice: MediaDeviceInfo | null }} stageds
 */

/**
 * @type {ParticipantState}
 */
export const initialState = {
  audioTracks: [],
  screenShare: false,
  camera: true,
  devices: [],
  microphone: true,
  videoTracks: [],
  stageds: {
    audioDevice: null,
    videoDevice: null
  },
  identity: null
}

const participantReducer = produce(
  /**
   * @param {ParticipantState} state
   * @param {import ('redux').Action}
   */
  (state = initialState, { payload, type }) => {
    switch (type) {
      /**
       * @description
       * Setting audio tracks for the streaming.
       * This refers to a participant.
       */
      case PARTICIPANT.SET_AUDIO_TRACKS:
        state.audioTracks = [...state.audioTracks, payload]
        return

      /**
       * @description
       * Setting video tracks for the streaming.
       * This refers to a participant.
       */
      case PARTICIPANT.SET_VIDEO_TRACKS:
        state.videoTracks = [...state.videoTracks, payload]
        return

      /**
       * @description
       * Setting video tracks for the streaming.
       * This refers to a participant.
       */
      case PARTICIPANT.REMOVE_VIDEO_TRACKS:
        state.videoTracks = state.videoTracks.filter(
          videoTrack => videoTrack !== payload
        )
        return

      /**
       * @description
       * Setting audiotracks tracks for the streaming.
       * This refers to a participant.
       */
      case PARTICIPANT.SET_AUDIO_TRACKS_STREAM:
        state.audioTracks = payload
        return

      /**
       * @description
       * Setting all video tracks.
       */
      case PARTICIPANT.SET_VIDEO_TRACKS_STREAM:
        state.videoTracks = payload
        return

      /**
       * @description
       * Toggling camera state, turn on/off.
       * @requires MediaDevices
       */
      case PARTICIPANT.SET_CAMERA_STATE:
        state.camera = payload ? payload : !state.camera
        return

      /**
       * @description
       * Toggling microphone state, turn on/off.
       * @requires MediaDevices
       */
      case PARTICIPANT.SET_MICROPHONE_STATE:
        state.microphone = payload ? payload : !state.microphone
        return

      /**
       * @description
       * Putting the default devices on the audio input, and video input.
       */
      case PARTICIPANT.SET_DEVICES:
        const audioInput = payload.find(audioDevice)
        const videoInput = payload.find(videoDevice)

        state.devices = payload || []
        state.stageds.audioDevice = audioInput || null
        state.stageds.videoDevice = videoInput || null
        return

      /**
       * @description
       * Manually connects one video device on the platform.
       */
      case PARTICIPANT.SET_VIDEO_DEVICE:
        state.stageds.videoDevice = payload
        return

      /**
       * @description
       * Manually connects one audio device on the platform.
       */
      case PARTICIPANT.SET_AUDIO_DEVICE:
        state.stageds.audioDevice = payload
        return

      /**
       * @description
       * Setting the share screen state turn on/off.
       */
      case PARTICIPANT.SET_SHARESCREEN_STATE:
        state.screenShare = payload ? payload : !state.screenShare
        return

      /**
       * @description
       * Tracks the information about the user connected on meet.
       */
      case PARTICIPANT.SET_REMOTE_IDENTITY:
        state.identity = payload
        return

      default:
        return state
    }
  }
)

export default participantReducer
