import { useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { selectNavigationMode } from 'store/actions/action'
import { selectorFromUseSession } from 'store/selectors/hooks'

/**
 * @returns {import ('store/reducers/session').SessionState}
 */
function useSession() {
  const dispatch = useDispatch()

  const state = useSelector(selectorFromUseSession, shallowEqual)

  const onSelectTourNavigationMode = useCallback(
    mode => dispatch(selectNavigationMode(mode)),
    [dispatch]
  )

  return {
    ...state,
    onSelectTourNavigationMode
  }
}

export default useSession
