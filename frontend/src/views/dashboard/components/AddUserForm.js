import React, { memo, useCallback } from 'react'
import { Form } from 'react-bootstrap'
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
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>
          <Text tag="small" color="muted">
            {t('AUTHENTICATION.firstName')}
          </Text>
        </Form.Label>
        <Form.Control
          disabled={disabled}
          name="firstName"
          onChange={onChange}
          type="text"
          value={form.firstName}
          isInvalid={!validateName(form.firstName)}
          isValid={validateName(form.firstName)}
          placeholder={t('AUTHENTICATION.firstName')}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <Text tag="small" color="muted">
            {t('AUTHENTICATION.lastName')}
          </Text>
        </Form.Label>
        <Form.Control
          disabled={disabled}
          name="lastName"
          onChange={onChange}
          type="text"
          value={form.lastName}
          isInvalid={!validateName(form.lastName)}
          isValid={validateName(form.lastName)}
          placeholder={t('AUTHENTICATION.lastName')}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <Text tag="small" color="muted">
            {t('AUTHENTICATION.email')}
          </Text>
        </Form.Label>
        <Form.Control
          disabled={disabled}
          name="email"
          onChange={onChange}
          type="email"
          value={form.email}
          isValid={validateEmail(form.email)}
          isInvalid={!validateEmail(form.email)}
          placeholder={t('AUTHENTICATION.email')}
        />
      </Form.Group>
      {demo && (
        <Form.Group>
          <Form.Label>
            <Text tag="small" color="muted">
              {t('AUTHENTICATION.password')}
            </Text>
          </Form.Label>
          <Form.Control
            disabled={disabled}
            name="password"
            onChange={onChange}
            type="password"
            value={form.password}
            isValid={validatePassword(form.password)}
            isInvalid={!validatePassword(form.password)}
            placeholder={t('AUTHENTICATION.insertPassword')}
          />
        </Form.Group>
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
    </Form>
  )
}

AddUserForm.propTypes = {
  buttonCreateName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func
}

export default memo(AddUserForm)
