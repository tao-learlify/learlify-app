import { useEffect } from 'react'
import httpClient from 'utils/httpClient'
import useAuthProvider from './useAuthProvider'
import useHttpClient from './useHttpClient'

/**
 * @param {{ draft: string }}
 */
function useAppTour({ draft } = { draft: undefined }) {
  const { demo } = useAuthProvider()

  const http = useHttpClient({
    endpoint: '/api/v1/users/0?tour=true',
    requiresAuth: true,
    method: 'GET'
  })

  /**
   * @param {string} draft 
   * @returns {vimport('react').oid}
   */
  const updateDraft = async (draft) => {
    try {
      await httpClient({
        body: {
          draft
        },
        endpoint: '/api/v1/users/tour',
        requiresAuth: true,
        method: 'PUT'
      })
    } catch (err) {
      console.warn(err.name)
    }
  }


  useEffect(() => {
    const shouldUpdateDraft = !http.fetch && !demo && draft

    if (shouldUpdateDraft) {
      updateDraft(draft)
    }
  }, [demo, draft, http.data, http.fetch])


  return {
    updateDraft,
    fetch: http.fetch,
    loading: http.loading,
    tour: http.data
  }
}

export default useAppTour