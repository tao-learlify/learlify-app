import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LaguageDetector from 'i18next-browser-languagedetector'

import config from 'config'

import es from 'lang/locales/es'
import en from 'lang/locales/en'

/**
 * @readonly
 * Supported languages.
 */
const languages = ['es', 'en']

/**
 * @see https://react.i18next.com/latest/using-with-hooks
 * @see https://react.i18next.com/
 **/

i18n
  .use(LaguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: config.FALLBACK_LANGUAGE || 'es',
    debug: false,
    detection: {
      caches: ['cookie', 'localStorage'],
      excludeCacheFor: ['cimode'],
      lookupCookie: 'locale',
      lookupLocalStorage: 'locale',
      order: ['cookie', 'localStorage', 'navigator']
    },
    whitelist: languages,
    interpolation: {
      escapeValue: false
    },
    resources: {
      es: {
        translation: es
      },
      en: {
        translation: en
      }
    }
  })

export default i18n
