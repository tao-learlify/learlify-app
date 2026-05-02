import config from 'config'
import lang from 'lang'

export const language = {
  'Accept-Language': lang.language
}

/**
 * @type {string}
 */
export const originhost = config.API_URL
/**
 * @param {{ endpoint: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE', external?: boolean, headers: Headers, body: {}, responseType: 'json' | 'blob' }}
 * @returns {Promise<any>}
 */
export default function httpService({
  method,
  endpoint,
  external = false,
  headers,
  body,
  raw = false,
  responseType = 'json'
}) {
  const host = external ? endpoint : originhost + endpoint
  if (method === 'POST' || method === 'PUT') {
    return new Promise((resolve, reject) => {
      try {
        fetch(host, {
          method,
          headers,
          body: raw ? body : JSON.stringify(body)
        })
          .then(data => data[responseType]())
          .then(json => resolve(json))
          .catch(err => reject(err))
      } catch (e) {
        return reject(e)
      }
    })
  }
  return new Promise((resolve, reject) => {
    try {
      fetch(host, {
        method,
        headers
      })
        .then(data => data[responseType]())
        .then(json => resolve(json))
        .catch(err => reject(err))
    } catch (e) {
      return reject(e)
    }
  })
}
