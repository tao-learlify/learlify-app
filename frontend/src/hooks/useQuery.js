import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * @example
 * const [ queries ] = useQuery('?search=samgsumg&price=33') =>  { search: 'samsung', price: 33 }
 * Generates an object of query parameters.
 * @param {string} url 
 * @param {string []} dataset 
 */
function useQuery () {
  const url = useLocation().search

  const queries = useMemo(() => {
    const params = new URLSearchParams(url)

    const data = {}

    params.forEach((value, key) => {
      Object.assign(data, { [key]: value })
    })

    return data
  }, [url])

  return queries
}



export default useQuery