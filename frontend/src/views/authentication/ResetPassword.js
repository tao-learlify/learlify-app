import React, { memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { useTranslation } from 'react-i18next'
import { compose } from 'redux'

import { AuthShell } from 'components/layout/AuthShell'
import { withLogout } from 'hocs'

import FormPassword from './components/FormPassword'

import useQuery from 'hooks/useQuery'
import useQueryValidation from 'hooks/useQueryValidation'
import useToggler from 'hooks/useToggler'

import api from 'api'
import PATH from 'utils/path'
import Panda from 'assets/illustrations/pandas/panda.svg'
import brandLogo from 'assets/illustrations/brand/logo.svg'

import styles from './auth.module.scss'

const ResetPassword = () => {
  const history   = useHistory()
  const { t }     = useTranslation()
  const { code }  = useQuery()

  const [loading, setLoading] = useToggler()

  useQueryValidation(
    { required: ['code'] },
    exception => {
      if (exception) history.push({ pathname: '/' })
    }
  )

  const handleSubmit = useCallback(
    async ({ password }) => {
      setLoading(true)

      try {
        await api.auth.resetPassword({ code, password })

        ToastsStore.success(t('AUTHENTICATION.updateQuickPassword'))
        history.push(PATH.LOGIN)
      } catch {
        ToastsStore.warning(t('AUTHENTICATION.updateFailedPassword'))
      } finally {
        setLoading(false)
      }
    },
    [code, history, setLoading, t]
  )

  return (
    <AuthShell loading={loading}>
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
              {t('AUTHENTICATION.resetPasswordTitle', { defaultValue: 'New password' })}
            </h1>
            <p className={styles.subtitle}>
              {t('AUTHENTICATION.resetPasswordSubtitle', {
                defaultValue: 'Choose a strong password to protect your account'
              })}
            </p>
          </header>

          {/* ── Password form ───────────────────────────────── */}
          <FormPassword onSubmit={handleSubmit} />

        </div>
      </div>
    </AuthShell>
  )
}

export default compose(withLogout, memo)(ResetPassword)
