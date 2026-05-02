import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { ASYNC_ACTION_END } from 'store/actions/types'

/**
 * @param {{ options: { asAction?: boolean }}}
 * @alias Middleware
 * @returns {[ onEnd: Function] }
 * @description
 * After a successfull http response, onEnd function will turn off the side effect.
 * @example
 * useUpdate(() => {
 *  // After a successfull httpResponse ok
 *  onEnd(() => { 
 *    console.log('Logged In!')
 *  })
 * }, store.auth.userProfile)
 * @returns {[Function]}
 */
function useAsync (...keys) {
  const dispatch = useDispatch()

  const asynCallback = useCallback(() => {
    dispatch({
      type: ASYNC_ACTION_END
    })
  }, [dispatch])

  const asyncActionEnd = useCallback((key) => {
    const ACTION_END = 'ACTION_END'

    dispatch({
      type: ACTION_END,
      payload: {
        key
      }
    })
  }, [dispatch])

  /**
   * Avoiding inline functions to be recreated.
   */
  const asyncMiddleware = useCallback(() => {
    if (keys) {
      keys.forEach((key) => {
        asyncActionEnd(key)
      })
    }
    asynCallback()
  }, [asynCallback, asyncActionEnd, keys])

  const onEnd = useCallback(  
    /**
     * @param {Function} callback
     */
    (callback) => {
    if (typeof callback === 'function') {
      callback()
    }

    asyncMiddleware()
  }, [asyncMiddleware])

  return [ onEnd ]
}

export default useAsync