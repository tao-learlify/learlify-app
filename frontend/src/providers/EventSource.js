import { useEffect } from 'react'

import config from 'config'

const source = new EventSource(config.API_URL)
/**
 * @type {React.FunctionComponent<{}>}
 */
const EventSourceProvider = ({ children }) => {
  useEffect(() => {
    source.addEventListener('open', console.log)

    source.addEventListener('close', console.log)

    source.addEventListener('message', console.log)
  }, [])

  return children
}

export default EventSourceProvider
