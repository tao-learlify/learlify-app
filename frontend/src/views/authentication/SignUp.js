/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { useTranslation } from 'react-i18next'
import { unwrapResult } from '@reduxjs/toolkit'

import { Button, Input, Modal } from 'components/ui'
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
import { demoThunk, signUpThunk, socialThunk } from 'store/@thunks/auth'

import { selectModel } from 'store/@reducers/models'
import { fetchModelsThunk } from 'store/@thunks/models'

import TermsAndCondition from './components/TermsAndCondition'
import {
  loginGoogleValidator,
  loginNameValidator,
  loginPasswordValidator
} from './validation/login'

import styles from './auth.module.scss'

const SignUp = () => {
  const user     = useAuthProvider()
  const dispatch = useDispatch()
  const history  = useHistory()
  const ls       = useLocalStorage()
  const { t }    = useTranslation()

  const [form, handleChange] = useForm(initialFormValues)
  const { redirect }         = useQuery()
  const [terms, switchTerms] = useToggler()
  const [accept, setAccept]  = useToggler()

  /**
   * Redirect once authenticated
   */
  useEffect(() => {
    if (user.isLoggedIn) {
      const { token } = user.profile

      ToastsStore.info(t('AUTHENTICATION.welcome'))
      ls.setItem(token, false)

      if (redirect) {
        const path = links.find(link => like([redirect], link.ref))
        return path ? history.push(path.route) : history.push(PATH.MODELS)
      }

      if (user.profile.model) {
        dispatch(fetchModelsThunk())
        dispatch(selectModel(user.profile.model))
        history.push(PATH.DASHBOARD)
      } else {
        history.push(PATH.MODELS)
      }
    }
  }, [user.isLoggedIn, redirect, t])

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

  const handleSignUp = e => {
    e.preventDefault()

    const validations = [
      loginGoogleValidator,
      loginNameValidator,
      loginPasswordValidator
    ]

    const failedIdx = validations.findIndex(fn => fn(form).validation)

    if (failedIdx !== -1) {
      return ToastsStore.info(validations[failedIdx](form).message)
    }

    if (!accept) {
      return ToastsStore.warning(t('AUTHENTICATION.mustAcceptTerms'))
    }

    dispatch(signUpThunk({
      email:     form.email,
      firstName: form.firstName,
      lastName:  form.lastName,
      password:  form.password
    }))
      .then(unwrapResult)
      .catch(({ message }) => ToastsStore.warning(message))
  }

  const handleDemoSession = () => {
    dispatch(demoThunk())
      .then(unwrapResult)
      .then(() => history.push(PATH.MODELS))
      .catch(({ message }) => ToastsStore.warning(message))
  }

  return (
    <AuthShell loading={user.loading}>
      <div className={styles.cardWrapper}>

        {/* Panda mascot */}
        <img
          src={Panda}
          alt=""
          className={styles.panda}
          aria-hidden="true"
        />

        <div className={styles.card}>

          {/* ── Branding ───────────────────────────────────── */}
          <div className={styles.brand}>
            <img src={brandLogo} alt="Learlify" className={styles.brandLogo} />
          </div>

          {/* ── Header ─────────────────────────────────────── */}
          <header className={styles.header}>
            <h1 className={styles.title}>
              {t('AUTHENTICATION.createAccount', { defaultValue: 'Join us' })}
            </h1>
            <p className={styles.subtitle}>
              {t('AUTHENTICATION.signupSubtitle', {
                defaultValue: 'Start your learning journey today'
              })}
            </p>
          </header>

          {/* ── Google — primary CTA ────────────────────────── */}
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleError}
            disabled={user.loading}
          />

          {/* ── Divider ────────────────────────────────────── */}
          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerLabel}>
              {t('AUTHENTICATION.or', { defaultValue: 'or' })}
            </span>
          </div>

          {/* ── Sign-up form ────────────────────────────────── */}
          <form
            className={styles.form}
            onSubmit={handleSignUp}
            noValidate
            aria-label={t('AUTHENTICATION.signupFormLabel', { defaultValue: 'Create account form' })}
          >
            <div className={styles.formRow}>
              <Input
                label={t('AUTHENTICATION.firstName', { defaultValue: 'First name' })}
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
              <Input
                label={t('AUTHENTICATION.lastName', { defaultValue: 'Last name' })}
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>

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
              autoComplete="new-password"
              required
            />

            {/* Terms acceptance */}
            <label className={styles.termsRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={accept}
                onChange={setAccept}
                aria-required="true"
              />
              <span className={styles.checkboxLabel}>
                {t('AUTHENTICATION.accept', { defaultValue: 'I accept the' })}{' '}
                <button
                  type="button"
                  className={styles.checkboxLink}
                  onClick={switchTerms}
                >
                  {t('AUTHENTICATION.terms', { defaultValue: 'Terms & Conditions' })}
                </button>
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={user.loading}
            >
              {t('AUTHENTICATION.register', { defaultValue: 'Create account' })}
            </Button>
          </form>

          {/* ── Footer ─────────────────────────────────────── */}
          <footer className={styles.footer}>
            <span className={styles.footerNote}>
              {t('AUTHENTICATION.haveAccount', { defaultValue: 'Already have an account?' })}
            </span>
            {' '}
            <Link to={PATH.LOGIN} className={styles.footerLink}>
              {t('AUTHENTICATION.login', { defaultValue: 'Sign in' })}
            </Link>

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

      {/* ── Terms & Conditions modal ──────────────────────── */}
      <Modal
        isOpen={terms}
        onClose={switchTerms}
        size="lg"
        title={t('AUTHENTICATION.terms', { defaultValue: 'Terms & Conditions' })}
      >
        <TermsAndCondition />
      </Modal>

    </AuthShell>
  )
}

const initialFormValues = {
  email:     '',
  password:  '',
  firstName: '',
  lastName:  ''
}

export default SignUp
