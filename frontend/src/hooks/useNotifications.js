import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotificationsThunk } from 'store/@thunks/notifications'
import { notificationsSelector } from 'store/@selectors/notifications'
import { initialArguments } from 'hooks'

/**
 * @returns {import('store/reducers/notifications').NotificationState}
 */
function useNotifications({ preload } = initialArguments) {
  const notifications = useSelector(notificationsSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    if (preload) {
      const stream = dispatch(fetchNotificationsThunk())

      return () => {
        stream.abort()
      }
    }
  }, [dispatch, preload])

  const fetchNotifications = useCallback((options) => {
    const stream = dispatch(fetchNotificationsThunk(options))

    return () => {
      stream.abort()
    }
  }, [dispatch])

  return {
    ...notifications,
    fetchNotifications
  }
}

export default useNotifications
