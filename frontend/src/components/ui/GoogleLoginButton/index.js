import React, { memo, useCallback, useState } from 'react'
import clsx from 'clsx'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import styles from './GoogleLoginButton.module.scss'

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" className={styles.icon}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const Spinner = () => <span className={styles.spinner} aria-hidden="true" />

/**
 * GoogleLoginButton — Authorization Code flow via @react-oauth/google.
 *
 * Uses flow: 'auth-code'. The code is sent to the onSuccess callback
 * which exchanges it server-side via /api/v1/auth/social/google/code.
 */
const GoogleLoginButton = memo(function GoogleLoginButton({
  onSuccess,
  onFailure,
  loading = false,
  disabled = false,
  className,
}) {
  const { t } = useTranslation()
  const [internalLoading, setInternalLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setInternalLoading(false)
      // Authorization code flow returns { code: "..." }
      onSuccess({ code: response.code })
    },
    onError: () => {
      setInternalLoading(false)
      onFailure?.()
    },
    flow: 'auth-code',
  })

  const isLoading = loading || internalLoading
  const isDisabled = disabled || isLoading

  const handleClick = useCallback(() => {
    setInternalLoading(true)
    googleLogin()
  }, [googleLogin])

  return (
    <button
      type="button"
      className={clsx(styles.btn, isLoading && styles.loading, isDisabled && styles.disabled, className)}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={t('AUTHENTICATION.signWithGoogle', { defaultValue: 'Sign in with Google' })}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
    >
      <span className={styles.iconSlot}>
        {isLoading ? <Spinner /> : <GoogleIcon />}
      </span>
      <span className={styles.label}>
        {isLoading
          ? t('AUTHENTICATION.signingIn', { defaultValue: 'Signing in…' })
          : t('AUTHENTICATION.signWithGoogle', { defaultValue: 'Continue with Google' })}
      </span>
    </button>
  )
})

GoogleLoginButton.defaultProps = { loading: false, disabled: false }

export default GoogleLoginButton
export { GoogleLoginButton }
