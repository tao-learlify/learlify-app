import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ToastsStore } from 'react-toasts'
import { Card, Button, Input } from 'components/ui'
import useForm from 'hooks/useForm'
import useToggler from 'hooks/useToggler'
import useLocalStorage from 'hooks/useLocalStorage'
import { ModuleValidaton } from 'common/module.validation'
import {
  loginNameValidator,
  loginPasswordValidator
} from 'views/authentication/validation/login'
import { updateProfileThunk } from 'store/@thunks/auth'
import { validateName } from '../../validation'
import styles from './ProfileInfoCard.module.scss'

/**
 * @param {Object} props
 * @param {Object} props.profile - User profile from auth state
 * @param {boolean} [props.demo]
 */
const ProfileInfoCard = ({ profile, demo }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const ls = useLocalStorage()

  const [form, onChange] = useForm({
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName
  })

  const [isEdit, setIsEdit] = useToggler()

  const [passwordForm, onPasswordChange, resetPasswordForm] = useForm({
    password: '',
    confirm: ''
  })

  const handlePasswordUpdate = () => {
    const validations = [loginPasswordValidator]
    const formValidation = validations.findIndex(v =>
      ModuleValidaton.apply(v, passwordForm)
    )
    if (ModuleValidaton.isValid(formValidation)) {
      return dispatch(
        updateProfileThunk({
          firstName: profile.firstName,
          lastName: profile.lastName,
          password: passwordForm.password
        })
      )
        .catch(() => ToastsStore.error(t('SETTINGS.error')))
        .then(() => {
          ToastsStore.success(t('SETTINGS.update'))
          resetPasswordForm()
        })
    }
    return ToastsStore.info(validations[formValidation](passwordForm).message)
  }

  const handleSave = () => {
    const validations = [loginNameValidator]
    const formValidation = validations.findIndex(v =>
      ModuleValidaton.apply(v, form)
    )

    if (ModuleValidaton.isValid(formValidation)) {
      return dispatch(
        updateProfileThunk({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName
        })
      )
        .catch(() => ToastsStore.error(t('SETTINGS.error')))
        .then(() => {
          ToastsStore.success(t('SETTINGS.update'))
          ls.setItem(profile.token)
          setIsEdit(false)
        })
    }

    return ToastsStore.info(validations[formValidation](form).message)
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.workspaceHeader}>
        <div>
          <h2 className={styles.workspaceTitle}>
            {t('SETTINGS.PROFILE.title')}
          </h2>
          <p className={styles.workspaceDesc}>
            {t('SETTINGS.PROFILE.description')}
          </p>
        </div>
        {!isEdit && (
          <button
            className={styles.btnEdit}
            onClick={setIsEdit}
            disabled={demo}
          >
            {t('SETTINGS.PROFILE.editInfo')}
          </button>
        )}
      </div>

      <Card elevated>
        <Card.Body>
          {isEdit ? (
            <>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <Input
                    label={t('SETTINGS.name')}
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={onChange}
                    disabled={demo}
                    error={!validateName(form.firstName) ? ' ' : undefined}
                  />
                </div>

                <div className={styles.formField}>
                  <Input
                    label={t('SETTINGS.lastName')}
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={onChange}
                    disabled={demo}
                    error={!validateName(form.lastName) ? ' ' : undefined}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <Input
                  label={t('SETTINGS.email')}
                  type="email"
                  value={form.email}
                  readOnly
                  hint={t('SETTINGS.PROFILE.emailReadOnly')}
                />
              </div>

              <div className={styles.actions}>
                <Button onClick={handleSave} disabled={demo}>
                  {t('SETTINGS.save')}
                </Button>
                <Button variant="ghost" onClick={setIsEdit}>
                  {t('SETTINGS.cancel')}
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.fieldRows}>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('SETTINGS.name')}</span>
                <span className={styles.fieldValue}>{form.firstName}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>
                  {t('SETTINGS.lastName')}
                </span>
                <span className={styles.fieldValue}>{form.lastName}</span>
              </div>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{t('SETTINGS.email')}</span>
                <span className={styles.fieldValue}>{form.email}</span>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card elevated>
        <Card.Body>
          <span className={styles.sectionLabel}>
            {t('SETTINGS.SECURITY.changePasswordTitle')}
          </span>
          <div className={styles.formField}>
            <Input
              label={t('SETTINGS.SECURITY.newLabel')}
              name="password"
              type="password"
              value={passwordForm.password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              disabled={demo}
            />
          </div>
          <div className={styles.formField}>
            <Input
              label={t('SETTINGS.SECURITY.confirmLabel')}
              name="confirm"
              type="password"
              value={passwordForm.confirm}
              onChange={onPasswordChange}
              placeholder="••••••••"
              disabled={demo}
            />
          </div>
          <div className={styles.actions}>
            <Button
              onClick={handlePasswordUpdate}
              disabled={demo || !passwordForm.password || !passwordForm.confirm}
            >
              {t('SETTINGS.SECURITY.updateButton')}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

ProfileInfoCard.defaultProps = {
  demo: false
}

export default ProfileInfoCard
