import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'
import { unwrapResult } from '@reduxjs/toolkit'
import { GoogleLoginButton } from 'components/ui/GoogleLoginButton'
import { TelegramLoginButton } from 'components/ui/TelegramLoginButton'
import { googleCodeThunk, telegramThunk, signUpThunk } from 'store/@thunks/auth'
import { resetGuestSession } from 'store/@reducers/guestSession'
import config from 'config'
import UnlockModal from './UnlockModal'
import styles from './DemoResultScreen.module.scss'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

const DemoResultScreen = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector(state => state.auth)
  const guestSession = useSelector(state => state.guestSession)
  const isLoggedIn = user.isLoggedIn

  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const { competency, examType, score, level, answers, answered, total: gsTotal } = guestSession
  // Use Redux-tracked answers if available, otherwise estimate from completion data
  const hasExactAnswers = answers && answers.length > 0
  const correctCount = hasExactAnswers ? answers.filter(a => a.isCorrect).length : Math.round((answered || 0) * 0.7)
  const totalCount = hasExactAnswers ? answers.length : (gsTotal || 0)

  // Prevent navigating away
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleGoogleSuccess = useCallback(({ code }) => {
    dispatch(googleCodeThunk({ code, redirect_uri: window.location.origin }))
      .then(unwrapResult)
      .then(() => {
        ToastsStore.success(t('AUTHENTICATION.welcomeBack', { defaultValue: '¡Bienvenido!' }))
      })
      .catch(({ message }) => setErrorMsg(message))
  }, [dispatch, t])

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
      .then(() => {
        ToastsStore.success(t('AUTHENTICATION.welcomeBack', { defaultValue: '¡Bienvenido!' }))
      })
      .catch(({ message }) => setErrorMsg(message))
  }, [dispatch, t])

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
      await dispatch(signUpThunk({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: '',
      })).then(unwrapResult)

      ToastsStore.success(t('AUTHENTICATION.welcomeBack', { defaultValue: '¡Bienvenido!' }))
    } catch (err) {
      setErrorMsg(err?.message || t('ERRORS.generic', { defaultValue: 'Error al registrarse' }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDashboard = () => {
    dispatch(resetGuestSession())
    history.push('/dashboard')
  }

  // ── Result content (only rendered when logged in) ────────────────────────
  const levelIndex = LEVELS.indexOf(level)
  const scorePercent = score || 0

  const resultContent = (
    <div className={styles.resultCard}>
      <div className={styles.resultEmoji} aria-hidden="true">
        {levelIndex >= 3 ? '🏆' : levelIndex >= 1 ? '👏' : '💪'}
      </div>
      <h1 className={styles.resultTitle}>
        {t('DEMO.result.congrats', { defaultValue: '¡Enhorabuena!' })}
      </h1>
      <p className={styles.resultSubtitle}>
        {t('DEMO.result.levelAchieved', {
          defaultValue: 'Has obtenido un nivel {{level}} en {{competency}}',
          level,
          competency: competency || '',
        })}
      </p>
      <div className={styles.resultLevel}>{level}</div>

      {/* Score bar */}
      <div className={styles.scoreBar}>
        <div
          className={styles.scoreFill}
          style={{ width: `${scorePercent}%` }}
        />
      </div>
      <div className={styles.scoreLabel}>
        <span>
          {hasExactAnswers
            ? `${correctCount}/${totalCount} ${t('DEMO.result.correct', { defaultValue: 'correctas' })}`
            : `${t('DEMO.exercise.progress', { defaultValue: '{{current}} de {{total}}', current: (answered || 0), total: (gsTotal || 0) })} ${t('DEMO.result.completed', { defaultValue: 'completados' })}`
          }
        </span>
        <span>{scorePercent}%</span>
      </div>

      {/* Level scale */}
      <div className={styles.levelScale}>
        {LEVELS.map((lvl, idx) => (
          <div
            key={lvl}
            className={`${styles.levelDot} ${idx === levelIndex ? styles.levelDotActive : ''}`}
            title={lvl}
          >
            {lvl}
          </div>
        ))}
      </div>

      <p className={styles.resultSubtitle}>
        {t('DEMO.result.onlyPart', {
          defaultValue: 'Esto es solo {{competency}}. Completa el resto de competencias para saber si podrías aprobar un examen completo de {{exam}}.',
          competency: competency || '',
          exam: examType || 'Aptis',
        })}
      </p>

      <button
        type="button"
        className={styles.primaryBtn}
        onClick={() => setShowUnlockModal(true)}
      >
        {t('DEMO.result.unlock', { defaultValue: '🚀 Desbloquear acceso completo' })}
      </button>

      <button
        type="button"
        className={styles.secondaryBtn}
        onClick={handleDashboard}
      >
        {t('DEMO.result.goToDashboard', { defaultValue: 'Ir al dashboard' })}
      </button>
    </div>
  )

  // ── Auth overlay (mandatory — no close button) ───────────────────────────
  const authOverlay = (
    <div className={styles.authOverlay}>
      <div className={styles.authCard} role="dialog" aria-modal="true">
        <div className={styles.authEmoji} aria-hidden="true">🔐</div>
        <h2 className={styles.authTitle}>
          {t('DEMO.result.authTitle', { defaultValue: '¡Crea tu cuenta para ver tu resultado!' })}
        </h2>
        <p className={styles.authSubtitle}>
          {t('DEMO.result.authSubtitle', { defaultValue: 'Es gratis y solo tarda 30 segundos. No te quedes sin ver tu nivel.' })}
        </p>

        <div className={styles.authSocialStack}>
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

        {!showEmailForm ? (
          <button
            type="button"
            className={styles.authSubmitBtn}
            onClick={() => setShowEmailForm(true)}
            style={{ width: '100%' }}
          >
            {t('DEMO.result.emailSignUp', { defaultValue: 'Registrarme con email' })}
          </button>
        ) : (
          <form className={styles.authForm} onSubmit={handleFormSubmit}>
            <div className={styles.authField}>
              <label htmlFor="dr-firstName">
                {t('AUTHENTICATION.firstName', { defaultValue: 'Nombre' })}
              </label>
              <input
                id="dr-firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleFormChange}
                required
                autoComplete="given-name"
              />
            </div>
            <div className={styles.authField}>
              <label htmlFor="dr-email">
                {t('AUTHENTICATION.email', { defaultValue: 'Email' })}
              </label>
              <input
                id="dr-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                autoComplete="email"
              />
            </div>
            <div className={styles.authField}>
              <label htmlFor="dr-password">
                {t('AUTHENTICATION.password', { defaultValue: 'Contraseña' })}
              </label>
              <input
                id="dr-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {errorMsg && <span className={styles.authError}>{errorMsg}</span>}

            <button type="submit" className={styles.authSubmitBtn} disabled={submitting}>
              {submitting
                ? t('DEMO.authModal.creating', { defaultValue: 'Creando cuenta…' })
                : t('DEMO.result.createAndSee', { defaultValue: 'Crear cuenta y ver resultado' })
              }
            </button>
          </form>
        )}
      </div>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      {/* Result is rendered but hidden by overlay when not logged in */}
      {resultContent}

      {/* Mandatory auth overlay — no close button, no escape */}
      {!isLoggedIn && authOverlay}

      {/* Unlock modal (only after login) */}
      <UnlockModal
        isOpen={isLoggedIn && showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        examType={examType}
      />
    </div>
  )
}

export default DemoResultScreen
