/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  createContext,
  useReducer,
  useEffect,
  useState,
  useMemo
} from 'react'
import Video from 'twilio-video'
import { Icon } from 'react-icons-kit'
import { clockO } from 'react-icons-kit/fa/clockO'
import { ReactSVG } from 'react-svg'


import useSounds from 'hooks/useSounds'
import classRoomReducer, { initialState } from '../reducer/classroom'

import * as TWILIO_EVENT from '../actions/twilio'

import Participant from '../participant/Participant'
import MediaStreamError from './MediaStreamError'
import { LocalTracksContext } from 'store/context'

import {
  ClassRoomWrapper,
  UsersContainer,
  ParticipantContainer,
  ImageContainer,
  WaitingUser
} from './styles'


import {
  connectUserToRoom,
  disconnectUserToRoom,
  setRoomNetwork,
  setLocalAudioTrack,
  setLocalVideoTrack,
  setDisabledTrack,
  setEnabledTrack
} from '../actions'


import useQuery from 'hooks/useQuery'
import useSVG from 'hooks/useSVG'
import { svg } from 'assets/compat'


/**
 * @type {React.Context<import ('twilio-video').Room>}
 */
export const ClassContext = createContext(null)

/**
 * @typedef {Object} ClassRoomProps
 * @property {string} token
 * @property {string} name
 */

/**
 * @type {React.FunctionComponent<ClassRoomProps>}
 */
const ClassRoom = ({ name, token }) => {
  const svgCallback = useSVG({
    attributes: [
      ['height', 140]
    ]
  })

  const query = useQuery()

  const [state, dispatch] = useReducer(classRoomReducer, initialState)

  const [mediaStream, setMediaStream] = useState({
    stackTrace: null,
    connected: true
  })

  const sounds = useSounds()

  const refConnection = () => {
    if ('mediaDevices' in navigator) {
      const permissions = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
          })

          if (mediaStream.stackTrace) {
            setMediaStream({
              stackTrace: null,
              connected: true
            })
          }
        } catch (err) {
          setMediaStream({
            stackTrace: err.name,
            connected: false
          })
        } 
      }

      permissions()
    }

    /**
     * @typedef {Object} LocalTracks
     * @property {import ('twilio-video').LocalAudioTrack} localAudioTrack
     * @property {import ('twilio-video').LocalVideoTrack} localVideoTrack
     * @see https://media.twiliocdn.com/sdk/js/video/releases/2.0.0-beta15/docs/module-twilio-video.LocalVideoTrack.html
     * @returns {Promise<LocalTracks>}
     */
    const getLocalTracks = async () => {
      try {
        const localAudioTrack = await new Video.createLocalAudioTrack()

        const localVideoTrack = await new Video.createLocalVideoTrack()

        dispatch(setLocalAudioTrack(localAudioTrack))
        dispatch(setLocalVideoTrack(localVideoTrack))

        return {
          localAudioTrack,
          localVideoTrack
        }
      } catch (err) {
        setMediaStream({
          stackTrace: err.name,
          connected: false
        })

        return {
          error: true
        }
      }
    }


    getLocalTracks().then(track => {
      if (track.error) {
        setMediaStream({
          stackTrace: null,
          connected: false
        })
      }

      Video.connect(token, {
        dominantSpeaker: true,
        maxAudioBitrate: 16000,
        name,
        tracks: [track.localAudioTrack, track.localVideoTrack],
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        },
        video: true,
        insights: false,
        networkQuality: {
          local: 1,
          remote: 1
        }
      })
        .then(room => {
          dispatch(setRoomNetwork(room))

          room.on(
            TWILIO_EVENT.CONNECT_USER,
            /**
             * @param {import ('twilio-video').Participant} participant
             */
            participant => {
              sounds.play('notification', { volume: 0.7 })

              dispatch(connectUserToRoom(participant))
            }
          )

          room.on(
            TWILIO_EVENT.DISCONNECT_USER,
            /**
             * @param {import ('twilio-video').Participant} participant
             */
            participant => {
              sounds.play('notification', { volume: 0.7 })

              dispatch(disconnectUserToRoom(participant))
            }
          )

          room.participants.forEach(
            /**
             * @param {import ('twilio-video').RemoteParticipant} participant
             */
            participant => {
            dispatch(connectUserToRoom(participant))

            /**
             * @description
             * Detect when a remote participant disables a track.
             * @see https://www.twilio.com/docs/video/using-datatrack-api
             * @requires RemoteTrack
             */
            participant.on(TWILIO_EVENT.TRACK_DISABLED, (track) => {
              dispatch(setDisabledTrack(track, participant.identity))
            })

            /**
             * @description
             * Detect when a remote participant enables a track.
             * @requires RemoteTrack
             */
            participant.on(TWILIO_EVENT.TRACK_ENABLED, (track) => {
              dispatch(setEnabledTrack(track, participant.identity))
            })
          })
        })
        .catch(err => {
          setMediaStream({
            stackTrace: err.name,
            connected: false
          })
        })
    })

    /**
     * @description
     * Clean up when the participant leaves the room.
     */
    return () => {
      /**
       * @type {import ('twilio-video').Room}
       */
      const room = state.room

      if (room && room.localParticipant.state === 'connected') {
        room.localParticipant.tracks.forEach(trackPublication => {
          trackPublication.track.stop()
        })

        room.disconnect()

        dispatch(setRoomNetwork(null))
      } else {
        dispatch(setRoomNetwork(room))
      }
    }
  }

  useEffect(refConnection, [token, name, state.tracks])

  const localTrackContext = useMemo(
    () => ({
      localAudioTrack: state.localAudioTrack,
      localVideoTrack: state.localVideoTrack,
    }),
    [state.localAudioTrack, state.localVideoTrack]
  )
  


  return (
    <ClassContext.Provider value={state.room}>
      {mediaStream.stackTrace ? (
        <MediaStreamError />
      ) : (
        state.room && (
          <>
            <ClassRoomWrapper>
              <UsersContainer>
                {state.users.length > 0 ? (
                  state.users.map(participant => (
                    <ParticipantContainer key={participant.sid}>
                      <Participant 
                        controls={false}
                        data={participant}
                        mutedRemotedMicrophonesIdentities={state.remoteTracks.audio}
                        mutedRemotedCamerasIdentities={state.remoteTracks.video}
                        token={query.token}
                      />
                    </ParticipantContainer>
                  ))
                ) : (
                  <WaitingUser>
                    <ImageContainer>
                    <ReactSVG beforeInjection={svgCallback} src={svg.waiting} />
                    </ImageContainer>
                    <React.Fragment>
                      <Icon size={32} icon={clockO} /> Esperando a los demás
                    </React.Fragment>
                    <br />
                  </WaitingUser>
                )}
              </UsersContainer>
              <ParticipantContainer>
                <LocalTracksContext.Provider value={localTrackContext}>
                  <Participant
                    controls
                    data={state.room.localParticipant}
                    key={state.room.localParticipant.id}
                    token={query.token}
                  />
                </LocalTracksContext.Provider>
              </ParticipantContainer>
            </ClassRoomWrapper>
          </>
        )
      )}
    </ClassContext.Provider>
  )
}

export default memo(ClassRoom)
