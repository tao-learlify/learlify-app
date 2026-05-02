/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import httpClient from 'utils/httpClient'


/**
 * @param {import('utils/httpClient').HttpClientOptions} clientConfig
 */
function useHttpClient(clientConfig) {
  const dispatch = useDispatch()

  const [response, setResponse] = useState({
    data: {},
    loading: false,
    status: null,
    fetch: false
  })

  const fetchResource = useCallback(() => {
    const apiCall = () => {
      setResponse(response => ({
        ...response,
        loading: true
      }))

      httpClient({
        ...clientConfig,
        headears: {
          ...clientConfig.headers
        },
      })
        .then(data => {
          setResponse(response => ({
            ...response,
            data: data.response,
            status: data.statusCode,
            loading: false,
            fetch: true
          }))

        })
        .catch(err => {
          setResponse(response => ({
            ...response,
            error: true,
            loading: false,
          }))
        })
    }

    apiCall()
  }, [clientConfig, dispatch])

  useEffect(fetchResource, [])

  return response

}

export default useHttpClient
