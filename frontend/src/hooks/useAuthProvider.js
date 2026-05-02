import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import decode from 'jwt-decode'

import { logOut as logOutAction } from 'store/@reducers/auth'
import { isLoggedIn as LocalStorageProvider } from 'store/functions/auth'
import { authSelector } from 'store/@selectors/auth'


import { APTIS_KEY } from 'utils/localStorage'

/**
 * @typedef {Object} AuthProvider
 * @property {boolean} isLoggedIn
 * @property {boolean} demo
 * @property {User} profile
 * @property {() => boolean} localStorageProvider
 * @property {(jwt: string, next: Function) => void} verifyCodeFromEmailOrigin
 * @property {boolean} loading
 * @property {boolean} verification
 * @property {() => void} logOut
 */



/**
 * @description
 * Returns the state of authentication, and the user.
 * @returns {AuthProvider}
 */
function useAuthProvider() {
  const history = useHistory()

  const dispatch = useDispatch()

  const { isLoggedIn, user, demo, loading, error } = useSelector(authSelector)

  /**
   * @param {string} jwt
   * @param {Function} next
   */
  const verifyCodeFromEmailOrigin = (jwt, next) => {
    try {
      const credentials = decode(jwt)
      
      if (credentials.email && credentials.email === user.email) {
        return next()
      }

      history.push({
        pathname: '/'
      })
    } catch (err) {
      history.push({
        pathname: '/'
      })
    }
  }



  const logOut = () => {
    dispatch(logOutAction())

    localStorage.removeItem(APTIS_KEY)
  }

  return {
    isLoggedIn,
    demo,
    profile: user,
    loading,
    localStorageProvider: LocalStorageProvider,
    verifyCodeFromEmailOrigin,
    verification: null,
    logOut,
    error
  }
}

export default useAuthProvider
