import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'
import { unwrapResult } from '@reduxjs/toolkit'
import { GoogleLoginButton } from 'components/ui/GoogleLoginButton'
import { TelegramLoginButton } from 'components/ui/TelegramLoginButton'
import { googleCodeThunk, telegramThunk, signUpThunk } from 'store/@thunks/auth'
import { setAuthIntercepted, setGuestUserId } from 'store/@reducers/guestSession'
import config from 'config'
import styles from './DemoAuthInterceptModal.module.scss'

/**
 * Modal shown mid-exercise-flow to intercept and offer registration.
 * NOT mandatory — user can skip.
 */
function DemoAuthInterceptModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleGoogleSuccess = useCallback(({ code }) => {
    dispatch(googleCodeThunk({ code, redirect_uri: window.location.origin }))
      .then(unwrapResult)
      .then((res) => {
        const token = res?.response?.token
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          dispatch(setGuestUserId(payload.id))
        }
        dispatch(setAuthIntercepted())
        ToastsStore.success(t('AUTHENTICATION.welcomeBack', { defaultValue: '¡Bienvenido!' }))
        onClose()
      })
      .catch(({ message }) => {
        setErrorMsg(message)
      })
  }, [dispatch, onClose, t])

  const handleGoogleError = useCallback(() => {
    setErrorMsg(t('AUTHENTICATION.error', { defaultValue: 'Error de autenticación' }))
  }, [t])

  const handleTelegramSuccess = useCallback(({ id_token, user: tgUser }) => {
    dispatch(telegramThunk({
      id_token,
      firstName: tgUser?.first_name || 'Telegram',
      lastName: tgUser?.last_name || '',
      username: tgUser?.username || '',
      imageUrl: tgUser?.photo_url || '',
    }))
      .then(unwrapResult)
      .then((res) => {
        const token = res?.response?.token
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          dispatch(setGuestUserId(payload.id))
        }
        dispatch(setAuthIntercepted())
        ToastsStore.success(t('AUTHENTICATION.welcomeBack', { defaultValue: '¡Bienvenido!' }))
        onClose()
      })
      .catch(({ message }) => {
        setErrorMsg(message)
      })
  }, [dispatch, onClose, t])

  const handleTelegramError = useCallback((error) => {
    if (error) setErrorMsg(error)
  }, [])

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await dispatch(signUpThunk({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: '',
      })).then(unwrapResult)

      const token = res?.response?.token
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        dispatch(setGuestUserId(payload.id))
      }
      dispatch(setAuthIntercepted())
      ToastsStore.success(t('AUTHENTICATION.welcomeBack', { defaultValue: '¡Bienvenido!' }))
      onClose()
    } catch (err) {
      setErrorMsg(err?.message || t('ERRORS.generic', { defaultValue: 'Error al registrarse' }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = () => {
    dispatch(setAuthIntercepted())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={t('DEMO.authModal.title', { defaultValue: 'Guarda tu progreso' })}>
      <div className={styles.modal}>
        <div className={styles.emoji} aria-hidden="true">🎉</div>
        <h2 className={styles.title}>
          {t('DEMO.authModal.title', { defaultValue: '¡Vas muy bien! Guarda tu progreso' })}
        </h2>
        <p className={styles.subtitle}>
          {t('DEMO.authModal.subtitle', { defaultValue: 'Crea una cuenta gratis para no perder tus respuestas y continuar donde lo dejaste.' })}
        </p>

        <div className={styles.socialStack}>
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleError}
          />
          {config.TELEGRAM_CLIENT_ID && (
            <TelegramLoginButton
              onSuccess={handleTelegramSuccess}
              onFailure={handleTelegramError}
            />
          )}
        </div>

        {!showForm ? (
          <>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={() => setShowForm(true)}
              style={{ width: '100%' }}
            >
              {t('DEMO.authModal.emailSignUp', { defaultValue: 'Registrarme con email' })}
            </button>
            <button type="button" className={styles.skipLink} onClick={handleSkip}>
              {t('DEMO.authModal.skip', { defaultValue: 'Ahora no, continuar sin guardar' })}
            </button>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.inlineField}>
              <label htmlFor="am-firstName">
                {t('AUTHENTICATION.firstName', { defaultValue: 'Nombre' })}
              </label>
              <input
                id="am-firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleFormChange}
                required
                autoComplete="given-name"
              />
            </div>
            <div className={styles.inlineField}>
              <label htmlFor="am-email">
                {t('AUTHENTICATION.email', { defaultValue: 'Email' })}
              </label>
              <input
                id="am-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                autoComplete="email"
              />
            </div>
            <div className={styles.inlineField}>
              <label htmlFor="am-password">
                {t('AUTHENTICATION.password', { defaultValue: 'Contraseña' })}
              </label>
              <input
                id="am-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {errorMsg && <span className={styles.errorMsg}>{errorMsg}</span>}

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting
                ? t('DEMO.authModal.creating', { defaultValue: 'Creando cuenta…' })
                : t('DEMO.authModal.createAccount', { defaultValue: 'Crear cuenta gratis' })
              }
            </button>

            <button type="button" className={styles.skipLink} onClick={handleSkip}>
              {t('DEMO.authModal.skip', { defaultValue: 'Ahora no, continuar sin guardar' })}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default DemoAuthInterceptModal
