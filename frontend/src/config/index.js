/**
 * @fileoverview
 * WARNING!!! we defined our ENV and client configuration in this file.
 * This never should be removed in any circunstances, be sure to modifiy these
 * Values in out object properties, anyways values are inmutable, and cannot be modified.
 * During the execution on React APP.
 * References:
 * @see https://console.developers.google.com/
 * @see https://stripe.com/docs/recipes/elements-react
 * @see https://aws.amazon.com/es/cloudfront/
 */

/**
 * @typedef {Object} ConfigurationApp
 * @property {string} API_URL
 * @property {string} CLOUDFRONT
 * @property {string} GOOGLE_CLIENT_ID
 * @property {string} FACEBOOK_APP_ID
 * @property {string} STRIPE_API_KEY
 * @property {string} STRIPE_PUBLIC_API_KEY
 * @property {string} FALLBACK_LANGUAGE
 * @property {string} WEBSOCKET_URL
 * @property {string} TIMEZONE
 * @property {string} REDUX_LOGGER
 * @property {boolean} PRODUCTION
 * @property {boolean} DEVELOPMENT
 */

const { freeze } = Object
/**
 * @type {ConfigurationApp}
 */
const config = freeze({
  API_URL: import.meta.env.VITE_API_URL,
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  TELEGRAM_CLIENT_ID: import.meta.env.VITE_TELEGRAM_CLIENT_ID,
  STRIPE_API_KEY: import.meta.env.VITE_STRIPE,
  CLOUDFRONT: import.meta.env.VITE_CLOUDFRONT,
  FALLBACK_LANGUAGE: import.meta.env.VITE_FALLBACK_LANGUAGE,
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET,
  WEBSOCKET_HASH: import.meta.env.VITE_WEBSOCKET_HASH,
  TIMEZONE: 'Europe/Madrid',
  PRODUCTION: import.meta.env.PROD,
  DEVELOPMENT: import.meta.env.DEV
})

export default config
