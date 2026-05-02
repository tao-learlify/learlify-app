import { useSelector } from 'react-redux'
import { scheduleSelector } from 'store/@selectors/schedules'

function useSchedule() {
  const schedules = useSelector(scheduleSelector)

  return schedules
}

export default useSchedule
