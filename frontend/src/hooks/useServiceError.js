import useAsyncEffect from './useAsyncEffect'
import { useSelector, shallowEqual } from 'react-redux'

import { selectorFromUseServiceError } from 'store/selectors/hooks'
import { serviceError } from 'store/actions/action'

/**
 * @param {() => void} callback
 */
function useServiceError(callback) {
  const { error } = useSelector(selectorFromUseServiceError, shallowEqual)

  const action = serviceError({ clear: true })

  useAsyncEffect(callback, [error], action)
}

export default useServiceError
