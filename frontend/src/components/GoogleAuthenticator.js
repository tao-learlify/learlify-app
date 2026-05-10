import React, { useCallback, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui'
import lang from 'lang'
import { img } from 'assets/compat'

/** Decode a JWT payload without verification. */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1]
    return JSON.parse(atob(base64))
  } catch { return null }
}

/**
 * @type {React.FunctionComponent<{
 *   className?: string
 *   googleButtonText?: string
 *   onSuccess: (user: any) => void
 *   onFailure?: () => void
 *   disabled?: boolean
 * }>}
 */
const GoogleAuthenticator = ({
  className,
  disabled,
  onSuccess,
  onFailure,
  googleButtonText
}) => {
  const { t } = useTranslation()
  const [internalLoading, setInternalLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setInternalLoading(false)
      const payload = decodeJwtPayload(response.credential)
      if (payload) {
        onSuccess({
          profileObj: {
            googleId: payload.sub,
            email: payload.email,
            givenName: payload.given_name || payload.name?.split(' ')[0] || '',
            familyName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
            imageUrl: payload.picture || '',
          }
        })
      }
    },
    onError: () => {
      setInternalLoading(false)
      onFailure?.()
    },
    flow: 'implicit',
  })

  const handleClick = useCallback(() => {
    setInternalLoading(true)
    googleLogin()
  }, [googleLogin])

  return (
    <Button
      variant="outline-info"
      className={className}
      onClick={handleClick}
      disabled={disabled || internalLoading}
      type="button"
    >
      {internalLoading
        ? t('AUTHENTICATION.signingIn', { defaultValue: 'Signing in…' })
        : googleButtonText}
      {!internalLoading && <img className="ml-1" src={img.search} width={18} alt="Google" />}
    </Button>
  )
}

GoogleAuthenticator.defaultProps = {
  googleButtonText: lang.t('AUTHENTICATION.google')
}

export default React.memo(GoogleAuthenticator)
