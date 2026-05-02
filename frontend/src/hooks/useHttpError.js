import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { serviceFailWithStatusCodeEnd } from 'store/actions/action'
import { selectorFromUseHttpError } from 'store/selectors/hooks'

/**
 * Uses a function inside view/component to catch incoming http request with client error, or server error.
 * @example
 * import { moduleStatusCode } from 'common.statusCode'
 *
 * useHttpError(statusCode => {
 *    switch(statusCode) {
 *      case moduleStatusCode.BadRequest:
 *          ...statements
 *    }
 * })
 * @param {(statusCode: number, message?: string) => void} callback function to do actions after httpStatusCode render.
 */
function useHttpError(callback) {
  const dispatch = useDispatch()

  const { statusCode, message } = useSelector(
    selectorFromUseHttpError,
    shallowEqual
  )

  const callbackRef = useCallback(() => {
    if (statusCode && typeof callback === 'function') {
      dispatch(serviceFailWithStatusCodeEnd())

      callback(statusCode, message)
    }
  }, [callback, dispatch, message, statusCode])

  useEffect(callbackRef, [statusCode, callback])
}

export default useHttpError
