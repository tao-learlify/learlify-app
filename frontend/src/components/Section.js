import React from 'react'

import Feedback from 'components/Feedback'

/**
 * @typedef {Object} SectionProps
 * @property {number} level The current level
 * @property {number} levels the total of levels
 * @property {() => number} levelChange
 * @property {[]} feedback
 */

/**
 * @type {React.FunctionComponent<SectionProps>}
 */
const Section = ({ children, level,  feedback }) => {
  return (
    <>
      <div className="container mx-auto px-4">
        {Array.isArray(feedback) && feedback.length > 0 ? (
           <Feedback 
              results={feedback[level]}
           />
        ) : (
          children
        )}
      </div>
    </>
  )
}

Section.defaultProps = {
  level: 0,
  levels: 0,
  levelChange: () => 0
}

export default React.memo(Section)
