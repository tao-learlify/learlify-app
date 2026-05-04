import React, { memo } from 'react'

import FlexContainer from './FlexContainer'
import Text from './Text'
import Management from './Management'
import TableHeader from './TableHeader'
import Animate from './Animate'
import TableRow from 'components/TableRow'

import { completedExerciseLang } from './lang'
import { img } from 'assets/compat'

export const answersRows = ['Answer', 'Passed']

/**
 * @type {React.FunctionComponent<{ evaluations: {} | null, keyName: string }>} ExerciseCompleted
 */
const ExerciseCompleted = ({ evaluations }) => {
  return (
    <Animate type="rotateIn">
      <div className="container mx-auto px-4">
        <Text bold center color="muted" tag="h1">
          {completedExerciseLang.review} <img src={img.review} alt="review" />
        </Text>
      </div>
      <FlexContainer>
        <Management rows={answersRows}>
          {evaluations.map((evaluation, index) => (
            <TableRow key={index}>
              <TableHeader>
                <Text bold color="muted" tag="h5">
                  {evaluation.title}
                </Text>
              </TableHeader>
              <TableHeader>
                <img
                  src={
                    evaluation.isCorrect
                      ? img['check-mark']
                      : img['incorrect-mark']
                  }
                  alt="answer"
                />
              </TableHeader>
            </TableRow>
          ))}
        </Management>
      </FlexContainer>
    </Animate>
  )
}

ExerciseCompleted.defaultProps = {
  evaluations: []
}

export default memo(ExerciseCompleted)
