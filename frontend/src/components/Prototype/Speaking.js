import React, { useRef } from 'react'
import Icon from 'react-icons-kit'
import classNames from 'clsx'
import { volumeUp } from 'react-icons-kit/fa/volumeUp'

import config from 'config'
import useToggler from 'hooks/useToggler'

import Emoji from 'components/Emoji'
import BreaklineText from 'components/BreaklineText'
import Text from 'components/Text'

import styles from 'views/evaluations/components/viewer.module.scss'
import { removeMatch } from 'utils/functions'
import ModalDialog from 'components/ModalDialog'

const SpeakingReview = ({ feedback, questions, description, latest }) => {
  const ref = useRef([])

  const [viewImages, setViewImages] = useToggler()
  /**
   * @param {{ recordingUrl: string }}
   */
  const handleClickAudio = async ({ index }) => {
    if (latest) {
      const audio = new Audio(
        `${config.CLOUDFRONT}${feedback[index].recordingUrl}`
      )

      return audio.play()
    }

    const ref = config.CLOUDFRONT.concat(
      'speakings/',
      encodeURIComponent(feedback[index].key)
    )

    const audio = new Audio(ref)

    audio.play()
  }


  return (
    <>
      <div className={styles.viewer}>
        {description && (
          <BreaklineText
            lighter
            matchTextClassName="p-0 m-0"
            center
            color="muted"
            value={description}
            splitWithDiv
            tag="h5"
          />
        )}
        <div>
          {Array.isArray(questions) &&
            questions &&
            questions.map((question, index) => (
              <React.Fragment key={question.title}>
                <Text bold className={styles.question} color="blue" tag="p">
                  {question.recordingUrl && (
                    <Icon
                      size={24}
                      className={classNames('text-blue', styles.icon)}
                      icon={volumeUp}
                    />
                  )}
                  {removeMatch(question.title)}
                </Text>
                <div className={styles.media}>
                  <React.Fragment>
                    <div
                      className="hovered"
                      onClick={() => handleClickAudio({ index })}
                    >
                      <Emoji className={styles.emoji} name="Wav" />
                      <Emoji className={styles.emoji} name="Play" />
                      <Text bold color="blue" tag="small">
                        Reproducir respuesta
                      </Text>
                    </div>
                  </React.Fragment>
                </div>
              </React.Fragment>
            ))}
        </div>
      </div>
      <ModalDialog
        enabled={viewImages}
        onCloseRequest={setViewImages}
        textHeader="Imagenes"
      >
        {viewImages &&
          ref.current.map(image => (
            <img
              alt="img"
              className={classNames('border', 'rounded', 'img-fluid')}
              src={image}
              key={image}
            />
          ))}
      </ModalDialog>
    </>
  )
}

export default SpeakingReview
