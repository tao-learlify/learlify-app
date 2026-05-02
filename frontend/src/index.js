import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import moment from 'moment'
import { I18nextProvider } from 'react-i18next'

/**
 * @description
 * Styles should stay before <App /> Component mount.
 */
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'animate.css'
import 'react-dragula/dist/dragula.css'
import 'hover.css/css/hover.css'
import 'assets/css/index.css'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'
import '@brainhubeu/react-carousel/lib/style.css'
import './design-system/index.css'

import App from './App'
import store from 'store'
import polifyll from 'polyfill'
import lang from 'lang'
import reportWebVitals from './reportWebVitals'
import * as serviceWorker from './serviceWorker'

import FallbackMode from 'components/FallbackMode'

polifyll.MediaRecorder.load()
polifyll.URLSearchParams.load()
polifyll.Map.load()
polifyll.getUserMedia.load()

moment.locale(lang.language)

const root = document.getElementById('root')

if (import.meta.env.PROD) {
  console.error = function () {}
}
/**
 * @description
 * Referencial links on this index file about libraries.
 */

/**
 * @see https://react-bootstrap.github.io/
 * @see https://daneden.github.io/animate.css/
 * @see https://github.com/bevacqua/react-dragula
 * @see https://www.i18next.com/overview/getting-started
 */

ReactDOM.render(
  <Suspense fallback={<FallbackMode />}>
    <Provider store={store}>
      <I18nextProvider i18n={lang}>
        <App />
      </I18nextProvider>
    </Provider>
  </Suspense>,
  root
)

reportWebVitals()
/**
 * PWA Service Worker.
 * Don't touch this if you don't know how this works.
 * Also very important for caching content offline.
 */
serviceWorker.register()
