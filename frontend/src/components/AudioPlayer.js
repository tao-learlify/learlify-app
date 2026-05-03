import React, { memo, useRef, useReducer } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Button } from 'components/ui'
import Icon from 'react-icons-kit'
import classNames from 'clsx'

import Text from './Text'

import { play } from 'react-icons-kit/fa/play'
import { volumeUp } from 'react-icons-kit/fa/volumeUp'
import { volumeOff } from 'react-icons-kit/fa/volumeOff'
import { ic_pause } from 'react-icons-kit/md/ic_pause'

import reducer, {
  initialState,
  endPlayingRecord,
  setMaxDuration,
  setTimerAndProgress,
  togglePlayerState,
  toggleControlsState
} from 'state/audioplayer'

import 'assets/css/audioplayer.css'

export const audioPlayerClassName = 'text-center my-3 align-self-center'

const AudioPlayer = ({ url, defaultStyles }) => {
  const audioRef = useRef(null)

  const [state, dispatch] = useReducer(reducer, initialState)

  /**
   * @description
   * Triggers on audio changes.
   */
  const handleChange = ({ target: { currentTime, duration } }) => {
    dispatch(
      setTimerAndProgress({
        currentTime,
        duration
      })
    )
  }

  /**
   * @description
   * Enable/disable playing state.
   */
  const switchPlayerState = () => dispatch(togglePlayerState())

  /**
   * @description
   * Clicking on play audio will resume/play the current nodeRef.
   */
  const handlePlay = () => {
    try {
      state.isPlaying ? audioRef.current.pause() : audioRef.current.play()
    } catch (err) {
      console.log(err)
    } finally {
      switchPlayerState()
    }
  }

  /**
   * Capturing the metadata as content.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
   */
  const handleMetadata = data => {
    dispatch(setMaxDuration(data.target.duration))
  }

  /**
   * @description
   * Open/hides manipulation of volume.
   */
  const switchControls = () => {
    dispatch(toggleControlsState())
  }
  /**
   * @description
   * On volume ref changes, we assign it to the node REF.
   */
  const handleVolumeChange = ({ target: { value } }) => {
    const volumeInteger = Number.parseInt(value)

    audioRef.current.volume = volumeInteger / 100
  }

  /**
   * @function handleEndedAudio
   * Reset the state from the currentTimer.
   * Reset the state from the progress.
   * Reset the state of "is" playing.
   */
  const handleEndedAudio = () => {
    dispatch(endPlayingRecord())
  }

  return (
    <Row className={classNames(defaultStyles && 'audio-player')}>
      <audio
        onEnded={handleEndedAudio}
        onTimeUpdate={handleChange}
        onLoadedMetadata={handleMetadata}
        preload="metadata"
        ref={audioRef}
        src={url}
      />

      <Col xs={2} className="play-btn">
        <Button block variant="link">
          <Icon
            size={state.isPlaying ? 24 : 20}
            icon={state.isPlaying ? ic_pause : play}
            onClick={handlePlay}
          ></Icon>
        </Button>
      </Col>

      <Col xs={8} className="controls">
        <Text tag="span">{state.currentTimer}</Text>
        <div className="control-slider slider" data-direction="horizontal">
          <div className="control-progress gap-progress">
            <div
              className="pin pin-progress"
              style={isNaN(state.progress.right) ? {} : state.progress}
            />
          </div>
        </div>
        <Text tag="span">{state.maxDuration}</Text>
      </Col>

      <Col xs={2} className="volume">
        <div className="volume-btn">
          <Icon
            icon={state.controls ? volumeOff : volumeUp}
            size={25}
            onClick={switchControls}
          />
        </div>
        <div
          className={
            state.controls
              ? 'volume-controls animated fadeIn'
              : 'volume-controls hidden'
          }
        >
          <div className="volume-slider slider">
            <input
              onChange={handleVolumeChange}
              className="volume-set"
              orient="vertical"
              type="range"
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      </Col>
    </Row>
  )
}

AudioPlayer.defaultProps = {
  defaultStyles: true,
  url: ''
}

AudioPlayer.propTypes = {
  url: PropTypes.string.isRequired
}

export default memo(AudioPlayer)
