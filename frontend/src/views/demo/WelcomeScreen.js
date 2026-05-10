import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { resetGuestSession } from 'store/@reducers/guestSession'
import brandLogo from 'assets/illustrations/brand/logo.svg'
import Panda from 'assets/illustrations/pandas/panda.svg'
import styles from './WelcomeScreen.module.scss'

const WelcomeScreen = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector(state => state.auth)

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user.isLoggedIn) {
      history.replace('/dashboard')
    }
  }, [user.isLoggedIn, history])

  // Reset any previous guest session when landing here
  useEffect(() => {
    dispatch(resetGuestSession())
  }, [dispatch])

  const handleLogin = () => {
    history.push('/login')
  }

  const handleContinueWithoutAccount = () => {
    dispatch(resetGuestSession())
    history.push('/demo/exam')
  }

  return (
    <div className={styles.wrapper}>
      <img
        src={brandLogo}
        alt="Learlify"
        className={styles.brandLogo}
        aria-hidden="true"
      />
      <img
        src={Panda}
        alt=""
        className={styles.panda}
        aria-hidden="true"
      />

      <h1 className={styles.heading}>
        {t('WELCOME.heading', { defaultValue: '¡Aprende inglés a tu ritmo!' })}
      </h1>
      <p className={styles.subheading}>
        {t('WELCOME.subheading', {
          defaultValue: 'La forma más divertida y eficaz de preparar tu examen oficial. Sin estrés, a tu ritmo.'
        })}
      </p>

      <div className={styles.card}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleLogin}
        >
          <span className={styles.emoji} aria-hidden="true">🔑</span>
          {t('WELCOME.login', { defaultValue: 'Tengo una cuenta' })}
        </button>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={handleContinueWithoutAccount}
        >
          <span className={styles.emoji} aria-hidden="true">🚀</span>
          {t('WELCOME.startFree', { defaultValue: 'Probar sin registrarme' })}
        </button>
        <span className={styles.secondaryNote}>
          {t('WELCOME.freeNote', { defaultValue: 'Gratis, sin compromiso. Guarda tu progreso después.' })}
        </span>
      </div>
    </div>
  )
}

export default WelcomeScreen
