import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { Button, Input } from 'components/ui'

import useForm from 'hooks/useForm'
import { validateOnePassword } from 'views/settings/validation'

import styles from '../auth.module.scss'

/**
 * FormPassword — New password entry with confirmation + match feedback.
 * Used by ResetPassword screen.
 *
 * @param {(form: { password: string, confirm: string }) => void} onSubmit
 */
const FormPassword = memo(function FormPassword({ onSubmit }) {
  const { t } = useTranslation()

  const [form, onChange] = useForm({ password: '', confirm: '' })

  const passwordsMatch = form.password === form.confirm
  const passwordValid  = validateOnePassword(form.password)
  const confirmValid   = validateOnePassword(form.confirm)
  const showMatch      = form.confirm !== '' && (passwordsMatch
    ? passwordValid
    : true
  )

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      onSubmit({ ...form })
    },
    [form, onSubmit]
  )

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label={t('AUTHENTICATION.resetFormLabel', { defaultValue: 'Set new password form' })}
    >
      <Input
        label={t('AUTHENTICATION.password', { defaultValue: 'New password' })}
        name="password"
        type="password"
        value={form.password}
        onChange={onChange}
        autoComplete="new-password"
        required
      />

      <Input
        label={t('AUTHENTICATION.confirm', { defaultValue: 'Confirm password' })}
        name="confirm"
        type="password"
        value={form.confirm}
        onChange={onChange}
        autoComplete="new-password"
        required
        error={
          showMatch && !passwordsMatch
            ? t('AUTHENTICATION.passwordMustMatch', { defaultValue: 'Passwords do not match' })
            : undefined
        }
      />

      {/* Match success feedback */}
      {showMatch && passwordsMatch && passwordValid && (
        <p
          className={clsx(styles.passwordHint, styles.passwordHintMatch)}
          role="status"
          aria-live="polite"
        >
          ✓ {t('AUTHENTICATION.passwordMatch', { defaultValue: 'Passwords match' })}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!passwordsMatch || !passwordValid || !confirmValid}
      >
        {t('AUTHENTICATION.update', { defaultValue: 'Set new password' })}
      </Button>
    </form>
  )
})

export default FormPassword
