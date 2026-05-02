import { useSelector } from 'react-redux'
import { feedbackSelector } from 'store/@selectors/feedback'

function useFeedback () {
  return useSelector(feedbackSelector)
}

export default useFeedback