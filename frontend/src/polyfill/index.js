import WebKitMediaRecorder, { encoder } from 'audio-recorder-polyfill'
import 'url-search-params-polyfill'
import Map from 'es6-map'

/**
 * @description
 * In this module we will add all polifylls for our services.
 * Each module should contain the property load that replaces the window property.
 */

const polyfill = {
  MediaRecorder: {
    load() {
      if (!window.MediaRecorder) {
        window.MediaRecorder = WebKitMediaRecorder
        window.MediaRecorder.encoder = encoder
        window.MediaRecorder.mimetype = 'audio/mpeg3'
      }
    }
  },
  URLSearchParams: {
    load() {
      // url-search-params-polyfill applies itself as a side-effect on import
    }
  },
  Map: {
    load() {
      if (!window.Map) {
        window.Map = Map
      }
    }
  },
  getUserMedia: {
    load() {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
    }
  }
}

export default polyfill
