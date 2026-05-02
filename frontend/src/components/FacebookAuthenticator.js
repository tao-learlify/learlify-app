import React, { useEffect } from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import config from 'config'
import useScripts from 'hooks/useScripts'

/**
 * @typedef {Object} FacebookStyleProps
 * @property {string} className
 * @property {string} dataSize
 * @property {string} dataButtonType
 * @property {string} dataLayout
 * @property {string} dataAutoLogoutLink
 * @property {string} dataWidth
 */

/**
 * @type {FacebookStyleProps}
 */
const facebookStyleProps = {
  'className': 'fb-login-button',
  'data-size': 'large',
  'data-button-type': 'continue_with',
  'data-layout': 'default',
  'data-auto-logout-link': 'false',
  'data-width': ''
}

/***
 * @typedef {Object} FacebookAuthenticatorProps
 * @property {(user: import ('react-facebook-login').ReactFacebookLoginInfo) => void} response
 */

/**
 * @type {React.FunctionComponent<FacebookAuthenticatorProps>}
 */
const FacebookAuthenticator = ({ response }) => {
  const status = useScripts({
    src: 'https://connect.facebook.net/en_US/sdk.js',
    defer: true,
    async: true,
    crossOrigin: 'anonymous'
  })


  useEffect(() => {
    if (status === 'ready') {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: config.FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v8.0'
        })  
      }
    }
  }, [status])

  const renderComponent = () => (
    <div {...facebookStyleProps} />
  )

  return (
    <FacebookLogin
      appId={config.FACEBOOK_APP_ID}
      autoLoad={false}
      fields="name,email,pricture"
      callback={response}
      render={renderComponent}
    />
  )
}

export default React.memo(FacebookAuthenticator)
