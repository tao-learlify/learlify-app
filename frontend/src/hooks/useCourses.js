import { useSelector, shallowEqual } from 'react-redux'
import { coursesSelector } from 'store/@selectors/courses'

/**
 * @returns {{ loading: boolean, courses: []}}
 */
function useCourses() {
  const state = useSelector(coursesSelector, shallowEqual)

  return state
}

export default useCourses
