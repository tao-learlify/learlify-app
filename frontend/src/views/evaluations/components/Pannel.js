import React, { useRef } from 'react'
import { SPEAKING, WRITING } from 'constant/labels'
import { APTIS, IELTS } from 'constant/models'
import { useDispatch } from 'react-redux'

import useAuthProvider from 'hooks/useAuthProvider'
import useEvaluations from 'hooks/useEvaluations'
import { setScore } from 'store/@reducers/evaluations'

import Text from 'components/Text'
import Range from 'components/Range'

import { img } from 'assets/img'

import roles from 'utils/roles'
import styles from './viewer.module.scss'

const score = {
  [APTIS]: ['Wrong', 'Very Basic', 'Basic', 'Good'],
  [IELTS]: {
    [SPEAKING]: [
      'Fluency And Coherence',
      'Lexical Resources',
      'Grammatical Range and Accuracy',
      'Pronunciation'
    ],
    [WRITING]: [
      'Task Response',
      'Coherence and Cohesion',
      'Lexical Resources',
      'Grammatical Range And Accuracy'
    ]
  }
}
/**
 * @type {React.FunctionComponent<{}>}
 */
const Pannel = ({ current }) => {
  const { selected } = useEvaluations()

  const dispatch = useDispatch()

  const user = useAuthProvider()

  const category = useRef(selected.category.name)

  const model = useRef(selected.exam.model.name)

  /**
   * @returns {string []}
   * Shows the current feedback based on the context of which exam is about to being evaluated.
   * @returns {[]}
   */
  const getCurrentFeed = () => {
    if (selected && model.current === APTIS) {
      switch (category.current) {
        case SPEAKING:
          return selected.data.cloudStorageRef[current]
        case WRITING:
          return selected.data.feedback[current]
  
        default:
          return 0
      }
    }

    if (selected && model.current === IELTS) {
      switch (category.current) {
        case SPEAKING:
          return score[IELTS][category.current]
        case WRITING:
          return selected.data.feedback[current]
  
        default:
          return 0
      }
    }

    return []
  }

  /**
   * @description
   * From the pannel the teacher changes the score.
   * @param {number} selector
   * @param {number} score
   */
  const handleChangeScore = (selector, range) => {
    dispatch(
      setScore({
        current,
        selector,
        score: parseInt(range)
      })
    )
  }

  /**
   * Get the current score based on index.
   * @param {number} index
   */
  const handleGetScore = index => selected.score[current][index]

  /**
   * Handles the current score.
   * @param {number} index
   */
  const handleModelScore = index => {
    switch (category.current) {
      case APTIS:
        return score[APTIS][handleGetScore(index)]

      default:
        return null
    }
  }

  /**
   * @description
   * Attributes for the current evaluation.
   */
  const handleGetAttributes = useRef(() => {
    switch (model.current) {
      case APTIS:
        return {
          min: 0,
          max: 3,
          step: 1
        }

      case IELTS:
        return {
          min: 0,
          max: 9,
          step: 0.5
        }

      default:
        return {}
    }
  })

  /**
   * Gets the current title, in IELTS only names all criterys and based score.
   * In Aptis only should indicate criteries based on each question.
   * @param {string} value
   * @param {index} index
   */
  const handleGetTitle = (value, index) => {
    if (model.current === IELTS) {
      return (
        <React.Fragment>
          <b>{value}: </b>
          <Text bold color="turquoise" tag="span" className={styles.bandscore}>
            {selected.score[current][index]}
          </Text>
        </React.Fragment>
      )
    }

    if (model.current === APTIS) {
      return <React.Fragment>Question {index + 1} ... {score[APTIS][selected.score[current][index]]}</React.Fragment>
    }
  }

  return getCurrentFeed().map((value, index) => (
    <React.Fragment key={index}>
      <Text color="blue" hovered tag="p">
        <img alt="test" src={img.test} />
        <Text className={styles.pannel} color="blue" tag="small">
          {handleGetTitle(value, index)}
          <strong className={styles.pannel}>{handleModelScore(index)}</strong>
        </Text>
      </Text>
      {user.profile.role.name === roles.TEACHER && (
        <Range
          name="points"
          onChange={e => handleChangeScore(index, e.target.value)}
          value={handleGetScore(index)}
          {...handleGetAttributes.current()}
        />
      )}
    </React.Fragment>
  ))
}

export default Pannel
