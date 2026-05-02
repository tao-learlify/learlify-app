import moment from 'moment-timezone'

/**
 * @typedef {Object} ModuleSchedule
 * @property {number} classIntervalMinutes The total of minutes avilable per class.
 * @property {number} classStartDayHourForUser The start hour per day.
 * @property {number} classEndDayHourForAdmin The end hour per day.
 * @property {number} intervalUpdate
 * @property {Date} locale The UTC Zone of madrid.
 * @property {string} defaultFormat "YEARS-MONTH-DAY:HOURS:MINUTES"
 * @property {{ props: { startDayHour?: number, endDayHour?: number }}} view
 */
const date = new Date()

function calculeTimezonBetweenHour() {
  const timezone = moment.tz.guess()

  /**
   * @description
   * Testing the schedule for every hour.
   */
  if (import.meta.env.DEV) {
    return {
      startDayHour: 0,
      endDayHour: 24
    }
  }

  if (timezone.startsWith('America')) {
    return {
      startDayHour: 4,
      endDayHour: 0
    }
  }

  if (timezone.startsWith('Europe')) {
    return {
      startDayHour: 8,
      endDayHour: 22
    }
  }

  if (timezone.startsWith('Asia')) {
    return {
      startDayHour: 2,
      endDayHour: 22
    }
  }

  return {
    startDayHour: 2,
    endDayHour: 20
  }
}

/**
 * @type {ModuleSchedule}
 */
export const schedule = {
  classIntervalMinutesForUser: 60,
  classIntervalMinutesForAdmin: 45,
  classStartDayHour: import.meta.env.PROD ? 4 : 0,
  classEndDayHour: 24,
  intervalUpdate: 600000,
  locale: moment(date).tz('Europe/Madrid'),
  defaultFormat: 'YYYY-MM-DD HH:mm',
  view: {
    props: calculeTimezonBetweenHour()
  }
}
