import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import * as CONTEXT from 'constant/notifications'

const Notification = ({ context, message }) => {
  const { t } = useTranslation()

  const handleTranslation = useMemo(() => {
    switch (context) {
      case CONTEXT.PAYMENT_COMPLETED:
        return t('NOTIFICATIONS.paymentSuccess')

      case CONTEXT.FEEDBACK:
        return t('NOTIFICATIONS.feedbackSuccess')

      case CONTEXT.EVALUATION_PENDING:
        return t('NOTIFICATIONS.evaluationPending')

      case CONTEXT.EVALUATION_COMPLETED:
        return t('NOTIFICATIONS.evaluationCompleted')

      case CONTEXT.PAYMENT_NOTIFY:
        return t('NOTIFICATIONS.paymentNotify')

      case CONTEXT.PAYMENT_EXPIRED:
        return t('NOTIFICATIONS.paymentExpired')

      default:
        return message
    }
  }, [context, message, t])

  return <>{handleTranslation}</>
}

export default Notification
