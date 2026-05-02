import React, { memo, useReducer, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ToastsStore } from 'react-toasts'
import { useTranslation } from 'react-i18next'
import classNames from 'clsx'

import useExamConsumer from 'hooks/useExamConsumer'
import useCounter from 'hooks/useCounter'
import useModels from 'hooks/useModels'

import AudioRecorder from 'components/AudioRecorder'
import BreaklineText from 'components/BreaklineText'
import Text from 'components/Text'

import reducer, {
  initialState,
  audioCapture,
  setNext,
  setRecordingEnable
} from 'state/speakings'

import Microphone from 'assets/img/microphone.png'

import AudioPlayer from 'components/AudioPlayer'
import Stepper from './Stepper'

import styles from './speaking.module.scss'
import { getMaxDuration, removeMatch } from 'utils/functions'
import { ModuleRegExp } from 'common/module.regexp'

const Speaking = () => {
  const { t } = useTranslation()

  const { model } = useModels()

  const { disabled, exercise, handleRecording } = useExamConsumer()

  const { count, update, isReached } = useCounter(0, 0)

  const [state, dispatch] = useReducer(reducer, initialState)

  const question = exercise.questions[count.value] || {
    images: [],
    recordingUrl: null,
    title: ''
  }

  useEffect(() => {
    if (isReached) {
      ToastsStore.success(t('COMPONENTS.audioRecorder.completedRecords'))
    }
  }, [isReached, update, t])

  /**
   * @description
   * Updating the limit to questions size array.
   */
  useEffect(() => {
    const limit = exercise.questions.length || 0

    update.limit(limit)
  }, [exercise.questions, update])

  /**
   * @description
   * Restarting counter.
   */
  useEffect(() => {
    update.set(0)
  }, [exercise, update])

  const getImageMapping = ({ withoutValidate = false }) => {
    const literalJavaScriptObject = question.imageUrl.images

    if (withoutValidate) {
      return literalJavaScriptObject
    }

    return Array.isArray(literalJavaScriptObject)
  }

  const handleClickNext = () => {
    dispatch(setNext())

    update.increment()

    handleRecording(state.audio)

    const [audio] = document.getElementsByTagName('audio')

    try {
      audio.scrollIntoView()
    } catch (err) {
      console.warn(err)
    } finally {
      if (isReached) {
        update.set(0)
      }
    }
  }

  /**
   * @param {Blob} audio
   * Get the current audio recorded by the user.
   */
  const handleAudioEncoder = audio => {
    dispatch(audioCapture(audio))
  }

  /**
   * Starts recording the audio.
   */
  const handleRecord = () => {
    dispatch(setRecordingEnable())
  }

  return (
    <>
      <br />
      <Text dunkin color="blue" tag="h3">
        {model.name} Speaking{' '}
        <img alt="microphone" lazy="true" src={Microphone} width={40} />
      </Text>
      <hr />
      {exercise.description && (
        <BreaklineText
          color="blue"
          splitWithDiv
          value={exercise.description}
          tag="h5"
        />
      )}
      <Row className={styles.content}>
        <Col md={4}>
          <br />
          {question &&
            (question.title.match(ModuleRegExp.space) ? (
              <>
                <BreaklineText
                  color="blue"
                  tag="small"
                  value={removeMatch(question.title)}
                />
                <br />
              </>
            ) : (
              <Text color="blue" lighter tag="p">
                {removeMatch(question.title)}
              </Text>
            ))}
          {question && question.title.match(ModuleRegExp.space) && <br />}
          <div className="d-flex flex-column justify-content-center">
            {question.recordingUrl && (
              <>
                <div className={styles.padding}>
                  <AudioPlayer url={question.recordingUrl} />
                </div>
              </>
            )}
            <br />
            {question.imageUrl &&
              (getImageMapping({ withoutValidate: false }) ? (
                getImageMapping({ withoutValidate: true }).map(image => (
                  <img
                    alt={image}
                    className={classNames('img-fluid', 'rounded', styles.image)}
                    key={image}
                    src={image}
                    width={380}
                  />
                ))
              ) : (
                <img alt="question" src={question.imageUrl.images} />
              ))}
            <br />
            <Text lighter center tag="small" color="blue">
              {t('COMPONENTS.audioRecorder.recordToContinue')}
            </Text>
            <Stepper
              disabled={state.isRecording || state.audio === null}
              step={count.value}
              steps={exercise.questions}
              onNext={handleClickNext}
            />
          </div>
          <br />
        </Col>
        <Col
          md={8}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <div className={styles.circle}>
            <AudioRecorder
              controls={isReached === false}
              duration={getMaxDuration(exercise.recordingTime)}
              onAudioCapture={handleAudioEncoder}
              onAudioStart={handleRecord}
              format="audio/mpeg"
              disabled={disabled || isReached}
              pushSnapshotBackground={count.value}
              currentAudioSnapshot={state.audio}
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default memo(Speaking)
