import { useEffect, useState } from 'react'

const scriptStatus = {
  loading: 'loading',
  idle: 'idle',
  ready: 'ready',
  error: 'error',
  load: 'load'
}

/**
 * @typedef {Object} UseScript
 * @property {boolean} async
 * @property {'anonymous'} crossOrigin
 * @property {boolean} defer
 * @property {boolean} src
 */

/**
 * @param {UseScript} source
 */
function useScripts(source) {
  const [status, setStatus] = useState(
    source.src ? scriptStatus.loading : scriptStatus.idle
  )

  useEffect(() => {
    if (source.src) {
      
      const script = document.querySelector(`script[src="${source.src}"]`)

      /**
       * @description
       * Avoiding falsy values expressions.
       */
      if (script === null || script === undefined) {
        const addedScript = document.createElement('script')

        addedScript.src = source.src
        addedScript.async = source.async
        addedScript.defer = source.defer
        addedScript.crossOrigin = source.crossOrigin

        addedScript.setAttribute('data-status', scriptStatus.loading)

        document.body.appendChild(addedScript)

        const setAttributeFromEvent = event => {
          addedScript.setAttribute(
            'data-status',
            event.type === scriptStatus.load
              ? scriptStatus.ready
              : scriptStatus.error
          )
        }

        script.addEventListener(scriptStatus.load, setAttributeFromEvent)
        script.addEventListener(scriptStatus.error, setAttributeFromEvent)
      } else {
        setStatus(script.getAttribute('data-status'))
      }

      const setStateFromEvent = (event) => {
        setStatus(event.type === scriptStatus.load ? scriptStatus.ready : scriptStatus.error);
      };
      return () => {
        if (script) {
          script.removeEventListener(scriptStatus.load, setStateFromEvent)
          script.removeEventListener(scriptStatus.error, setStateFromEvent)
        }
      }
    } else {
      setStatus(scriptStatus.idle)
    }
  }, [source])

  return status
}

export default useScripts
