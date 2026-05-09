import React, { memo } from 'react'
import { Redirect } from 'react-router-dom'

import useAuthProvider from 'hooks/useAuthProvider'
import useModels from 'hooks/useModels'

import Checkpoint from 'views/mails/Checkpoint'

import FallbackMode from 'components/FallbackMode'

/**
 * @description
 * Wraps a component with verification, if the user is verified we render props.
 * If not, we put a checkpoint component.
 * @param {React.Component} Component
 * @returns {React.Component}
 */
const withVerification = Component => props => {
  const user = useAuthProvider()

  return user.profile?.isVerified ? <Component {...props} /> : <Checkpoint />
}

/**
 * Wraps a component intou a route condition if the user is already logged we redirect to main page.
 * @param {React.Component} Component
 * @returns {React.Component}
 */
const withLogout = Component =>
  memo(props => {
    const user = useAuthProvider()

    return user.isLoggedIn ? <Redirect to="/" /> : <Component {...props} />
  })

/**
 * @param {React.Component} Component
 * @returns {React.Component}
 */
const withAdmin = Component => props => {
  const user = useAuthProvider()

  if (user.profile && user.profile.role.name === 'Admin') {
    return <Component {...props} />
  }

  return <Redirect to="/" />
}

/**
 * @description
 * Until models are load, this component wraps in a conditional.
 * @param {React.Component} Compoonent
 * @returns {React.Component}
 */
const withModels = Compoonent => props => {
  const { model } = useModels()

  if (model) {
    return <Compoonent {...props} />
  }

  return <FallbackMode />
}

export { withVerification, withLogout, withAdmin, withModels }
