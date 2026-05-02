import { getSessionToken } from './localStorage'
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
 */

/**
 * @param {{}} obj
 */
const createUrlWithParameters = obj=> {
  return obj && typeof obj === 'object' && !obj.length
  ? Object.keys(obj).map(function(key) {
    return [key, obj[key]].map(encodeURIComponent).join('=');
  }).join('&')
  : obj;
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
  queries,
  raw,
  response = 'json',
  requiresAuth = false,
  timezone = false,
}) => {
  /**
   * @type {string}
   */
  const resourceURI = external ? endpoint : config.API_URL.concat(endpoint)
  
  const url = queries ? resourceURI.concat('?', createUrlWithParameters(queries)) : resourceURI

  return new Promise(async (resolve, reject) => {
    try {
      if (method === 'POST' || method === 'PUT') {
        /**
         * @description
         * Fetching resources.
         */
        const request = await fetch(queries ? url : resourceURI, {
          body: raw ? body : JSON.stringify(body || {}),

          headers: {
            ...defaultHeaders,
            ...headers,
            Authorization: requiresAuth ? getSessionToken() : null,
            'The-Timezone-IANA': timezone ? moment.tz.guess() : null
          },
          method
        })

        const data = await request[response]()

        if (request.ok) {
          /**
           * @description
           * Getting data response.
           */

          return resolve(data)
        }

        return resolve({
          message: data.message || 'Empty message',
          statusCode: data.statusCode || 200,
          response: data.response || {}
        })
      } else {
        /**
         * @description
         * Fetching resources.
         */
        const request = await fetch(queries ? url : resourceURI, {
          headers: {
            ...defaultHeaders,
            ...headers,
            Authorization: requiresAuth ? getSessionToken() : null,
            'The-Timezone-IANA': timezone ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined
          },
          method
        })

        const data = await request[response]()

        if (request.ok) {
          /**
           * @description
           * Getting data response.
           */

          return resolve(data)
        }

        return resolve({
          message: data.message || 'Empty message',
          statusCode: data.statusCode,
          response: data.response || {}
        })
      }
    } catch (e) {
      return reject(e)
    }
  })
}

export default httpClient