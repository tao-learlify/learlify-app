import { useSelector, shallowEqual } from 'react-redux'
import { selectorFromUseNotification } from 'store/selectors/hooks'
import { notify } from 'store/actions/action'
import useAsyncEffect from './useAsyncEffect'

/**
 * @typedef {Object} Notification
 * @property {string} message
 * @property {string} event
 * @property {{}} context
 * @param {(notification: Notification) => void} callback
 * @param {{ sound?: boolean }}
 */
function useNotification(callback) {
  const { event, message, notified, type } = useSelector(
    selectorFromUseNotification,
    shallowEqual
  )

  const refCallback = () => {
    if (callback) {
      callback({
        event,
        message,
        context: type
      })
    }
  }

  useAsyncEffect(refCallback, [notified], notify)
}

export default useNotification
