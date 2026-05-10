import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

/**
 * HOC that protects demo flow routes.
 * Redirects to the correct step if the user jumps ahead.
 *
 * Usage:
 *   <DemoFlowGuard requiredStep="exam">
 *     <DemoExamSelector />
 *   </DemoFlowGuard>
 *
 * Steps: 'exam' (no guard needed, entry point), 'competency', 'exercise', 'result'
 */
const stepRequired = {
  competency: 'examType',  // must have selected an exam
  exercise: 'competency',   // must have selected a competency
  result: 'competency',     // must have completed exercises
}

function DemoFlowGuard({ children, requiredStep }) {
  const guestSession = useSelector(state => state.guestSession)

  // /demo/exam is the entry point — always accessible
  if (requiredStep === 'exam') {
    return children
  }

  const field = stepRequired[requiredStep]
  if (!field) {
    return children
  }

  if (!guestSession[field]) {
    // Redirect backwards — competency needs exam, exercise needs competency, result needs competency
    if (requiredStep === 'result') {
      // Also check that we have answers
      if (!guestSession.answers || guestSession.answers.length === 0) {
        return <Redirect to="/demo/exam" />
      }
      return <Redirect to="/demo/competency" />
    }
    if (requiredStep === 'exercise') {
      return <Redirect to="/demo/competency" />
    }
    return <Redirect to="/demo/exam" />
  }

  // For /demo/result, also verify we have answers
  if (requiredStep === 'result' && (!guestSession.answers || guestSession.answers.length === 0)) {
    return <Redirect to="/demo/exam" />
  }

  return children
}

export default DemoFlowGuard
