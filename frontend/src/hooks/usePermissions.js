import { useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

export const requireVerification = 'requireVerification'
export const requireLogout = 'requireLogout'

/**
 * @typedef {Object} usePermissionsHook
 * @property {boolean} withLogout
 * @property {boolean} withVerification
 */



/**
 * Replaces high order components with a simple function that make requirements.
 * @example
 * const { permissions } = usePermissions({ with: ['requireVerification', 'requireLogout']})
 * 
 * return permissions.withLogout ? <Component /> : <Logout />
 * 
 * @param {{ with?: string []}} permissions
 * @returns {usePermissionsHook}
 */
function usePermissions(permissions) {
  const store = useSelector(
    state => ({
      user: state.auth.userProfile,
      isLoggedIn: state.auth.isLoggedIn
    }),
    shallowEqual
  )

  const [allowedPermissions, setAllowedPermissions] = useState({})

  const handlePermissions = () => {
    if (permissions.with) {
      if (permissions.with.includes(requireVerification)) {
        const addPermission = Object.assign({}, allowedPermissions, {
          withVerification: store.isLoggedIn ? store.user.isVerified : false
        })

        setAllowedPermissions(addPermission)
      }

      if (permissions.with.includes(requireLogout)) {
        const addPermission = Object.assign({}, allowedPermissions, {
          withLogout: store.isLoggedIn
        })

        setAllowedPermissions(addPermission)
      }
    }
  }

  useEffect(handlePermissions, [])

  return { permissions: allowedPermissions }
}

export default usePermissions
