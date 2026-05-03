import React, { memo } from 'react'
import classNames from 'clsx'
import 'assets/css/listening.css'

/**
 * Components.
 */
import RegExpIntercept from 'components/RegExpIntercept'
import BreaklineText from 'components/BreaklineText'
import Dropup from 'components/Dropup'
import DropdownItem from 'components/DropdownItem'
import Dynamic from 'components/Dynamic'
import Radio from 'components/Radio'
import Text from 'components/Text'

import useExamConsumer from 'hooks/useExamConsumer'

import { isModular, removeMatch } from 'utils/functions'

import { img } from 'assets/compat'
import styles from './styles.module.scss'
import AsyncComponent from 'components/AsyncComponent'
import AudioPlayer from 'components/AudioPlayer'
import {
  LISTENING,
  LISTENING_PART_1,
  LISTENING_PART_2,
  LISTENING_PART_3
} from 'constant/labels'
import { ModuleRegExp } from 'common/module.regexp'

export const Header = ({ description }) => (
  <Text bold center tag="h4">
    <img alt="listening" src={img.listening} lazy="true" />
    {description}
  </Text>
)

const Listening = () => {
  const { exercise } = useExamConsumer()

  switch (exercise.label) {
    case LISTENING:
      return <ListeningPartOne />

    case LISTENING_PART_1:
      return <ListeningPartOne />

    case LISTENING_PART_2:
      return <ListeningPartTwo />

    case LISTENING_PART_3:
      return <ListeningPartThree />

    default:
      return <React.Fragment />
  }
}

export default memo(Listening)

const defaultDynamicClassName = 'p-2'

const defaultInputControlled = ''
/**
 * @type {React.FunctionComponent<ListeningProps>}
 */
const ListeningPartTwo = ({ children }) => {
  const { data, selections, exercise, handleSelection, handleLevelSelection } =
    useExamConsumer()

  /**
   * @description
   * Connected means that "modules" are connected by each level.
   */
  const { context, connected } = isModular(exercise, data.level)

  /**
   * This functions takes information about user is writing/selecting.
   * @param {{}} userSelection
   */
  const handleDynamicChange = userSelection => {
    data.context
      ? handleLevelSelection(userSelection)
      : handleSelection(userSelection)
  }

  /**
   * If is presented by IELTS or Aptis will render something different.
   * @param {number} index
   */
  const getUserInput = index => {
    if (connected) {
      /**
       * @description
       * This is checking before render methods proof that data is ready to fill.
       */
      const moduleSelection = data.context && data.context[data.level]

      return moduleSelection
        ? moduleSelection.selections[index]
        : defaultInputControlled
    }

    return selections[index]
  }

  /**
   * @description
   * If module is present means that renders IELTS Context.
   */
  const descriptiveText =
    'module' in context
      ? removeMatch(context.heading)
      : removeMatch(context.title)

  return (
    <div className={styles.container}>
      <Text color="muted" tag="h3">
        {removeMatch(exercise.description)}{' '}
        <img
          alt="listening"
          src={img.listening}
          lazy="true"
          className="img-fluid"
          width={46}
        />
      </Text>
      {(context.title || context.heading) && (

        <BreaklineText
          bold
          color="blue"
          tag="h5" 
          value={descriptiveText}
        />
      )}
      {context.imageUrl && (
        <AsyncComponent resource={context.imageUrl}>
          <img
            className="img-fluid"
            lazy="true"
            alt="listening"
            src={context.imageUrl}
          />
        </AsyncComponent>
      )}
      <br />
      <div className={styles.padding}>
        {exercise.recordingUrl && <AudioPlayer url={exercise.recordingUrl} />}
        <hr />
      </div>
      {context.questions &&
        context.questions.map((question, index) => (
          <div className={styles.listening} key={question.title}>
            <div>
              {question.title && (
                <Text lighter tag="p" color="muted">
                  {removeMatch(question.title)}
                </Text>
              )}
            </div>
            <div>
              {data.context || context.module ? (
                <Dynamic
                  className={defaultDynamicClassName}
                  module={context.module}
                  onChangeForm={title =>
                    handleDynamicChange({
                      title,
                      index
                    })
                  }
                  onChangeDropdown={title =>
                    handleDynamicChange({
                      title,
                      index
                    })
                  }
                  value={getUserInput(index)}
                />
              ) : (
                <div className={styles.dropdown}>
                  <Dropup
                    className="btn btn-light border dropdown-style d-inline"
                    key={question.title}
                    name={selections[index]}
                    id={question.title}
                  >
                    {question.answers.map(title => (
                      <DropdownItem
                        color="black"
                        key={title}
                        onClick={() =>
                          handleSelection({
                            title,
                            index
                          })
                        }
                        value={title}
                      />
                    ))}
                  </Dropup>
                </div>
              )}
              <br />
              {children && children}
            </div>
          </div>
        ))}
    </div>
  )
}

const ListeningPartOne = () => {
  const { disabled, exercise, selection, handleSelection } = useExamConsumer()

  /**
   * @description
   * Change selection.
   * @returns {void}
   */
  const handleChange = (title, index) => {
    handleSelection({
      title,
      index,
      label: exercise.label
    })
  }

  return (
    <div className={styles.container}>
      {exercise.description && (
        <BreaklineText
          breaklineClassName="p-0 m-0"
          value={exercise.description}
          tag={exercise.description.length > 20 ? "h5" : "h4"}
          color="blue"
          renderContentOnFirstText={
            <img
              alt="listening"
              src={img.listening}
              className="img-fluid"
              width={46}
            />
          }
          dunkin
        />
      )}
      <br />
      {exercise.title && (
        <Text bold tag="h5" color="blue">
          {removeMatch(exercise.title)}
        </Text>
      )}
      <br />
      <div className={styles.flex}>
        {exercise.recordingUrl && (
          <div>
            <AudioPlayer url={exercise.recordingUrl} />
          </div>
        )}
        <hr />
        <RegExpIntercept
          expression={ModuleRegExp.intercept}
          value={exercise.title}
        >
          {exercise.answers.map((answer, index) => (
            <Radio
              key={answer}
              checked={answer === selection.title}
              disabled={disabled}
              onChange={element => handleChange(element.target.value, index)}
              type="radio"
              value={answer}
            >
              <Text lighter color="muted" tag="p">
                {removeMatch(answer)}
              </Text>
            </Radio>
          ))}
        </RegExpIntercept>
      </div>
    </div>
  )
}

const ListeningPartThree = () => {
  const { selections, disabled, exercise, handleSelection } = useExamConsumer()

  return (
    <div className={styles.container}>
      <Text color="muted" tag="h3">
        {removeMatch(exercise.description)}{' '}
        <img
          alt="listening"
          src={img.listening}
          className="img-fluid"
          width={46}
        />
      </Text>
      <br />
      <div className={styles.padding}>
        {exercise.recordingUrl && <AudioPlayer url={exercise.recordingUrl} />}
        <hr />
      </div>
      <br />
      {exercise.title && (
        <Text className={styles.padding} bold tag="h5" color="blue">
          {removeMatch(exercise.title)}
        </Text>
      )}
      <br />
      <div className={styles.radios}>
        {exercise.questions.map((question, index) => (
          <div className={classNames} key={question.title}>
            <Text bold tag="p" color="dark">
              {removeMatch(question.title)}
            </Text>
            <RegExpIntercept value={question.title} expression="{x}">
              {question.answers.map(answer => (
                <div key={answer}>
                  <Radio
                    checked={answer === selections[index]}
                    disabled={disabled}
                    type="radio"
                    value={answer}
                    onChange={() =>
                      handleSelection({
                        title: answer,
                        index: index
                      })
                    }
                  >
                    <Text lighter tag="span" color="muted">
                      {answer}
                    </Text>
                  </Radio>
                </div>
              ))}
            </RegExpIntercept>
          </div>
        ))}
      </div>
    </div>
  )
}
