import React, { memo } from 'react'
import lang from 'lang'

import Animate from './Animate'
import BreaklineText from './BreaklineText'
import FlexContainer from './FlexContainer'
import Management from './Management'
import TableHeader from './TableHeader'
import Text from './Text'

import animations from 'utils/animations'
import TableRow from 'components/TableRow'

import { img } from 'assets/img'

const data = {
  rows: ['Opción', 'Evaluación', 'Correcta']
}

/**
 * @type {React.FunctionComponent<{ results: import('views/exams/reducer').Feedback}>}
 */
const Feedback = ({ results }) => {
  return (
    <React.Fragment>
      <Animate type={animations.ROTATING_ENTRNACE.ROTATE_IN}>
        <Text bold center color="muted" tag="h1">
          {lang.t('COMPONENTS.completedExercise.review')}
          <img alt="feedback" src={img.review} />
        </Text>
      </Animate>
      <Animate type={animations.FADING_ENTRANCE.fadeIn}>
        <FlexContainer>
          <Management rows={data.rows}>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableHeader>
                  {result.title && (
                    <BreaklineText
                      value={result.title}
                      tag="small"
                      color="black"
                      bold
                    />
                  )}
                </TableHeader>
                <TableHeader>
                  {result.hasOwnProperty('isValid') && (
                    <img alt="img" src={result.isValid ? img['check-mark'] : img['incorrect-mark']} />
                  )}
                  {result.hasOwnProperty('isCorrect') && (
                    <img alt="img" src={result.isCorrect ? img['check-mark'] : img['incorrect-mark']} />
                  )}
                </TableHeader>
                <TableHeader>
                  {result.hasOwnProperty('isCorrect') && (
                    <BreaklineText
                      value={result.isCorrect ? 'Good' : result.match}
                      tag="small"
                      color="black"
                      bold
                    />
                  )}
                  {result.hasOwnProperty('isValid') && (
                    <BreaklineText
                      value={result.isValid ? 'Good' : result.match}
                      tag="small"
                      color="black"
                      bold
                    />
                  )}
                </TableHeader>
              </TableRow>
            ))}
          </Management>
        </FlexContainer>
      </Animate>
    </React.Fragment>
  )
}

Feedback.defaultProps = {
  results: []
}

export default memo(Feedback)
