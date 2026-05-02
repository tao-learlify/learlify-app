import { useState, useCallback } from 'react'

/**
 * Inserts an object into the hooks and returns a form state.
 * useForm will return [state, onChangeCallback] to updates his own state.
 * Requires an object.
 * @param {{}} properties 
 * @returns {[{}, Function]}
 */
function useForm(properties) {
  const [data, setData] = useState({ ...properties })

  const onChange = useCallback(({ target: { name, value }}) => {
    setData(state => {
      return {
        ...state,
        [name]: value
      }
    })
  }, [])
  
  const reset = useCallback(() => {
    setData({ ...properties })
  }, [properties])

  
  return [data, onChange, reset]
}

export default useForm