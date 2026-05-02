import React, { useState } from 'react'
import Icon from 'react-icons-kit'

import { comment } from 'react-icons-kit/fa/comment'
import { pencil } from 'react-icons-kit/fa/pencil'

import useAuthProvider from 'hooks/useAuthProvider'

import BreaklineText from 'components/BreaklineText'
import Text from 'components/Text'

import styles from 'views/evaluations/components/viewer.module.scss'
import roles from 'utils/roles'
import { removeMatch } from 'utils/functions'

/**
 * @typedef {Object} WritingReviewProps
 * @property {string} description
 * @property {boolean} normalize
 * @property {string []} feedback
 * @property {questions []} questions
 */

/**
 * @type {React.FunctionComponent<WritingReviewProps>}
 */
const WritingReview = ({
  normalize,
  editable,
  description,
  feedback,
  questions
}) => {
  const [editModeValues, setEditModeValues] = useState([])

  const { profile } = useAuthProvider()

  /**
   * @param {string} index
   */
  const handleClickModeEdit = id => {
    if (editModeValues.includes(id)) {
      setEditModeValues(currentEdit => currentEdit.filter(edit => edit !== id))

      return
    }

    setEditModeValues(currentEdit => [...new Set([...currentEdit, id])])
  }

  /**
   * @description
   * Conditional rendering.
   * If normalize is setted, should we adjust to the current format.
   */
  if (normalize) {
    return (
      <div className={styles.viewer}>
        {description && (
          <BreaklineText
            center
            color="blue"
            value={description}
            splitWithDiv
            tag="p"
          />
        )}
        {questions.map((question, relationWithQuestion) => (
          <React.Fragment key={question.title}>
            <div>
              <BreaklineText
                color="turquoise"
                tag="h5"
                value={removeMatch(question.title)}
                splitWithDiv
              />
            </div>
            <Icon className="text-info" icon={comment} style={readOnlyStyles} />
            {feedback && (
              <Text tag="small" color="muted">
                {feedback[relationWithQuestion]}
              </Text>
            )}
            <hr />
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.viewer}>
      {description && (
        <BreaklineText
          center
          color="blue"
          value={description}
          splitWithDiv
          tag="p"
        />
      )}
      {questions.map((question, index) => (
        <React.Fragment key={question.title}>
          <div>
            <BreaklineText
              color="turquoise"
              tag="h5"
              value={removeMatch(question.title)}
              splitWithDiv
            />
            {profile.role.name === roles.USER && editable && (
              <Icon
                className="float-right text-dark"
                icon={pencil}
                onClick={() => handleClickModeEdit(question.id)}
              />
            )}
          </div>
          <Icon className="text-info" icon={comment} style={readOnlyStyles} />
          {feedback && (
            <Text tag="small" color="muted">
              {feedback[index].title}
            </Text>
          )}
          <hr />
        </React.Fragment>
      ))}
    </div>
  )
}

const readOnlyStyles = {
  marginRight: 10
}

WritingReview.defaultProps = {
  editable: false,
  questions: []
}

export default WritingReview
