import { useSelector } from 'react-redux'
import { onlineFlowStream } from 'store/@selectors/classes'

function useMeeting () {
  const stream = useSelector(onlineFlowStream)

  return stream
}

export default useMeeting