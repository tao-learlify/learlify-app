import React from 'react'
import { GoogleLogin } from 'react-google-login'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-bootstrap'
import { Button } from 'components/ui'
import lang from 'lang'

import config from 'config'


import { img } from 'assets/compat'
/**
 * @typedef {Object} GoogleAuthenticatorProps
 * @property {string} className
 * @property {string} googleButtonText
 * @property {() => void} onSuccess
 * @property {() => void} onFailure
 */

/**
 * @type {React.FunctionComponent<GoogleAuthenticatorProps>}
 */
const GoogleAuthenticator = ({
  className,
  disabled,
  onSuccess,
  onFailure,
  googleButtonText
}) => {
  const { t } = useTranslation()

  const renderComponent = React.useCallback(
    props => {
      return (
        <Button
          variant="outline-info"
          className={className}
          onClick={props.onClick}
          disabled={props.disabled || disabled}
          type="button"
        >
          {googleButtonText}  <Image className="ml-1" src={img.search} width={18} />
        </Button>
      )
    },
    [googleButtonText, className, disabled]
  )

  return (
    <GoogleLogin
      buttonText={t('AUTHENTICATION.signWithGoogle')}
      clientId={config.GOOGLE_CLIENT_ID}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      theme="light"
      render={renderComponent}
    />
  )
}

GoogleAuthenticator.defaultProps = {
  googleButtonText: lang.t('AUTHENTICATION.google')
}

export default React.memo(GoogleAuthenticator)
