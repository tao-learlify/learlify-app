import moment from 'moment'
import { formatUnitTime as format } from 'utils/functions'

const HOUR = 60

const MINUTE = 1000

const SIZE = 2

export function formatScheduleDate({ startDate, endDate }) {
  return `${moment(startDate).format('dddd')} ${moment(endDate).format(
    'DD, hh:mm a'
  )} - ${moment(endDate).format('hh:mm a')}`
}

/**
 * @param {{ timer: number }}
 */
export function formatStopwatchDate(timer) {
  if (timer === 0 || timer === null) {
    return '00:00:00:00'
  }

  const H = Math.floor(timer / (HOUR * HOUR * MINUTE))

  const M = Math.floor((timer / (HOUR * MINUTE)) % HOUR)

  const S = Math.floor((timer / MINUTE) % HOUR)

  const MS = (timer % MINUTE) / 10

  return `${format(H, SIZE)}:${format(M,  SIZE)}:${format(S,  SIZE)}:${format(MS,  SIZE)}`
}
