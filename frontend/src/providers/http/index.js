import { getSessionToken } from 'utils/localStorage'
import { getHttpRequestStatusCodeContext } from 'modules/request'

import config from 'config'
import lang from 'lang'
import moment from 'moment-timezone'

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept-Language': lang.language
}

/**
 * @typedef {Object} QueryParameter
 * @property {string} key
 * @property {any} value
 */

/**
 * @typedef {Object} HttpClientOptions
 * @property {any} body
 * @property {string} endpoint
 * @property {boolean} external
 * @property {'DELETE' | 'GET' | 'POST' | 'PUT' | 'PATCH'} method
 * @property {Array<QueryParameter>} queries
 * @property {RequestInit} headers
 * @property {boolean} raw
 * @property {boolean} requiresAuth
 * @property {'blob' | 'json'} response
 * @property {boolean} timezone
 * @property {AbortSignal} signal
 * @property {string []} params
 */

export const DELETE = 'DELETE'
export const GET = 'GET'
export const PATCH = 'PATCH'
export const POST = 'POST'
export const PUT = 'PUT'
/**
 *
 * @param {string} endpoint
 * @param {{ query?: boolean, params?: boolean }} params
 * @param {{}} parameters
 */
const createUrlWithParameters = params => {
  return Object.keys(params)
    .map(key => [key, params[key]].map(encodeURIComponent).join('='))
    .join('&')
}

/**
 * @description
 * Returns the current fetch resource based on a fetch wrapper.
 * @param {HttpClientOptions} options
 * @returns {Promise<HttpRequest>}
 */
const httpClient = ({
  body,
  endpoint,
  external,
  headers,
  method,
  normalize,
  queries,
  params,
  raw,
  response = 'json',
  requiresAuth = false,
  timezone = false,
  signal
}) => {
  /**
   * @type {string}
   */
  const resourceURI = external ? endpoint : config.API_URL.concat(endpoint)

  const url = queries
    ? resourceURI.concat('?', createUrlWithParameters(queries))
    : resourceURI

  return new Promise(async (resolve, reject) => {
    try {
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        const baseUrl = params
          ? params.reduce((path, param) => path.concat('/', param), url)
          : url

        const localHeaders = {
          ...defaultHeaders,
          ...headers
        }

        if (normalize) {
          delete localHeaders['Content-Type']
        }
        /**
         * @description
         * Fetching resources.
         */
        const request = await fetch(queries || params ? baseUrl : resourceURI, {
          body: raw ? body : JSON.stringify(body || {}),
          headers: {
            ...localHeaders,
            Authorization: requiresAuth ? getSessionToken() : null,
            'The-Timezone-IANA': timezone ? moment.tz.guess() : null
          },
          method,
          signal
        })

        const data = await request[response]()

        if (request.ok) {
          const httpRequest = getHttpRequestStatusCodeContext(data)
          /**
           * @description
           * Getting data response.
           */

          return resolve(httpRequest)
        }

        return reject(getHttpRequestStatusCodeContext({
          message: data.message || 'Empty message',
          statusCode: data.statusCode,
          failed: true
        }))
      } else {
        const baseUrl = params
          ? params.reduce((path, param) => path.concat('/', param), url)
          : url

        /**
         * @description
         * Fetching resources.
         */
        const request = await fetch(queries || params ? baseUrl : resourceURI, {
          headers: {
            ...defaultHeaders,
            ...headers,
            Authorization: requiresAuth ? getSessionToken() : null,
            'The-Timezone-IANA': timezone ? moment.tz.guess() : undefined
          },
          method,
          signal
        })

        const data = await request[response]()

        if (request.ok) {
          const httpRequest = getHttpRequestStatusCodeContext(data)
          /**
           * @description
           * Getting data response.
           */

          return resolve(httpRequest)
        }

        return reject(getHttpRequestStatusCodeContext({
          message: data.message || 'Empty message',
          statusCode: data.statusCode,
          failed: true
        }))
      }
    } catch (e) {
      return reject(e)
    }
  })
}

/**
 * 
 * @param {HttpRequest} 
 * @returns 
 */
export function unwrapThunk({ response }) {
  return response
}

export default httpClient
