import produce from 'immer'
import * as CR from '../actions/classroom'
import { isNotIncluded, isIncluded } from './utils'

/**
 * @typedef {Object} ClassRoomState
 * @property {Array<User>} users
 * @property {import ('twilio-video').Room} room
 * @property {import ('twilio-video').VideoTrack} track
 * @property {import ('twilio-video').LocalAudioTrack} localAudioTrack
 * @property {import ('twilio-video').localVideoTrack} localVideoTrack
 * @property {{ audio: string [], video: string []}} remoteTracks
 */

/**
 * @type {ClassRoomState}
 */
export const initialState = {
  localAudioTrack: null,
  localVideoTrack: null,
  room: null,
  users: [],
  remoteTracks: {
    audio: [],
    video: []
  }
}
/**
 * @see https://www.twilio.com/blog/video-chat-react-hooks
 * @param {ClassRoomState} state
 * @param {import ('redux').Action}
 */
const classRoomReducer = (state = initialState, { type, payload }) => {
  const { kind, identity } = payload

  switch (type) {
    /**
     * @description
     * User connects to the current room, we push the current state adding one user.
     */
    case CR.CONNECT_USER_TO_ROOM:
      state.users = [...state.users, payload]
      return

    /**
     * @description
     * User disconnects from the meeting, we only filter the current users connected already.
     */
    case CR.DISCONNECT_USER_TO_ROOM:
      state.users = state.users.filter(user => user !== payload)
      return
    
    /**
     * @description
     * Setting the room with a payload from twilio connection.
     * @requires "connect" from twillio library.
     */
    case CR.SET_ROOM_NETWORK:
      state.room = payload
      return

    /**
     * @description
     * Local audio track for the user.
     * This will be output on the DOM Ref audio tag.
     */
    case CR.SET_LOCAL_AUDIO_TRACK:
      state.localAudioTrack = payload
      return

    /**
     * @description
     * Local video track for the user.
     * This will be output on the DOM ref video tag.
     */
    case CR.SET_LOCAL_VIDEO_TRACK:
      state.localVideoTrack = payload
      return

    /**
     * @description
     * Remote audio tracks for every user connected in the meeting.
     */
    case CR.SET_REMOTE_TRACK_ENABLED:
      if (isIncluded(state.remoteTracks[kind], identity)) {
        state.remoteTracks[kind] = state.remoteTracks[kind].filter(
          identities => identities !== identity
        )
      }
      return

    /**
     * @description
     * Disabling remote tracks for every user connected.
     */
    case CR.SET_REMOTE_TRACK_DISABLED:
      if (isNotIncluded(state.remoteTracks[kind], identity)) {
        state.remoteTracks[kind] = [...state.remoteTracks[kind], identity]
      }
      return

    default:
      return state
  }
}

export default produce(classRoomReducer)
