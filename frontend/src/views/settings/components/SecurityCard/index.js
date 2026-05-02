import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ToastsStore } from 'react-toasts'
import { Card, Button, Input } from 'components/ui'
import useForm from 'hooks/useForm'
import { ModuleValidaton } from 'common/module.validation'
import { loginPasswordValidator } from 'views/authentication/validation/login'
import { updateProfileThunk } from 'store/@thunks/auth'
import styles from './SecurityCard.module.scss'

/**
 * @param {Object} props
 * @param {Object} props.profile - User profile from auth state
 * @param {boolean} [props.demo]
 */
const SecurityCard = ({ profile, demo }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [form, onChange, resetForm] = useForm({
    password: '',
    confirm: ''
  })

  const handleSubmit = () => {
    const validations = [loginPasswordValidator]
    const formValidation = validations.findIndex(v =>
      ModuleValidaton.apply(v, form)
    )

    if (ModuleValidaton.isValid(formValidation)) {
      return dispatch(
        updateProfileThunk({
          firstName: profile.firstName,
          lastName: profile.lastName,
          password: form.password
        })
      )
        .catch(() => ToastsStore.error(t('SETTINGS.error')))
        .then(() => {
          ToastsStore.success(t('SETTINGS.update'))
          resetForm()
        })
    }

    return ToastsStore.info(validations[formValidation](form).message)
  }

  return (
    <Card elevated>
      <Card.Body>
        <span className={styles.sectionLabel}>
          {t('SETTINGS.SECURITY.title')}
        </span>

        <div className={styles.formGroup}>
          <Input
            label={t('SETTINGS.SECURITY.newLabel')}
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            disabled={demo}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label={t('SETTINGS.SECURITY.confirmLabel')}
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={onChange}
            placeholder="••••••••"
            disabled={demo}
          />
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleSubmit}
            disabled={demo || !form.password || !form.confirm}
          >
            {t('SETTINGS.SECURITY.updateButton')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

SecurityCard.defaultProps = {
  demo: false
}

export default SecurityCard
