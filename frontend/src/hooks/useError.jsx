import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { SERVICE_ERROR_CLEAR } from '../store/actions/types'
import { isNull } from '../utils/functions'
import { ToastsStore } from 'react-toasts'

function useError(callback, error) {
  const dispatch = useDispatch()

  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (!isNull(error)) {
      ToastsStore.info(error, 4000)

      dispatch({
        type: SERVICE_ERROR_CLEAR
      })

      callback()
    }
  }, [error, dispatch, callback])
}

export default useError