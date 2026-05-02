/* eslint-disable no-useless-escape */
import lang from 'lang'

/**
 * @description
 * Check if the name is valid.
 * Returns false is invalid.
 * @param {string} value
 * @returns {boolean}
 */
export function validateName(value) {
  const regexNameValidator = /^[a-zA-Z]+$/
  return regexNameValidator.test(value)
}

/**
 * @param {string} password 
 * @param {string} confirm 
 */
export function validatePassword(password, confirm) {
  const passwordRegex = /(?=.{8,16})/

  if (password !== confirm) {
    return lang.t('SETTINGS.validations.mustMatch')
  }

  if (!passwordRegex.test(password)) {
    return lang.t('SETTINGS.validations.lengthRequired')
  }

  return null
}

/**
 * @param {string} password 
 */
export function validateOnePassword(password) {
  const passwordRegex = /(?=.{8,16})/

  return passwordRegex.test(password)
}

/**
 * @param {string} email 
 */
export function validateEmail(email) {
  const emailExpression = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  return emailExpression.test(email)
}
