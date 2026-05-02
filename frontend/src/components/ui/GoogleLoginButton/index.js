import React, { memo, useCallback } from 'react'
import clsx from 'clsx'
import { GoogleLogin } from 'react-google-login'
import { useTranslation } from 'react-i18next'
import config from 'config'
import styles from './GoogleLoginButton.module.scss'

/**
 * SVG Google "G" logo — official brand mark.
 * Inline to avoid an extra network request on the auth page.
 */
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    aria-hidden="true"
    focusable="false"
    className={styles.icon}
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

/**
 * Spinner shown during the loading state.
 */
const Spinner = () => (
  <span className={styles.spinner} aria-hidden="true" />
)

/**
 * GoogleLoginButton — Accessible, DS-aligned OAuth entry point.
 *
 * Replaces `GoogleAuthenticator` (Bootstrap Button + react-bootstrap Image).
 *
 * Features:
 * - Official Google "G" icon (inline SVG — no extra request)
 * - Loading state: spinner replaces icon, text changes, aria-busy
 * - disabled state: opacity + cursor, aria-disabled
 * - pill shape, full-width, prominent CTA
 * - Dark-mode ready via CSS custom properties
 * - WCAG 2.1 AA: focus-visible, aria-label, min 44px touch target
 *
 * @param {(profile: object) => void} onSuccess   - Called with Google profileObj
 * @param {() => void}                onFailure   - Called on OAuth error
 * @param {boolean}                   [loading]   - Shows spinner + disables button
 * @param {boolean}                   [disabled]  - Disables button
 * @param {string}                    [className]
 *
 * @example
 * <GoogleLoginButton
 *   onSuccess={({ profileObj }) => dispatch(socialThunk({ user: profileObj, provider: 'google' }))}
 *   onFailure={() => ToastsStore.error('Google login failed')}
 *   loading={isPending}
 * />
 */
const GoogleLoginButton = memo(function GoogleLoginButton({
  onSuccess,
  onFailure,
  loading = false,
  disabled = false,
  className,
}) {
  const { t } = useTranslation()

  const isDisabled = disabled || loading

  const renderButton = useCallback(
    ({ onClick, disabled: oauthDisabled }) => (
      <button
        type="button"
        className={clsx(
          styles.btn,
          loading && styles.loading,
          isDisabled && styles.disabled,
          className
        )}
        onClick={onClick}
        disabled={isDisabled || oauthDisabled}
        aria-label={t('AUTHENTICATION.signWithGoogle', { defaultValue: 'Sign in with Google' })}
        aria-busy={loading}
        aria-disabled={isDisabled || oauthDisabled}
      >
        <span className={styles.iconSlot}>
          {loading ? <Spinner /> : <GoogleIcon />}
        </span>

        <span className={styles.label}>
          {loading
            ? t('AUTHENTICATION.signingIn', { defaultValue: 'Signing in…' })
            : t('AUTHENTICATION.signWithGoogle', { defaultValue: 'Continue with Google' })
          }
        </span>
      </button>
    ),
    [loading, isDisabled, className, t]
  )

  return (
    <GoogleLogin
      clientId={config.GOOGLE_CLIENT_ID}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy="single_host_origin"
      render={renderButton}
    />
  )
})

GoogleLoginButton.defaultProps = {
  loading:  false,
  disabled: false,
}

export default GoogleLoginButton
export { GoogleLoginButton }
