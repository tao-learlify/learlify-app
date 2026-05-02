import { validateName } from '../../settings/validation'
import lang from 'lang'

/** @returns {boolean} */
export function loginUsernameValidator({ username }) {
  // eslint-disable-next-line no-useless-escape
  const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return {
    validation: emailExpression.test(username),
    message: 'El correo electrónico no es válido'
  }
}

export function loginNameValidator({ firstName, lastName }) {
  const validator = !validateName(firstName) || !validateName(lastName)

  return {
    validation: validator,
    message: lang.t('AUTHENTICATION.validation.name')
  }
}

export function loginPasswordValidator({ password }) {
  const passwordExpression = password.length
  return {
    validation: passwordExpression < 8,
    message: lang.t('AUTHENTICATION.validation.password')
  }
}

export function loginGoogleValidator({ email }) {
  // eslint-disable-next-line no-useless-escape
  const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return {
    validation: !emailExpression.test(email),
    message: lang.t('AUTHENTICATION.validation.email')
  }
}
