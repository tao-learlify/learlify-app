import { MODE } from 'common/process'
import { v4 as UUID } from 'uuid'
import moment from 'moment'

type PaginationStack = {
  limit: number
  page: number | string
  total: number
}

type ParsedSchemaContent = {
  schema: Array<{
    category: string
    [key: string]: unknown
  }>
}

type ParsedContentResult = {
  [key: string]: unknown
  length?: number
  exercises?: unknown[]
}

type FileLike = {
  mimetype?: string
}

export function createPaginationStack(paginationStack: PaginationStack): {
  currentPage: number
  hasNext: boolean
  limit: number
  total: number
} {
  const lastPage = Math.ceil(paginationStack.total / paginationStack.limit)

  const page =
    typeof paginationStack.page === 'string'
      ? parseInt(paginationStack.page)
      : paginationStack.page

  return {
    currentPage: page,
    hasNext: page >= lastPage ? false : true,
    limit: paginationStack.limit,
    total: paginationStack.total
  }
}

export function exist(models: unknown[]): boolean {
  if (models.every(model => model)) {
    return true
  }

  throw new Error('Undefined values included')
}

export function generateDateFileName(filename: string): string {
  return `${UUID()}-${filename}`
}

export function sanitizeFile(
  file: FileLike,
  callback: (err: Error, accepted?: boolean) => unknown
): unknown {
  const audioMimeType = 'audio/'
  const jsonMimeType = 'application/json'
  const mimetype = (file as { mimetype: string }).mimetype

  const isAllowedMimeType =
    mimetype.startsWith(audioMimeType) || mimetype.startsWith(jsonMimeType)

  if (isAllowedMimeType) {
    return callback(null as unknown as Error, true)
  }

  return callback('Mimetype is not allowed.' as unknown as Error)
}

export function isValidDate(value: unknown): Promise<never> | void {
  const isDate = moment(value as never).isValid()

  if (!isDate) {
    return Promise.reject('Is not date')
  }

  return undefined
}

export function getAllElementExceptLast<T>(arr: T[]): T[] {
  return [...arr].slice(0, arr.length - 1)
}

export function cloudfrontURL(url: string): string {
  return 'exams/' + url
}

export function getSchemaIndex<T extends { category?: string }>(
  schema: T[],
  value: string
): T | undefined {
  return schema.find(context => {
    return context.category === value
  })
}

export function analyzeFamilyName(familyName?: string): string {
  if (familyName) {
    if (familyName.length < 2) {
      return 'AptisGo'
    }

    return familyName
  }

  return 'AptisGo'
}

export function isRunningOnProductionOrDevelopment(): boolean {
  return (
    process.env.NODE_ENV === MODE.production ||
    process.env.NODE_ENV === MODE.development
  )
}

export function parseContent({
  data,
  key
}: {
  data: string | JSON
  key?: string
}): ParsedContentResult {
  const content = JSON.parse(data as string) as ParsedSchemaContent

  return key
    ? (content.schema.find(value => value.category === key) as ParsedContentResult)
    : (content.schema as unknown as ParsedContentResult)
}

export function build({ version, dir }: { version: string; dir: string }): string {
  return `exams/${version}/${dir}`
}

export function sum(accumulator: number, currentValue: number): number {
  globalThis.console.log(accumulator, currentValue)

  return accumulator + currentValue
}
