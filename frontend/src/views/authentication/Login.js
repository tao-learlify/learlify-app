/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'

import { Button, Input } from 'components/ui'
import { GoogleLoginButton } from 'components/ui/GoogleLoginButton'
import { AuthShell } from 'components/layout/AuthShell'

import useAuthProvider from 'hooks/useAuthProvider'
import useForm from 'hooks/useForm'
import useLocalStorage from 'hooks/useLocalStorage'
import useQuery from 'hooks/useQuery'
import useToggler from 'hooks/useToggler'

import PATH from 'utils/path'
import Panda from 'assets/illustrations/pandas/panda.svg'
import brandLogo from 'assets/illustrations/brand/logo.svg'

import links from './config/ref'
import like from 'modules/words'
import {
  demoThunk,
  forgotPasswordThunk,
  loginThunk,
  socialThunk
} from 'store/@thunks/auth'

import { selectModel } from 'store/@reducers/models'
import { fetchModelsThunk } from 'store/@thunks/models'

import styles from './auth.module.scss'
import { createNavigationPath } from 'modules/url'

const Login = () => {
  const user     = useAuthProvider()
  const dispatch = useDispatch()
  const history  = useHistory()
  const ls       = useLocalStorage()
  const { t }    = useTranslation()

  const [form, handleChange, reset] = useForm(initialFormValues)
  const { redirect, model }         = useQuery()
  const [forgot, setForgot]         = useToggler()

  /**
   * Redirect once authenticated
   */
  useEffect(() => {
    if (user.isLoggedIn) {
      const { token } = user.profile

      if (!user.profile.email.includes('aptisgo@noreply')) {
        ToastsStore.info(t('AUTHENTICATION.welcome'))
      }

      ls.setItem(token, false)

      if (redirect) {
        const path = links.find(link => like([redirect], link.ref))

        if (model) {
          history.push(createNavigationPath(PATH.MODELS, { query: model }))
        } else {
          path ? history.push(path.route) : history.push(PATH.MODELS)
        }
      }

      if (user.profile.model) {
        dispatch(fetchModelsThunk())
        dispatch(selectModel(user.profile.model))
        history.push(PATH.DASHBOARD)
      } else {
        user.demo || history.push(PATH.MODELS)
      }
    }
  }, [user.isLoggedIn, redirect, t])

  const handleAuthenticationLocal = e => {
    e.preventDefault()
    dispatch(loginThunk(form))
      .then(unwrapResult)
      .catch(({ message }) => ToastsStore.warning(message))
  }

  const handleRecoverPassword = () => {
    dispatch(forgotPasswordThunk({ email: form.recover }))
      .then(unwrapResult)
      .then(() => {
        ToastsStore.success(t('FORGOT.success', { email: form.recover }))
        reset()
      })
      .catch(({ message }) => ToastsStore.warning(message))
  }

  const handleGoogleSuccess = useCallback(
    ({ profileObj }) => {
      dispatch(socialThunk({ user: profileObj, provider: 'google' }))
        .then(unwrapResult)
        .catch(({ message }) => ToastsStore.warning(message))
    },
    [dispatch]
  )

  const handleGoogleError = () => {
    ToastsStore.error(t('AUTHENTICATION.error'))
  }

  const handleDemoSession = () => {
    dispatch(demoThunk())
      .then(unwrapResult)
      .then(() => {
        if (redirect) {
          const found = links.find(l => l.ref === redirect)
          if (found) {
            history.push(found.route)
            return
          }
        }
        history.push(PATH.MODELS)
      })
      .catch(({ message }) => ToastsStore.warning(message))
  }

  return (
    <AuthShell loading={user.loading}>
      <div className={styles.cardWrapper}>

        {/* Panda mascot floating above card */}
        <img
          src={Panda}
          alt=""
          className={styles.panda}
          aria-hidden="true"
        />

        <div className={styles.card}>

          {/* ── Branding ─────────────────────────────────── */}
          <div className={styles.brand}>
            <img
              src={brandLogo}
              alt="Learlify"
              className={styles.brandLogo}
            />
          </div>

          {/* ── Header ───────────────────────────────────── */}
          <header className={styles.header}>
            <h1 className={styles.title}>
              {t('AUTHENTICATION.welcomeBack', { defaultValue: 'Welcome back' })}
            </h1>
            <p className={styles.subtitle}>
              {t('AUTHENTICATION.subtitle', {
                defaultValue: 'Sign in to continue your learning journey'
              })}
            </p>
          </header>

          {/* ── Google Login — primary CTA ────────────────── */}
          {!forgot && (
            <div className={styles.googleCta}>
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleError}
                disabled={user.loading}
              />
            </div>
          )}

          {/* ── Divider ──────────────────────────────────── */}
          {!forgot && (
            <div className={styles.divider} aria-hidden="true">
              <span className={styles.dividerLabel}>
                {t('AUTHENTICATION.or', { defaultValue: 'or' })}
              </span>
            </div>
          )}

          {/* ── Form ─────────────────────────────────────── */}
          <form
            className={styles.form}
            onSubmit={forgot ? e => { e.preventDefault(); handleRecoverPassword() } : handleAuthenticationLocal}
            noValidate
            aria-label={forgot ? t('FORGOT.formLabel', { defaultValue: 'Password recovery form' }) : t('AUTHENTICATION.formLabel', { defaultValue: 'Sign in form' })}
          >
            {forgot ? (
              <>
                <p className={styles.forgotNote}>
                  {t('FORGOT.main')}
                </p>
                <Input
                  label={t('AUTHENTICATION.email', { defaultValue: 'Email address' })}
                  name="recover"
                  type="email"
                  value={form.recover}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                >
                  {t('FORGOT.send', { defaultValue: 'Send reset link' })}
                </Button>
              </>
            ) : (
              <>
                <Input
                  label={t('AUTHENTICATION.email', { defaultValue: 'Email address' })}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <Input
                  label={t('AUTHENTICATION.password', { defaultValue: 'Password' })}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <div className={styles.forgotRow}>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={setForgot}
                  >
                    {t('AUTHENTICATION.forgot', { defaultValue: 'Forgot password?' })}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  fullWidth
                >
                  {t('AUTHENTICATION.login', { defaultValue: 'Sign in with email' })}
                </Button>
              </>
            )}
          </form>

          {/* ── Footer ───────────────────────────────────── */}
          <footer className={styles.footer}>
            {forgot ? (
              <Link to={PATH.LOGIN} className={styles.footerLink} onClick={setForgot}>
                ← {t('AUTHENTICATION.backToLogin', { defaultValue: 'Back to sign in' })}
              </Link>
            ) : (
              <>
                <span className={styles.footerNote}>
                  {t('AUTHENTICATION.noAccount', { defaultValue: "Don't have an account?" })}
                </span>
                {' '}
                <Link to={PATH.SIGN_UP} className={styles.footerLink}>
                  {t('AUTHENTICATION.sign', { defaultValue: 'Sign up' })}
                </Link>
              </>
            )}

            <button
              type="button"
              className={styles.demoLink}
              onClick={handleDemoSession}
            >
              {t('AUTHENTICATION.demo', { defaultValue: 'Try a free demo' })}
            </button>
          </footer>

        </div>
      </div>
    </AuthShell>
  )
}

const initialFormValues = {
  email:    '',
  password: '',
  recover:  ''
}

export default Login
