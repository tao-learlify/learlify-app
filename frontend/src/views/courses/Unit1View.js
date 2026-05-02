import React from 'react'
import { useHistory } from 'react-router-dom'
import { UnitView } from 'views/courses/unit'
import { unit1 } from 'schemas/course/samples/unit-1'
import PATH from 'utils/path'

/**
 * Unit 1 — Daily Routines
 *
 * Development view that mounts the full UnitView runtime with the
 * unit-1 sample dataset. Accessible at /unit-1.
 *
 * onNextUnit    → no next unit yet; goes back to /courses
 * onBackToCourse → navigates to /courses
 */
export default function Unit1View() {
  const history = useHistory()

  const handleBackToCourse = () => history.push(PATH.COURSES)

  return (
    <UnitView
      unit={unit1}
      onBackToCourse={handleBackToCourse}
    />
  )
}
