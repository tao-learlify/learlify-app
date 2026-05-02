import * as CR from './classroom'
import * as PR from './participant'
import decode from 'jwt-decode'

/**
 * @param {User} user
 * @returns {import ('redux').ActionCreator} 
 */
export function connectUserToRoom (user) {
  return {
    type: CR.CONNECT_USER_TO_ROOM,
    payload: user
  }
}

/**
 * @param {User} user
 * @returns {import ('redux').ActionCreator} 
 */
export function disconnectUserToRoom (user) {
  return {
    type: CR.DISCONNECT_USER_TO_ROOM,
    payload: user
  }
}


/**
 * 
 * @param {import ('twilio-video').Room} room
 * @returns {import ('redux').ActionCreator} 
 */
export function setRoomNetwork (room) {
  return {
    type: CR.SET_ROOM_NETWORK,
    payload: room
  }
}


/**
 * @param {import ('twilio-video').AudioTrack} track 
 * @returns {import ('redux').ActionCreator} 
 */
export function setAudioTrack (track) {
  return {
    type: PR.SET_AUDIO_TRACKS,
    payload: track
  }
}

/**
 * @param {import ('twilio-video').VideoTrack} track 
 * @returns {import ('redux').ActionCreator} 
 */
export function setVideoTrack (track) {
  return {
    type: PR.SET_VIDEO_TRACKS,
    payload: track
  }
}

/**
 * @param {import ('twilio-video').AudioTrack} track 
 * @returns {import ('redux').ActionCreator} 
 */
export function removeAudioTrack (track) {
  return {
    type: PR.REMOVE_AUDIO_TRACKS,
    payload: track
  }
}

/**
 * @param {import ('twilio-video').VideoTrack} track 
 * @returns {import ('redux').ActionCreator} 
 */
export function removeVideoTrack (track) {
  return {
    type: PR.REMOVE_VIDEO_TRACKS,
    payload: track
  }
}

/**
 * @param {import ('twilio-video').AudioTrack []} tracks 
 * @returns {import ('redux').ActionCreator} 
 */
export function setAudioTracksStream (tracks) {
  return {
    type: PR.SET_AUDIO_TRACKS_STREAM,
    payload: tracks
  }
}

/**
 * @param {import ('twilio-video').VideoTrack []} tracks 
 * @returns {import ('redux').ActionCreator} 
 */
export function setVideoTracksStream (tracks) {
  return {
    type: PR.SET_VIDEO_TRACKS_STREAM,
    payload: tracks
  }
}

/**
 * @param {import ('twilio-video').LocalVideoTrack} localVideoTrack
 * @returns {import ('redux').ActionCreator} 
 */
export function setLocalVideoTrack (localVideoTrack) {
  return {
    type: CR.SET_LOCAL_VIDEO_TRACK,
    payload: localVideoTrack
  }
}

/**
 * @param {import ('twilio-video').LocalAudioTrack} localAudioTrack
 * @returns {import ('redux').ActionCreator} 
 */
export function setLocalAudioTrack (localAudioTrack) {
  return {
    type: CR.SET_LOCAL_AUDIO_TRACK,
    payload: localAudioTrack
  }
}

/**
 * @param {boolean} state
 * @returns {import ('redux').ActionCreator} 
 */
export function setCameraState (state) {
  return {
    type: PR.SET_CAMERA_STATE,
    payload: state
  }
}


/**
 * @param {boolean} state
 * @returns {import ('redux').ActionCreator} 
 */
export function setMicrophoneState (state) {
  return {
    type: PR.SET_MICROPHONE_STATE,
    payload: state
  }
}

/**
 * @param {MediaDeviceInfo []} devices
 * @returns {import ('redux').ActionCreator}  
 */
export function setDevices (devices) {
  return {
    type: PR.SET_DEVICES,
    payload: devices
  }
}

/**
 * @param {MediaDeviceKind} device
 * @returns {import ('redux').ActionCreator}  
 */
export function setVideoInput (device) {
  return {
    type: PR.SET_VIDEO_DEVICE,
    payload: device
  }
}

/**
 * @param {MediaDeviceKind} device
 * @returns {import ('redux').ActionCreator}  
 */
export function setAudioInput (device) {
  return {
    type: PR.SET_AUDIO_DEVICE,
    payload: device
  }
}

/**
 * @param {boolean} state
 * @returns {import ('redux').ActionCreator}  
 */
export function setShareScreenState (state) {
  return {
    type: PR.SET_SHARESCREEN_STATE,
    payload: state
  }
}

/**
 * @param {User} user 
 * @returns {import ('redux').ActionCreator}  
 */
export function setRemoteIdentity (user) {
  try {
    return {
      type: PR.SET_REMOTE_IDENTITY, 
      payload: decode(user)
    }
  } catch {
    return {
      type: PR.SET_REMOTE_IDENTITY,
      payload: {
        imageUrl: null,
        firstName: 'Desconocido',
      }
    }
  }
}

/**
 * @param {{ kind: 'audio' | 'video'}} track 
 */
export function setDisabledTrack ({ kind }, identity) {
  return {
    type: CR.SET_REMOTE_TRACK_DISABLED,
    payload: {
      kind,
      identity
    }
  }
}

/**
 * @param {{ kind: 'audio' | 'video' }} track
 * @param {string} identity 
 */
export function setEnabledTrack ({ kind }, identity) {
  return {
    type: CR.SET_REMOTE_TRACK_ENABLED,
    payload: {
      kind,
      identity
    }
  }
}