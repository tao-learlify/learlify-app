import React, { memo, useCallback } from 'react'
import Animate from './Animate'
import lang from 'lang'

import TableRow from 'components/TableRow'
import Management from './Management'
import TableHeader from './TableHeader'
import Text from './Text'
import FlexContainer from './FlexContainer'

import animations from 'utils/animations'

import { img } from 'assets/compat'

export const review = ['Opción', 'Evaluación', 'Correcta']

/**
 * @typedef {Object} ReviewProps
 * @property {boolean} render
 * @property {boolean} examRenderingContent
 * @property {{ feedback: boolean, value: string} []} feedback
 * @property {Question []} questions
 * @property {boolean} matchThroughChaining
 */

/**
 * @type {React.FunctionComponent<ReviewProps>}
 */
const Review = ({ feedback, render, questions, examRenderingContent }) => {
  const getInstantFeedback = useCallback(
    /**
     * @param {number} idx
     */
    (idx, data) => {
      if (data.match) {
        return data.match
      }

      const { answers: picks, correct, isCorrect } = questions[idx]

      const isObject = picks.some(pick => typeof pick === 'object')

      const index = correct ? correct : isCorrect

      if (isObject) {
        return picks[index] && picks[index].title ? picks[index].title : ''
      }

      return picks[index]
    },
    [questions]
  )

  const getExamFeedback = useCallback(
    /**
     * @param {number} index
     */
    (index, data) => {
      if (data.match) {
        return data.match
      }

      const { answers } = questions[index]

      const answer = answers.find(({ isCorrect }) => isCorrect)

      return answer.title ? answer.title : ''
    }, [questions]
  )

  const Check = <img lazy="true" src={img['check-mark']} alt="checked" />

  const Incorrect = <img lazy="true" src={img['incorrect-mark']} alt="incorrect" />

  return (
    (render && (
      <Animate type={animations.ROTATING_ENTRNACE.ROTATE_IN}>
        <Text bold center color="muted" tag="h1">
          {lang.t('COMPONENTS.completedExercise.review')}{' '}
          <img lazy="true" src={img.review} alt="review" />
        </Text>
        <FlexContainer>
          <div className="w-50">
            <Management rows={review}>
              {feedback.map((data, idx) => (
                <TableRow key={idx}>
                  <TableHeader>{data.value}</TableHeader>
                  <TableHeader>{data.feedback ? Check : Incorrect}</TableHeader>
                  {examRenderingContent ? (
                    <TableHeader>
                      {data.feedback ? 'Good!' : getExamFeedback(idx, data)}
                    </TableHeader>
                  ) : (
                    <TableHeader>
                      {data.feedback ? 'Good!' : getInstantFeedback(idx, data)}
                    </TableHeader>
                  )}
                </TableRow>
              ))}
            </Management>
          </div>
        </FlexContainer>
      </Animate>
    ))
  )
}

export default memo(Review)
