import * as TYPE from './types'

/**
 * @module
 * @description
 * This module is for action creators.
 * Simple, declarative actions objects for avoiding making imperative calls.
 */

/**
 * @typedef {Object} ActionCreator
 * @property {string} type
 * @property {{}} payload
 */

/**
 * @returns {ActionCreator}
 */
export function serviceError(error = { clear: false }) {
  if (error.clear) {
    return {
      type: TYPE.SERVICE_ERROR_CLEAR
    }
  }

  return {
    type: TYPE.SERVICE_ERROR,
    payload: 'Something went wrong'
  }
}

/**
 * @param {number} statusCode
 * @returns {ActionCreator}
 */
export function serviceFailWithStatusCode(value, message) {
  const payload = typeof statusCode === 'object' ? value.statusCode : value

  return {
    type: TYPE.HTTP_ERROR,
    payload,
    message
  }
}

/**
 * @returns {ActionCreator}
 */
export function serviceFailWithStatusCodeEnd() {
  return {
    type: TYPE.REMOVE_HTTP_ERROR
  }
}


/**
 * @returns {ActionCreator}
 */
export function refreshToken() {
  return {
    type: TYPE.REFRESH_TOKEN
  }
}


/**
 * @param {boolean} mode
 */
export function selectNavigationMode (mode) {
  return {
    type: TYPE.SELECT_NAVIGATION_TOUR,
    payload: mode
  }
} 