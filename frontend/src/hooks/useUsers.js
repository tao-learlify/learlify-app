import { useSelector } from 'react-redux'
import { usersSelector } from 'store/@selectors/users'

/**
 * @param {useBackendService}
 * @returns {import('store/@reducers/roles').RolesEntity}
 */
function useUsers() {
  const users = useSelector(usersSelector)

  return users
}

export default useUsers
