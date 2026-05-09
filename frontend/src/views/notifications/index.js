import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { eye } from 'react-icons-kit/fa/eye'
import { eyeSlash } from 'react-icons-kit/fa/eyeSlash'
import { ic_done_all } from 'react-icons-kit/md/ic_done_all'
import { ic_assignment_turned_in } from 'react-icons-kit/md/ic_assignment_turned_in'
import { useTranslation } from 'react-i18next'

import Icon from 'react-icons-kit'
import moment from 'moment'
import classNames from 'clsx'

import useNotifications from 'hooks/useNotifications'

import FlexContainer from 'components/FlexContainer'
import Pagination from 'components/Pagination'
import Template from 'components/Template'
import Text from 'components/Text'
import { NotificationType } from 'components/Notifications'

import styles from './styles.module.scss'
import api from 'api'
import { markAsReadNotification } from 'store/@reducers/notifications'
import {
  fetchNotificationsThunk,
  markAllAsReadThunk
} from 'store/@thunks/notifications'
import { ToastsStore } from 'react-toasts'
import Notification from 'components/Notification'

const NotificationsView = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [page, setPage] = useState(1)

  const {
    fetchNotifications,
    data,
    loading,
    pagination,
    unreads
  } = useNotifications()

  useEffect(() => {
    fetchNotifications({ page })
  }, [fetchNotifications, page])

  /**
   * @description
   * Clear notifications
   */
  useEffect(() => {
    return () => {
      dispatch(fetchNotificationsThunk())
    }
  }, [dispatch])

  /**
   * @description
   * Changes page.
   * @param {number} page
   */
  const handleChangePage = page => {
    setPage(page)
  }

  /**
   * @param {Notification} notification
   */
  const handleMarkAsRead = async notification => {
    if (notification.read === false) {
      dispatch(
        markAsReadNotification({
          ...notification,
          stash: true
        })
      )

      await api.notifications.markAsReadNotification(notification)
    }
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadThunk({ read: true })).then(() =>
      ToastsStore.success('Operación completada')
    )
  }

  return (
    <Template view withLoader={loading}>
      <>
        <Text
          className={unreads > 0 ? styles.mark : styles.uptodate}
          bold={unreads > 0}
          tag="small"
          color="muted"
          onClick={unreads > 0 && handleMarkAllAsRead}
        >
          {unreads > 0
            ? t('NOTIFICATIONS.markAllAsRead')
            : t('NOTIFICATIONS.upToDate')}
          <span className={styles.margin} />
          <Icon
            className={classNames(
              unreads > 0 ? 'text-info' : 'text-success',
              styles.icon
            )}
            icon={unreads > 0 ? ic_assignment_turned_in : ic_done_all}
          />
        </Text>
      </>
      <ul className="rounded-xl overflow-hidden divide-y divide-gray-100 border border-gray-100 bg-white">
        {data.map(notification => (
          <li
            onClick={() => handleMarkAsRead(notification)}
            className={classNames(
              notification.read || styles.unread,
              'p-4',
              'flex',
              'flex-col',
              'items-start',
              'cursor-pointer',
              'hover:bg-gray-50',
              'transition-colors'
            )}
            key={notification.id}
          >
            <FlexContainer justifyContent="space-between">
              <Text color="blue" tag="small">
                <NotificationType
                  context={notification.notificationType.context}
                />{' '}
                <Notification
                  context={notification.notificationType.name}
                  message={notification.message}
                />
              </Text>
              <div>
                <Text color="muted" tag="small">
                  {moment(notification.createdAt).fromNow()}
                </Text>
                <Icon
                  className="ml-2 text-muted"
                  icon={notification.read ? eye : eyeSlash}
                />
              </div>
            </FlexContainer>
          </li>
        ))}
      </ul>
      <br />
      <FlexContainer>
        {pagination && pagination.total >= pagination.limit && (
          <Pagination {...pagination} onClick={handleChangePage} />
        )}
      </FlexContainer>
    </Template>
  )
}

export default NotificationsView
