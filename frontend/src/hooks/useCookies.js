import cookies from 'js-cookie'
import { useState, useCallback } from 'react'


/**
 * @param {{ name?: string }}
 */
function useCookies ({ name }) {
  const [state, setState] = useState(cookies.get(name))

  const setCookies = useCallback(
    /**
     * @param {{ name?: string, value?: any, option?: {}, dataset?: boolean }} cookies
     */
    (cookies) => {
    cookies.set(cookies.name, cookies.value, cookies.option)
      if (cookies.dataset) {
        setState(cookies.dataset)
      }
  }, [])

  return [state, setCookies]
}

export default useCookies