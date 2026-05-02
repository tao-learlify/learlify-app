import { useSelector } from 'react-redux'
import { progressSelector } from 'store/@selectors/exams'

/**
 * @returns {{}}
 */
export default function useProgress () {
  return useSelector(progressSelector)
}