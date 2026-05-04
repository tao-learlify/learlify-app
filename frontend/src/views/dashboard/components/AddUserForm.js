import React, { memo, useCallback } from 'react'

import { Button } from 'components/ui'
import { useTranslation } from 'react-i18next'
import { ic_person_add } from 'react-icons-kit/md/ic_person_add'
import { ic_block } from 'react-icons-kit/md/ic_block'
import Icon from 'react-icons-kit'
import PropTypes from 'prop-types'

import useForm from 'hooks/useForm'

import Text from 'components/Text'
import FlexContainer from 'components/FlexContainer'

import {
  validateName,
  validateEmail,
  validatePassword
} from 'views/settings/validation'
import useAuthProvider from 'hooks/useAuthProvider'




const AddUserForm = ({ disabled, buttonCreateName, onSubmit }) => {
  const { t } = useTranslation()

  const { demo } = useAuthProvider()

  const [form, onChange, reset] = useForm(
    demo
      ? {
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        }
      : {
          firstName: '',
          lastName: '',
          email: ''
        }
  )
  /**
   *
   * @param {React.FormEventHandler<HTMLFormElement>} e
   */
  const handleSubmit = useCallback(
    e => {
      e.preventDefault()

      onSubmit && onSubmit({ ...form })
    },
    [form, onSubmit]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-3">
        <label className="block mb-1">
          <Text tag="small" color="muted">
            {t('AUTHENTICATION.firstName')}
          </Text>
        </label>
        <input
          disabled={disabled}
          name="firstName"
          onChange={onChange}
          type="text"
          value={form.firstName}
          placeholder={t('AUTHENTICATION.firstName')}
          className={`w-full p-2 rounded-lg border text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] ${!validateName(form.firstName) && form.firstName ? 'border-red-300' : validateName(form.firstName) ? 'border-green-300' : 'border-gray-200'}`}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">
          <Text tag="small" color="muted">
            {t('AUTHENTICATION.lastName')}
          </Text>
        </label>
        <input
          disabled={disabled}
          name="lastName"
          onChange={onChange}
          type="text"
          value={form.lastName}
          placeholder={t('AUTHENTICATION.lastName')}
          className={`w-full p-2 rounded-lg border text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] ${!validateName(form.lastName) && form.lastName ? 'border-red-300' : validateName(form.lastName) ? 'border-green-300' : 'border-gray-200'}`}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">
          <Text tag="small" color="muted">
            {t('AUTHENTICATION.email')}
          </Text>
        </label>
        <input
          disabled={disabled}
          name="email"
          onChange={onChange}
          type="email"
          value={form.email}
          placeholder={t('AUTHENTICATION.email')}
          className={`w-full p-2 rounded-lg border text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] ${validateEmail(form.email) ? 'border-green-300' : !validateEmail(form.email) && form.email ? 'border-red-300' : 'border-gray-200'}`}
        />
      </div>
      {demo && (
        <div className="mb-3">
          <label className="block mb-1">
            <Text tag="small" color="muted">
              {t('AUTHENTICATION.password')}
            </Text>
          </label>
          <input
            disabled={disabled}
            name="password"
            onChange={onChange}
            type="password"
            value={form.password}
            placeholder={t('AUTHENTICATION.insertPassword')}
            className={`w-full p-2 rounded-lg border text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] ${validatePassword(form.password) ? 'border-green-300' : !validatePassword(form.password) && form.password ? 'border-red-300' : 'border-gray-200'}`}
          />
        </div>
      )}
      <FlexContainer>
        <Button disabled={disabled} size="md" className="orange-primary" type="submit">
          <Icon icon={ic_person_add} className="icon" /> {buttonCreateName}
        </Button>
        <Button
          onClick={reset}
          size="md"
          className="ml-2 orange-primary"
          type="reset"
        >
          <Icon icon={ic_block} /> Reset
        </Button>
      </FlexContainer>
    </form>
  )
}

AddUserForm.propTypes = {
  buttonCreateName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func
}

export default memo(AddUserForm)
