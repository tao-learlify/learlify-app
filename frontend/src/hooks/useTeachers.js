import { useSelector } from 'react-redux'
import { teachersSelector } from 'store/@selectors/users'

/**
 * @param {useBackendService}
 * @returns {import('store/@reducers/roles').RolesEntity}
 */
function useTeachers () {
  const users = useSelector(teachersSelector)

  return users
}

export default useTeachers
