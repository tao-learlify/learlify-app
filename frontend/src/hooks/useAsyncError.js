import { useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { clearAsyncError } from 'store/@actions'

/**
 * @param {() => void} callback 
 * @param {string | Error} error
 */
function useAsyncError (callback, error) {
  const dispatch = useDispatch()

  const bindingCallback = useRef()

  const clear = useCallback(() => dispatch(clearAsyncError()), [dispatch])

  useEffect(() => {
   bindingCallback.current = callback
  })

  useEffect(() => {
    if (error) {
      clear()
      
      bindingCallback.current()
    }
  }, [clear, error])
}


export default useAsyncError