/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import lang from 'lang'

import useAuthProvider from 'hooks/useAuthProvider'
import useLocalStorage from 'hooks/useLocalStorage'
import useQuery from 'hooks/useQuery'
import usePermissions, { requireLogout } from 'hooks/usePermissions'

import Login from './authentication/Login'
import PATH from 'utils/path'
import { APTIS_KEY } from 'utils/localStorage'
import { demoThunk } from 'store/@thunks/auth'

import refs from 'views/authentication/config/ref'
import like from 'modules/words'

/**
 * @constant
 * @description
 * Prefix for deep linking on AptisGo Through Links.
 */
export const PREFIX_THROUGH_LINK = '?link='

const Main = ({ history, location }) => {
  const user = useAuthProvider()

  const dispatch = useDispatch()

  const { redirect, demo } = useQuery()

  const { permissions } = usePermissions({
    with: [requireLogout]
  })

  const { setItem } = useLocalStorage({
    key: APTIS_KEY
  })

  const handleVerificationState = () => {
    if (handleErrorVerificationMessage(location)) {
      return handleToastMessage('message', lang.t('MAILS.verification.expired'))
    }

    if (handleVerificationMessage(location)) {
      return handleToastMessage(
        'verificated',
        lang.t('MAILS.verification.verficated')
      )
    }
  }

  const handleDemoRedirection = () => {
    if (redirect && demo) {
      dispatch(demoThunk())
    }
  }

  useEffect(handleVerificationState, [])

  useEffect(handleDemoRedirection, [demo, dispatch, redirect])

  useEffect(() => {
    if (user.isLoggedIn && redirect) {
      setItem(user.profile.token)

      const origin = refs.find(({ ref }) => like([redirect], ref))

      if (origin) {
        if (origin === PATH.COURSES && demo) {
          history.push({
            pathname: origin,
            search: '?demo=true'
          })
        }
        history.push({
          pathname: origin
        }) 
      }
    }
  }, [demo, redirect, history, setItem, user.isLoggedIn, user.profile])

  /**
   * @param {Router.LocationProps} routerState
   * Verifies if the state has been settled
   */
  const handleVerificationMessage = useCallback(routerState => {
    return routerState['state'] && routerState['state']['verificated']
  }, [])

  const handleErrorVerificationMessage = useCallback(routerState => {
    return routerState['state'] && routerState['state']['message']
  }, [])

  /**
   * @description
   * Handles a toast message with succesfull verification.
   * Also with replace our state 'verified' to false, this will make to no longer show the message again.
   */
  const handleToastMessage = useCallback(
    /**
     * @param {string} nameState
     * @param {string} message
     */
    (property, message) => {
      ToastsStore.info(message)
      history.replace({
        state: {
          [property]: false
        }
      })
    },
    [history]
  )

  /**
   * Usig
   */
  return permissions.withLogout ? <Redirect to={PATH.DASHBOARD} /> : <Login />
}

export default Main
