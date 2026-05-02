import React, { memo, useEffect, useRef, useState } from 'react'
import Icon from 'react-icons-kit'
import { Button } from 'react-bootstrap'
import { ic_play_arrow } from 'react-icons-kit/md/ic_play_arrow'
import { ic_pause } from 'react-icons-kit/md/ic_pause'
import { microphoneSlash } from 'react-icons-kit/fa/microphoneSlash'
import { useTranslation } from 'react-i18next'
import classNames from 'clsx'

import useCounter from 'hooks/useCounter'

import FlexContainer from './FlexContainer'
import Stopwatch from './Stopwatch'
import Text from './Text'

import VoiceRecorder from 'assets/img/voice.png'
import { Animated } from 'react-animated-css'

/**
 * @typedef {Object} AudioRecorderProps
 * @property {boolean} controls
 * @property {boolean} disabled
 * @property {'audio/mpeg' | 'audio/wav'} format
 * @property {number} maxDuration
 * @property {() => Blob} onAudioCapture
 * @property {() => void} onAudioStart
 * @property {number} pushSnapshotBackground
 * @property {Audio} currentAudioSnapshot
 */

/**
 * @type {React.FunctionComponent<AudioRecorderProps>}
 */
const AudioRecorder = ({
  controls,
  currentAudioSnapshot,
  disabled,
  format,
  duration,
  onAudioCapture,
  onAudioStart,
  pushSnapshotBackground
}) => {
  const [, setStream] = useState(null)

  const [error, setError] = useState(null)

  const [recorder, setRecorder] = useState(null)

  const [recording, setRecording] = useState(null)

  const [playback, setPlayback] = useState(null)

  const snapshot = useCounter(0)

  const audioNodeRef = useRef(null)

  const { t } = useTranslation()

  /**
   * @description
   * Injecting the component the component when is mounted.
   * Answers for the navigator.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
   */
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleMediaStream)
      .catch(handleMediaError)
  }, [])

  useEffect(() => {
    snapshot.update.increment()
  }, [pushSnapshotBackground, snapshot.update])

  /**
   * @description
   * Handles the Promise of naviagtor.mediaDevices.
   * @param {MediaStream} stream
   * @returns {void} void
   */
  const handleMediaStream = stream => {
    const mediaRecorder = new MediaRecorder(stream)

    setStream(stream)

    setRecorder(mediaRecorder)
  }

  /**
   * @description
   * Catch the error of navigator.mediaDevices.
   * @param {any} err
   * @returns {void} void
   */
  const handleMediaError = err => {
    setError(err)
  }

  /**
   * @description
   * This function will record all input from the context of our recorder.
   * It dispatch a callback to the parent component @function onAudioStart() to indicates that it's been started.
   * Also, we keep our state safe, with setRecording.
   * And the end of the record we call @function onAudioCapture() that returns a @type Blob.
   */
  const handleMediaPlayback = () => {
    if (!recording && recorder.state === 'inactive') {
      onAudioStart()

      setRecording(true)

      snapshot.update.increment()

      audioNodeRef.current.pause()

      if (recorder !== null) {
        recorder.start()

        const chunks = []

        recorder.ondataavailable = function (e) {
          chunks.push(e.data)
          if (recorder.state === 'inactive') {
            const blob = new Blob(chunks, { type: format })

            const recordURI = URL.createObjectURL(blob)

            audioNodeRef.current.src = recordURI
            audioNodeRef.current.controls = true

            const reader = new FileReader()

            reader.onload = function (e) {
              onAudioCapture({
                url: recordURI,
                blob,
                result: e.target.result
              })
            }

            reader.readAsDataURL(blob)
          }
        }
      }
    }
  }

  /**
   * @description
   * Stops the current recording.
   * If the toast is been displayed.
   */
  const handleMediaStop = () => {
    if (recorder.state !== 'inactive') {
      recorder.stop()

      recording && setRecording(false)
    }

    audioNodeRef.current.pause()

    setPlayback(null)
  }

  /**
   * @function
   * Replays the current media.
   */
  const handleMediaPlay = () => {
    try {
      setPlayback(true)

      audioNodeRef.current.play()
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <React.Fragment>
      <FlexContainer>
        <Text center color="blue" bold tag="small">
          {t(
            recording ? 'COMPONENTS.RECORDER.stop' : 'COMPONENTS.RECORDER.play'
          )}
        </Text>
      </FlexContainer>
      <FlexContainer justifyContent="center">
        {error ? (
          <Text tag="small" color="muted">
            {t('COMPONENTS.RECORDER.unsync')}
            <Icon icon={microphoneSlash} className="icon" size={18} />
          </Text>
        ) : (
          <Button
            disabled={disabled}
            onClick={recording ? handleMediaStop : handleMediaPlayback}
            variant="transparent"
            size="sm"
          >
            <Animated
              animationIn="pulse"
              className={classNames(recording && 'infinite')}
            >
              <img alt="Press To Record" src={VoiceRecorder} />
            </Animated>
          </Button>
        )}
      </FlexContainer>
      <FlexContainer justifyContent="center">
        {recording && (
          <Stopwatch
            duration={duration}
            onTimeExceed={handleMediaStop}
            running={recording}
            snapshots={snapshot.count.value}
          />
        )}
      </FlexContainer>
      {controls && currentAudioSnapshot && (
        <FlexContainer justifyContent="center">
          <Icon
            className={classNames(
              playback ? 'icon-container-enabled' : 'icon-container-disabled',
              'hovered'
            )}
            icon={playback ? ic_pause : ic_play_arrow}
            onClick={playback ? handleMediaStop : handleMediaPlay}
            size={28}
          />
        </FlexContainer>
      )}
      <audio controls hidden ref={audioNodeRef} />
    </React.Fragment>
  )
}

AudioRecorder.defaultProps = {
  controls: true,
  onAudioStart: () => null,
  onAudioCapture: () => null,
  displayToast: false,
  maxDuration: 3000,
  format: 'audio/mpeg'
}

export default memo(AudioRecorder)
