import React, { memo, useCallback, useState, useRef } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import config from 'config'
import styles from './TelegramLoginButton.module.scss'

/**
 * SVG Telegram brand icon (official logo).
 * Inline to avoid extra network requests.
 */
const TelegramIcon = () => (
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
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.538 6.777-1.96 9.265c-.148.66-.54.82-1.093.51l-3.018-2.224-1.456 1.402c-.16.16-.298.298-.612.298l.215-3.074 5.598-5.058c.242-.216-.054-.337-.374-.12l-6.916 4.35-2.978-.93c-.646-.202-.658-.646.135-.956l11.584-4.467c.54-.198 1.01.13.835.859z"
      fill="#229ED9"
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
 * Initiate Telegram Login via the new OIDC JS library.
 *
 * Dynamically loads the Telegram Login SDK from `telegram.org` then opens
 * the login popup. On success, the callback receives an `id_token` (JWT),
 * which must be exchanged on the server for a session.
 */
function initTelegramLogin({
  clientId,
  onSuccess,
  onError,
  lang,
}) {
  // Load the SDK if not already loaded
  if (typeof window !== 'undefined') {
    const existing = window.Telegram?.Login
    if (existing?.auth) {
      openLogin({ clientId, onSuccess, onError, lang })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-login.js'
    script.async = true
    script.onload = () => openLogin({ clientId, onSuccess, onError, lang })
    script.onerror = () => onError?.('Failed to load Telegram Login SDK')
    document.head.appendChild(script)
  }
}

function openLogin({ clientId, onSuccess, onError, lang }) {
  const Telegram = window.Telegram
  if (!Telegram?.Login?.auth) {
    onError?.('Telegram Login SDK not available')
    return
  }

  Telegram.Login.auth(
    {
      client_id: Number(clientId),
      ...(lang ? { lang } : {}),
    },
    (response) => {
      if (response.error) {
        onError?.(response.error)
        return
      }
      if (!response.id_token) {
        onError?.('No id_token received')
        return
      }
      onSuccess?.(response)
    }
  )
}

/**
 * TelegramLoginButton — Accessible, DS-aligned Telegram OIDC entry point.
 *
 * Matches the visual style of GoogleLoginButton.
 *
 * @param {(data: { id_token: string, user?: object }) => void} onSuccess
 * @param {(error: string) => void} onFailure
 * @param {boolean} [loading]
 * @param {boolean} [disabled]
 * @param {string} [className]
 */
const TelegramLoginButton = memo(function TelegramLoginButton({
  onSuccess,
  onFailure,
  loading = false,
  disabled = false,
  className,
}) {
  const { t } = useTranslation()
  const [internalLoading, setInternalLoading] = useState(false)
  const initRef = useRef(null)

  const clientId = config.TELEGRAM_CLIENT_ID
  const isDisabled = disabled || loading || internalLoading || !clientId

  const handleClick = useCallback(() => {
    if (!clientId) {
      onFailure?.(t('AUTHENTICATION.telegramNotConfigured', { defaultValue: 'Telegram Login is not configured' }))
      return
    }

    setInternalLoading(true)
    onFailure?.(null) // clear any previous error

    initTelegramLogin({
      clientId,
      onSuccess: (response) => {
        setInternalLoading(false)
        onSuccess?.(response)
      },
      onError: (error) => {
        setInternalLoading(false)
        onFailure?.(error)
      },
      lang: navigator.language?.startsWith('es') ? 'es' : 'en',
    })
  }, [clientId, onSuccess, onFailure, t])

  return (
    <button
      type="button"
      className={clsx(
        styles.btn,
        (internalLoading) && styles.loading,
        isDisabled && styles.disabled,
        className
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={t('AUTHENTICATION.signWithTelegram', { defaultValue: 'Sign in with Telegram' })}
      aria-busy={internalLoading}
      aria-disabled={isDisabled}
    >
      <span className={styles.iconSlot}>
        {internalLoading ? <Spinner /> : <TelegramIcon />}
      </span>

      <span className={styles.label}>
        {internalLoading
          ? t('AUTHENTICATION.signingIn', { defaultValue: 'Signing in…' })
          : t('AUTHENTICATION.signWithTelegram', { defaultValue: 'Continue with Telegram' })
        }
      </span>
    </button>
  )
})

TelegramLoginButton.defaultProps = {
  loading: false,
  disabled: false,
}

export default TelegramLoginButton
export { TelegramLoginButton }
