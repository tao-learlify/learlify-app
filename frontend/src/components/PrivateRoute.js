import React, { useCallback, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from 'store/functions/auth'

import useSession from 'hooks/useSession'

/**
 * @typedef {Object} PrivateRouteProps
 * @property {React.Component} component
 * @property {boolean} exact
 * @property {string} path
 */

/**
 * @type {React.FunctionComponent<PrivateRouteProps>}
 */
const PrivateRoute = ({ component: Component, ...params }) => {
  const { disableNavigationTour } = params

  const { onSelectTourNavigationMode } = useSession()

  const mountNavigationEffect = () => {
    onSelectTourNavigationMode(disableNavigationTour)
  }

  useEffect(mountNavigationEffect, [
    disableNavigationTour,
    onSelectTourNavigationMode
  ])

  /**
   * @param {{}} props
   */
  const render = useCallback(props => {
    /**
     * @description
     * Will force to handle an exam model.
     */
    return isLoggedIn() ? <Component {...props} /> : <Redirect to="/" />
  }, [])

  return <Route {...params} render={render} />
}
export default PrivateRoute
