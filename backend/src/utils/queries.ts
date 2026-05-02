type QueryItem<T> = {
  option: unknown
  query: T
}

export const getQuery = <T>(queries: QueryItem<T>[], defaultValue: T): T => {
  const data = queries.find(({ option }) => option)

  return data ? data.query : defaultValue
}

export const validateQueryParameters = (queries: string[]): boolean => {
  return queries.every(query => query)
}
