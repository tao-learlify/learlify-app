import {
  isValid,
  parseISO,
  format as dateFnsFormat,
  addDays,
  subDays,
  addMinutes,
  subMinutes,
  startOfDay,
  endOfDay,
  isWithinInterval,
  parseJSON
} from 'date-fns'
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

type DateInput = Date | string | number

export function toDateFnsToken(momentFormat: string): string {
  return momentFormat
    .replace(/YYYY/g, 'yyyy')
    .replace(/DD/g, 'dd')
    .replace(/YY/g, 'yy')
    .replace(/\bD\b/g, 'd')
}

export function isValidDate(value: DateInput): boolean {
  if (value instanceof Date) return isValid(value)
  if (typeof value === 'string') return isValid(parseISO(value))
  if (typeof value === 'number') return isValid(new Date(value))
  return false
}

export function formatDate(date: DateInput, momentFormat: string): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  return dateFnsFormat(parsed, toDateFnsToken(momentFormat))
}

export function formatTz(
  date: DateInput,
  timezone: string,
  momentFormat: string
): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  return formatInTimeZone(parsed, timezone, toDateFnsToken(momentFormat))
}

export function convertTimezone(
  date: DateInput,
  timezone: string,
  momentFormat: string
): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  const zoned = toZonedTime(parsed, timezone)
  return dateFnsFormat(zoned, toDateFnsToken(momentFormat))
}

export function nowUtc(momentFormat: string): string {
  return dateFnsFormat(new Date(), toDateFnsToken(momentFormat))
}

export function nowTz(timezone: string, momentFormat: string): string {
  return formatInTimeZone(new Date(), timezone, toDateFnsToken(momentFormat))
}

export function addDaysFormatted(
  date: DateInput,
  n: number,
  momentFormat: string
): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  return dateFnsFormat(addDays(parsed, n), toDateFnsToken(momentFormat))
}

export function subDaysFormatted(
  date: DateInput,
  n: number,
  momentFormat: string
): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  return dateFnsFormat(subDays(parsed, n), toDateFnsToken(momentFormat))
}

export function subMinutesFormatted(
  date: DateInput,
  n: number,
  momentFormat: string
): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  return dateFnsFormat(subMinutes(parsed, n), toDateFnsToken(momentFormat))
}

export function addMinutesFormatted(
  date: DateInput,
  n: number,
  momentFormat: string
): string {
  const parsed = date instanceof Date ? date : parseJSON(date as unknown as string)
  return dateFnsFormat(addMinutes(parsed, n), toDateFnsToken(momentFormat))
}

export function startOfUtcDay(momentFormat: string): string {
  return dateFnsFormat(startOfDay(new Date()), toDateFnsToken(momentFormat))
}

export function endOfUtcDay(momentFormat: string): string {
  return dateFnsFormat(endOfDay(new Date()), toDateFnsToken(momentFormat))
}

export function isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
  const toDate = (value: DateInput): Date =>
    value instanceof Date ? value : parseJSON(value as unknown as string)

  return isWithinInterval(toDate(date), {
    start: toDate(start),
    end: toDate(end)
  })
}

export function addDaysTz(timezone: string, n: number, momentFormat: string): string {
  return formatInTimeZone(
    addDays(new Date(), n),
    timezone,
    toDateFnsToken(momentFormat)
  )
}
