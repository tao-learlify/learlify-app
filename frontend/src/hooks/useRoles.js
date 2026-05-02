import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRolesThunk } from 'store/@thunks/roles'
import { rolesSelector } from 'store/@selectors/roles'
import { initialArguments } from 'hooks'

/**
 * @param {useBackendService}
 * @returns {import('store/@reducers/roles').RolesEntity}
 */
function useRoles({ preload } = initialArguments) {
  const roles = useSelector(rolesSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    if (preload) {
      const stream = dispatch(fetchRolesThunk())

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, preload])

  const fetchData = useCallback(() => {
    const stream = dispatch(fetchRolesThunk())

    return () => {
      stream.abort()
    }
  }, [dispatch])

  return {
    ...roles,
    fetch: fetchData
  }
}

export default useRoles
