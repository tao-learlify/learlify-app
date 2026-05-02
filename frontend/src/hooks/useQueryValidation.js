import { useEffect, useRef } from 'react'
import useQuery from './useQuery'

/**
 * @param {{ required: string [] }} query
 * @param {() => boolean} callback
 */
function useQueryValidation (query, callback) {
  const callbackRef = useRef(callback)

  const queries = useQuery()

  useEffect(() => {
    const includeAllQueries = query.required.every(value => queries[value])

    callbackRef.current(!includeAllQueries)
  }, [query.required, queries])
}

export default useQueryValidation