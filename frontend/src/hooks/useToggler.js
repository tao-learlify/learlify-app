import { useState, useCallback } from 'react'

/**
 * @description
 * @param {boolean} initialState
 * This hook is designed for toggling values from false, to true, an viceversa.
 * @returns {[boolean, (param?: boolean) => void]}
 */
function useToggler(initialState = false) {
  const [state, setState] = useState(initialState)

  const toggle = useCallback((value) => {
    if (value && typeof value === 'boolean') {
      return setState(value)
    }

    setState(state => !state)
  }, [])

  return [state, toggle]
}

export default useToggler
