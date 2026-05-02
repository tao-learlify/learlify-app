import { useEffect, useRef } from 'react'
import { dashboard } from 'views/dashboard/constants'

/**
 * @description
 * debounce is a higher-order function, which is a function that returns another function
 * (named executedFunction here for clarity).
 * This is done to form a closure around the func, wait, and immediate function parameter.
 * @param {() => void} callback
 * @param {{}} value
 */
function useDebounce(callback, value) {
  const refCallback = useRef(callback)

  useEffect(() => {
    return () => {
      if (callback !== refCallback.current) {
        refCallback.current = callback
      }
    }
  })

  useEffect(() => {
    const debounce = setTimeout(refCallback.current, dashboard.debounce.timer)

    return () => {
      clearTimeout(debounce)
    }
  }, [value])
}

export default useDebounce
