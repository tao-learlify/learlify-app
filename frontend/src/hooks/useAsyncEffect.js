import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'


/**
 * Use async flow through redux store, when the deps are valid we should throw a new action.
 * Toggling the actual value of state.
 * @example
 * useAsyncEffect(() => {
 *  doSomethingWithCallback()
 * }, [deps], action())
 * 
 * @param {() => void} callback
 * @param {Function | import('store/actions/action').ActionCreator} actionCreator
 * @param {React.DependencyList} deps 
 */
function useAsyncEffect (callback, deps = [], actionCreator) {
  /**
   * Ref is important due to re-render logic.
   */
  const isCurrent = useRef(true)

  const dispatch = useDispatch()

  /**
   * @description
   * This function execute only when deps are changed.
   * Only truthy values can be updated after this effect.
   */
  const refCallback = useCallback(() => {
    const shouldDispatch = deps.every(Boolean) && actionCreator
    
    if (shouldDispatch) {
      dispatch(
        typeof actionCreator === 'function' ? actionCreator() : actionCreator
      )

      /**
       * Component when is being unmount should not callback.
       */
      if (isCurrent.current) {
        callback()
      }
    }
  }, [deps, dispatch, actionCreator, callback])

  useEffect(() => {
    return () => {
      isCurrent.current = false
    }
  }, [])


  useEffect(refCallback, [deps])
}


export default useAsyncEffect