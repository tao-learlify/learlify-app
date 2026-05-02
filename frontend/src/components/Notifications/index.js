import React, { useCallback } from 'react'
import moment from 'moment'
import Icon from 'react-icons-kit'
import classNames from 'clsx'
import api from 'api'
import { StageSpinner } from 'react-spinners-kit'
import { ic_notifications_active } from 'react-icons-kit/md/ic_notifications_active'
import { ic_warning } from 'react-icons-kit/md/ic_warning'
import { ic_error } from 'react-icons-kit/md/ic_error'
import { androidCheckmarkCircle } from 'react-icons-kit/ionicons/androidCheckmarkCircle'
import { ic_info } from 'react-icons-kit/md/ic_info'
import { ic_close } from 'react-icons-kit/md/ic_close'

import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useNotifications from 'hooks/useNotifications'
import useSettings from 'hooks/useSettings'

import { markAsReadNotification } from 'store/@reducers/notifications'

import FlexContainer from 'components/FlexContainer'
import Notification from 'components/Notification'
import Text from 'components/Text'

import styles from './styles.module.scss'
import PATH from 'utils/path'
import { BLUE } from 'assets/colors'
import { updateDocumentTitleWithNotification } from 'providers/document'

export const NotificationType = ({ context }) => {
  switch (context) {
    case 'info':
      return <Icon className="text-info" icon={ic_info} />

    case 'success':
      return <Icon className="text-success" icon={androidCheckmarkCircle} />

    case 'warning':
      return <Icon className="text-warning" icon={ic_warning} />

    case 'danger':
      return <Icon className="text-danger" icon={ic_error} />

    default:
      return <React.Fragment />
  }
}
/**
 * @typedef {Object} NotificationsProp
 * @property {boolean} open
 * @property {() => void} onNavigate
 */
/**
 * @type {React.FunctionComponent<NotificationsProp>}
 */
const Notifications = ({ open, onNavigate }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const history = useHistory()

  const settings = useSettings()

  const notifications = useNotifications()

  const handleMarkAsRead = useCallback(
    /**
     * @description
     * Will mark as read notification.
     * @param {import ('store/@reducers/notifications').Notification}
     */
    async notification => {
      dispatch(markAsReadNotification(notification))

      /**
       * @description
       * Updating notification tab, if notifications are cleared, se set the current app title.
       */
      updateDocumentTitleWithNotification(
        notifications.data.length - 1,
        settings.appTitle
      )

      /**
       * @description
       * Removing notification synchronously.
       */
      await api.notifications.markAsReadNotification(notification)
    },
    [dispatch, notifications.data.length, settings.appTitle]
  )

  /**
   * @description
   * Navigates to the current view.
   */
  const handleNotifications = () => {
    if (onNavigate) {
      onNavigate()
    }

    document.title = settings.appTitle

    history.push({
      pathname: PATH.NOTIFICATIONS
    })
  }

  /**
   * @description
   * If the notifications aren't open in the natifications view, should be displayed without problems.
   */
  const isNotHandledByNotificationsView = () => {
    return history.location.pathname !== PATH.NOTIFICATIONS
  }

  /**
   * @description
   * I18next render messages
   */

  const notificationsTitleMessage = t('COMPONENTS.NOTIFICATIONS.title')

  const notificationsNotAvailable = t('COMPONENTS.NOTIFICATIONS.unavailable')

  const notificationsRouteMessage = t('COMPONENTS.NOTIFICATIONS.goto')

  return (
    <motion.div
      animate={open ? 'opened' : 'closed'}
      initial={false}
      variants={variants.menu}
      className={styles.notifications}
    >
      <Text className={styles.title} center color="blue" tag="h2">
        {notificationsTitleMessage}
      </Text>
      {notifications.loading ? (
        <FlexContainer>
          <StageSpinner color={BLUE} size={120} />
        </FlexContainer>
      ) : notifications.data.length === 0 ? (
        <motion.div variants={variants} initial="start" animate="end">
          <FlexContainer>
            <Text className={styles.info} center color="muted" tag="small">
              {notificationsNotAvailable}
            </Text>
          </FlexContainer>
          <hr />
        </motion.div>
      ) : (
        open &&
        isNotHandledByNotificationsView() && (
          <motion.div variants={variants.ul} initial="start" animate="end">
            {notifications.data.map(notification => (
              <AnimatePresence variants={variants.li} key={notification.id}>
                <motion.div
                  key={notification.id}
                  className={styles.item}
                  variants={variants.li}
                  positionTransition
                >
                  <Text
                    bold
                    className={styles.message}
                    color="blue"
                    tag="small"
                  >
                    <Notification
                      context={notification.notificationType.name}
                      message={notification.message}
                    />
                    <Icon
                      className={classNames(
                        'float-right',
                        'text-muted',
                        styles.mark
                      )}
                      icon={ic_close}
                      onClick={() => handleMarkAsRead(notification)}
                    />
                  </Text>
                  <Text className={styles.date} color="dark" tag="small">
                    {moment(notification.updatedAt).fromNow()}{' '}
                    <span className={styles.divisor} />
                    <NotificationType
                      context={notification.notificationType.context}
                    />
                  </Text>
                </motion.div>
                <hr />
              </AnimatePresence>
            ))}
          </motion.div>
        )
      )}
      <FlexContainer className={styles.pannel}>
        <Text onClick={handleNotifications} center color="muted" tag="small">
          {notificationsRouteMessage} <Icon icon={ic_notifications_active} />
        </Text>
      </FlexContainer>
    </motion.div>
  )
}

const variants = {
  ul: {
    start: {
      scale: 0
    },
    end: {
      scale: 1,
      transition: {
        staggerChildren: 0.3
      }
    },
    exit: {
      scale: 0,
      transition: {
        duration: 0.3
      }
    }
  },
  li: {
    start: {
      scale: 1
    },
    end: {
      scale: 1
    },
    exit: {
      scale: 0,
      x: 200,
      transition: { duration: 0.2 }
    },
    animate: {
      opacity: 1
    }
  },
  menu: {
    opened: {
      zIndex: 9999,
      opacity: 0.95,
      height: 'auto',
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.5
      }
    },
    closed: {
      zIndex: 0,
      height: 0,
      opacity: 0
    }
  }
}

export default Notifications
