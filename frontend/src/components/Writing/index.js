import React, { memo, useCallback } from 'react'
import classNames from 'clsx'
import TextAreaAutoSize from 'react-textarea-autosize'
import { ModuleRegExp } from 'common/module.regexp'
import { Element } from 'react-scroll'

import useExamConsumer from 'hooks/useExamConsumer'
import useScroll from 'hooks/useScroll'

import AsyncComponent from 'components/AsyncComponent'
import BreaklineText from 'components/BreaklineText'
import Flex from 'components/FlexContainer'
import RegExpIntercept from 'components/RegExpIntercept'
import Text from 'components/Text'

import {
  getLengthWithoutFalsyValues,
  getHighNumberOf,
  removeInterceptableText
} from 'utils/functions'
import { WRITING_PART_4 } from 'constant/labels'

import styles from './styles.module.scss'
import { img } from 'assets/img'



/**
 * @type {React.FunctionComponent<WritingProps>}
 */
const Writing = () => {
  const scroll = useScroll('animateScroll')

  const { disabled, exercise, selections, handleSelection } = useExamConsumer()

  const { description, imageUrl, questions } = exercise

  const handleChange = useCallback(
    /**
     * @param {Selection} values
     */
    ({ title, index, question }) => {
      /**
       * @description
       * This functions works getting the current value without spaces.
       */
      const wordsLength = getLengthWithoutFalsyValues(title)

      /**
       * @description
       * If this exercise is the last part should work based on the title and not description.
       */
      const sizeOfWords =
        exercise.label === WRITING_PART_4
          ? getHighNumberOf(question)
          : getHighNumberOf(exercise.description)

      if (wordsLength <= sizeOfWords) {
        handleSelection({
          title,
          index
        })
      }
    },
    [handleSelection, exercise]
  )

  /**
   * @param {React.EventHandler<HTMLButtonElement>} event
   */
  const handleClickTextArea = event => {
    try {
      /**
       * @type {number}
       */
      const positionElement = event.target.getBoundingClientRect().top

      /**
       * If disabled is not present we will scroll.
       */
      disabled ||
        scroll(positionElement, {
          delay: 100,
          duration: 1200,
          smooth: true,
          offset: -40
        })
    } catch (err) {
      console.warn('Compatibilty Issues', err)
    }
  }
  return (
    <div className={styles.padding}>
      <br />
      <BreaklineText
        dunkin
        center
        color="blue"
        breaklineClassName="m-0 p-0"
        splitWithDiv
        tag="p"
        value={description}
        renderContentOnFirstText={ <img alt="writing" src={img.writing} width={40} /> }
      />
      <hr />
      {imageUrl && (
        <Flex>
          <AsyncComponent resource={imageUrl}>
            <img
              alt="writing"
              className="rounded border img-fluid"
              lazy="true"
              src={imageUrl}
              width={720}
            />
          </AsyncComponent>
        </Flex>
      )}
      <br />
      {questions.map((question, index) => (
        <RegExpIntercept
          key={question.title}
          value={question.title}
          expression={ModuleRegExp.intercept}
        >
          <div className={styles.about}>
            <Text lighter tag="p" color="dark">
              {removeInterceptableText(question.title)}
            </Text>
          </div>
          <Element name={question.title}>
            <div className={styles.textarea}>
              <TextAreaAutoSize
                placeholder="....."
                className={classNames('form-control')}
                disabled={disabled}
                name={question.title}
                minRows={2}
                maxRows={8}
                onChange={({ target: { value: title } }) =>
                  handleChange({
                    title,
                    index,
                    question: question.title
                  })
                }
                onClick={handleClickTextArea}
                value={selections[index]}
              />
            </div>
          </Element>
          <div className={styles.text}>
            <Text lighter tag="p" color="blue">
              ({getLengthWithoutFalsyValues(selections[index])}/
              {getHighNumberOf(
                exercise.label === WRITING_PART_4 ? question.title : description
              )})
            </Text>
          </div>
        </RegExpIntercept>
      ))}
    </div>
  )
}

Writing.defaultProps = {
  questions: [],
  selections: []
}

export default memo(Writing)
