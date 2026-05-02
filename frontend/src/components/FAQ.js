import React, { memo } from 'react'
import FAQButton from 'components/FAQButton'
import AptisAccordion from 'components/AptisAccordion'

/**
 * @typedef {Object} FrecuentQuestion
 * @property {string} className
 * @property {string} title
 * @property {string} description
 * @property {string} notes
 * @property {string} bodyStyle
 * @property {string} styleJsx
 */

/**
 * @typedef {Object} FAQProps
 * @property {string} title
 * @property {Array<FrecuentQuestion>} questions
 */


/**
 * @type {React.FunctionComponent<FAQProps>}
 */
const FAQ = ({ questions }) => (
  <FAQButton title="">
    {questions.map((question, index) => (
      <AptisAccordion
        styleJsx={index === questions.length - 1 ? "last-accordion" :question.styleJsx }
        bodystyle={index === questions.length - 1 ? "last-body" : question.bodyStyle }
        className={index === 1 ? "accordion-header" : question.className }
        key={question.title}
        title={question.title}
        eventKey={`${index}`}
        >
          {question.description} {question.notes && (
            <br>
              {question.notes}
            </br>
          )}
      </AptisAccordion>
    ))}
  </FAQButton>
)

FAQ.defaultProps = {
  questions: []
}


export default memo(FAQ)
