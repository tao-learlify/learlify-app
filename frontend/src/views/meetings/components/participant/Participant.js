import React, {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useContext,
  useMemo
} from 'react'
import { Button } from 'components/ui'
import { ToastsStore } from 'react-toasts'
import { Icon } from 'react-icons-kit'
import { ic_more_vert } from 'react-icons-kit/md/ic_more_vert'
import { microphone } from 'react-icons-kit/fa/microphone'
import { videoCamera } from 'react-icons-kit/fa/videoCamera'

import {
  VideoContainer,
  Video,
  NameText,
  SettingsIconContainer,
  VideoChatOptionsContainer,
  VideoChatOptions
} from './styles'

import useAuthProvider from 'hooks/useAuthProvider'
import useFullScreen from 'hooks/useFullscreen'
import useShareScreen from 'hooks/useShareScreen'
import useToggler from 'hooks/useToggler'

import Animate from 'components/Animate'
import Avatar from 'components/Avatar'
import Controls from './Controls'
import Dropdown from 'components/Dropdown'
import FlexContainer from 'components/FlexContainer'
import DropdownItem from 'components/DropdownItem'
import Menu from './Menu'
import ModalDialog from 'components/ModalDialog'
import Text from 'components/Text'
import Devices from './Devices'

import {
  TRACK_PUBLISHED,
  TRACK_SUBSCRIBED,
  TRACK_UNSUBSCRIBED
} from '../actions/twilio'

import {
  setAudioTrack,
  setVideoTrack,
  removeAudioTrack,
  removeVideoTrack,
  setAudioTracksStream,
  setVideoTracksStream,
  setMicrophoneState,
  setCameraState,
  setDevices,
  setVideoInput,
  setAudioInput,
  setShareScreenState,
  setRemoteIdentity
} from '../actions'

import participantReducer, { initialState } from '../reducer/participant'
import {
  audioDevice,
  videoDevice,
  removePredicateNullValues
} from 'utils/functions'
import httpClient from 'utils/httpClient'

import { ClassContext } from '../classRoom/ClassRoom'
import { LocalTracksContext } from 'store/context'
import { InputDivisor } from '../chat/styles'
import MaleImage from 'assets/illustrations/pandas/panda.svg'

const TRACK = {
  audio: 'audio',
  video: 'video'
}

/**
 * @typedef {Object} ParticipantProps
 * @property {boolean} controls
 * @property {import ('twilio-video').Participant} data
 * @property {string []} mutedRemotedMicrophonesIdentities
 * @property {string []} mutedRemotedCamerasIdentities
 */

/**
 * @type {React.FunctionComponent<ParticipantProps>}
 */
const Participant = ({ controls, data, token, ...props }) => {

  const user = useAuthProvider()

  const room = useContext(ClassContext)

  const media = useContext(LocalTracksContext)

  const [fullScreen, toggleFullScreen] = useFullScreen()

  const [state, dispatch] = useReducer(participantReducer, initialState)

  /**
   * @type {React.MutableRefObject<HTMLAudioElement>}
   */
  const audioRef = useRef()

  /**
   * @type {React.MutableRefObject<HTMLVideoElement>}
   */
  const videoRef = useRef()

  const [menu, setMenu] = useToggler()

  const [modal, setModal] = useToggler()

  const shareScreen = useShareScreen()

  /**
   * @param {Map<{}, {}>} trackMap
   * @returns {import ('twilio-video').Track []}
   */
  const trackStreaming = trackMap => {
    const context = trackMap.values()

    return Array.from(context)
      .map(publication => publication.track)
      .filter(removePredicateNullValues)
  }
  /**
   * we'll add two functions that will run either when a track is added or removed from the participant.
   * These functions both check whether the track is an audio or video track and then add or remove
   * it from the state using the relevant state function.
   * @param {import ('twilio-video').Track} track
   */
  const trackSubscribed = track => {
    if (track.kind === TRACK.video) {
      return dispatch(setVideoTrack(track))
    }

    if (track.kind === TRACK.audio) {
      return dispatch(setAudioTrack(track))
    }
  }

  /**
   * @param {import ('twilio-video').Track} track
   */
  const trackUnsubscribed = track => {
    if (track.kind === TRACK.video) {
      return dispatch(removeVideoTrack(track))
    }

    return dispatch(removeAudioTrack(track))
  }

  useEffect(() => {
    dispatch(setAudioTracksStream(trackStreaming(data.audioTracks)))
    dispatch(setVideoTracksStream(trackStreaming(data.videoTracks)))

    data.on(TRACK_SUBSCRIBED, trackSubscribed)

    data.on(TRACK_UNSUBSCRIBED, trackUnsubscribed)

    data.on(TRACK_PUBLISHED, () => {
      dispatch(setAudioTracksStream(trackStreaming(data.audioTracks)))
      dispatch(setVideoTracksStream(trackStreaming(data.videoTracks)))
    })

    return () => {
      dispatch(setAudioTracksStream([]))
      dispatch(setVideoTracksStream([]))

      data.removeAllListeners()
    }
  }, [data])

  useEffect(() => {
    const [audioTrack] = state.audioTracks

    if (audioTrack) {
      audioTrack.attach(audioRef.current)

      return () => {
        audioTrack.detach()
      }
    }
  }, [state.audioTracks])

  useEffect(() => {
    const [videoTrack, screenShareTrack] = state.videoTracks
    if (screenShareTrack) {
      screenShareTrack.attach(videoRef.current)

      return () => {
        if (screenShareTrack) {
          return screenShareTrack.detach()
        }
      }
    }

    if (videoTrack) {
      videoTrack.attach(videoRef.current)

      return () => {
        videoTrack.detach()
      }
    }
  }, [state.videoTracks])

  /**
   * @description
   * Indicating when share screen is up/off.
   */
  useEffect(() => {
    console.info('ping', { fullScreen: Boolean(fullScreen) })
  }, [fullScreen])

  useEffect(() => {
    if (data.identity) {
      httpClient({
        endpoint: '/api/v1/meetings/identity',
        requiresAuth: true,
        method: 'GET',
        queries: {
          email: data.identity,
          room: token
        }
      })
        .then(({ response: user }) => dispatch(setRemoteIdentity(user)))
        .catch(console.warn)
    }
  }, [data, token])

  /**
   * @description
   * When share screen is up we will get track and publish to make a stream through room.
   */
  useEffect(() => {
    const shareScreenVideo = videoRef.current

    const shareScreenTrack = shareScreen.shareScreenTrack

    const shareScreenMode = async () => {
      try {
        const { localParticipant } = room

        await localParticipant.publishTrack(shareScreenTrack)

        dispatch(setShareScreenState())

        shareScreenTrack.attach(shareScreenVideo)

        shareScreenTrack.mediaStreamTrack.onended = async function () {
          try {
            await localParticipant.unpublishTrack(shareScreenTrack)

            /**
             * @description
             * LocalTrack unmounting.
             */
            shareScreenTrack.detach()
            /**
             * @description
             * Unmount from UI through bidirectional communication with Twilio API.
             */
            dispatch(removeVideoTrack(shareScreenTrack))
          } catch (err) {
            ToastsStore.error(err)
          } finally {
            dispatch(setShareScreenState())
          }
        }
      } catch (err) {
        ToastsStore.error('No se puede compartir pantalla en este dispositivo')
      }
    }

    if (shareScreenTrack) {
      shareScreenMode()
    }
  }, [shareScreen.shareScreenTrack, room])

  /**
   * @description
   * Turn off/on camera on remote participant.
   */
  const handleCameraState = () => {
    data.videoTracks.forEach(({ track }) => {
      if (state.camera) {
        track.disable()
      } else {
        track.enable()
      }
    })

    /**
     * @description
     * No arguments toggles the current state.
     */
    dispatch(setCameraState())
  }

  /**
   * @description
   * Switch the current state of participant microphone.
   * if 'controls' mean that is the owner of it's own microphone.
   * So if it's not you're muting one person.
   */
  const handleMicrophoneState = () => {
    data.audioTracks.forEach(({ track }) => {
      if (state.microphone) {
        track.disable()
      } else {
        track.enable()
      }
    })

    audioRef.current.muted = !state.microphone

    dispatch(setMicrophoneState())
  }

  const settings = useMemo(
    () => ({
      camera: state.camera,
      microphone: state.microphone
    }),
    [state.camera, state.microphone]
  )

  const handleSetMenuOptions = () => {
    setMenu(true)
  }

  /**
   * @description
   * Sets full screen of the current ref.
   * @see https://www.npmjs.com/package/use-fullscreen
   */
  const onFullScreenMode = () => {
    toggleFullScreen(videoRef.current)

    setMenu(false)
  }

  /**
   * @description
   * Get all media devices from a participant.
   * All input devices, like audio and videos.
   */
  const onConfigurationMode = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      setModal(true)

      dispatch(setDevices(devices))
    } catch (err) {
      ToastsStore.warning('Ha ocurrido un problema con la configuración')
    } finally {
      setMenu(false)
    }
  }

  const onChangeVideoInput = useCallback(
    /**
     * @param {MediaDeviceInfo} videoInput
     */
    videoInput => {
      dispatch(setVideoInput(videoInput))
    },
    []
  )

  const onChangeAudioInput = useCallback(
    /**
     * @param {MediaDeviceInfo} audioInput
     */
    audioInput => {
      dispatch(setAudioInput(audioInput))
    },
    []
  )

  /**
   * @description
   * Apply changes with input devices selected.
   * @requires localMediaContext
   */
  const onApplyChanges = async () => {
    try {
      const localTimeExpiration = 4000

      const { audioDevice, videoDevice } = state.stageds

      const { localVideoTrack, localAudioTrack } = media

      await localAudioTrack.restart({
        deviceId: {
          exact: audioDevice.deviceId
        }
      })

      await localVideoTrack.restart({
        deviceId: {
          exact: videoDevice.deviceId
        }
      })

      ToastsStore.success(`Conectado ${audioDevice.label}`, localTimeExpiration)
      ToastsStore.success(`Conectado ${videoDevice.label}`, localTimeExpiration)
    } catch (err) {
      console.warn(err)

      ToastsStore.error('No se pudo aplicar la configuración')
    } finally {
      setModal()
    }
  }

  const onShowOffMenu = () => {
    if (menu) {
      setMenu()
    }
  }

  const handleMediaScreen = async () => {
    await shareScreen.getMediaStreamTrack()
  }


  /**
   * @description
   * Gets all muted microphones and cameras.
   */
  const remoteSettings = useMemo(
    () => ({
      microphone: !props.mutedRemotedMicrophonesIdentities.includes(
        data.identity
      ),
      camera: !props.mutedRemotedCamerasIdentities.includes(data.identity)
    }),
    [
      data.identity,
      props.mutedRemotedCamerasIdentities,
      props.mutedRemotedMicrophonesIdentities
    ]
  )

  return (
    <React.Fragment>
      <Animate>
        <VideoContainer>
          <Video
            autoPlay
            ref={videoRef}
            onClick={onShowOffMenu}
            isSharing={state.screenShare || !controls}
          />
          <SettingsIconContainer onClick={handleSetMenuOptions}>
            <Icon size={20} icon={ic_more_vert} />
          </SettingsIconContainer>
          <Menu
            controls={controls}
            status={menu}
            handleFullScreen={onFullScreenMode}
            handleConfiguration={onConfigurationMode}
          />
          {/** @description Only applies identity in case that's a remote participant. */}
          {controls ? (
            <NameText>
              &nbsp;
              {user.profile.firstName}
              &nbsp;
              <Avatar
                src={user.profile.imageUrl ? user.profile.imageUrl : MaleImage}
              />
              <Devices settings={settings} />
            </NameText>
          ) : (
            state.identity && (
              <NameText>
                &nbsp;
                {state.identity.firstName}
                &nbsp;
                <Avatar
                  src={
                    state.identity.imageUrl
                      ? state.identity.imageUrl
                      : MaleImage
                  }
                />
                <Devices settings={remoteSettings} />
              </NameText>
            )
          )}
          <VideoChatOptionsContainer>
            <VideoChatOptions>
              {controls && (
                <Controls
                  handleCamera={handleCameraState}
                  handleMicrophone={handleMicrophoneState}
                  handleMediaScreenShare={handleMediaScreen}
                  settings={settings}
                />
              )}
            </VideoChatOptions>
          </VideoChatOptionsContainer>
        </VideoContainer>
        <audio ref={audioRef} autoPlay />
      </Animate>
      <ModalDialog
        className="bg-dark"
        enabled={modal}
        textHeader="Configuración de dispositivos"
        onCloseRequest={setModal}
      >
        <Text center tag="p" color="light">
          Ajustes de Voz <Icon className="text-info" icon={microphone} />
        </Text>
        {state.stageds.audioDevice && (
          <FlexContainer>
            <Dropdown name={state.stageds.audioDevice.label}>
              {state.devices.filter(audioDevice).map((device, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => onChangeAudioInput(device)}
                  value={device.label}
                />
              ))}
            </Dropdown>
          </FlexContainer>
        )}
        <InputDivisor />
        <Text center tag="p" color="light">
          Ajustes de Vídeo <Icon className="text-info" icon={videoCamera} />
        </Text>
        {state.stageds.videoDevice && (
          <FlexContainer>
            <Dropdown name={state.stageds.videoDevice.label}>
              {state.devices.filter(videoDevice).map((device, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => onChangeVideoInput(device)}
                  value={device.label}
                />
              ))}
            </Dropdown>
          </FlexContainer>
        )}
        <br />
        <FlexContainer>
          <Button size="sm" variant="info" onClick={onApplyChanges}>
            Aplicar Cambios
          </Button>
        </FlexContainer>
      </ModalDialog>
    </React.Fragment>
  )
}

/**
 * @description
 * All remoteMicrophones insides array are muted.
 * All remoteCameras inside array
 */
Participant.defaultProps = {
  data: {},
  mutedRemotedCamerasIdentities: [],
  mutedRemotedMicrophonesIdentities: []
}

export default memo(Participant)
