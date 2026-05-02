import React from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from 'components/ui'

const STATUS_VARIANT = {
  active:               'active',
  trialing:             'warning',
  cancel_at_period_end: 'warning',
  past_due:             'danger',
  canceled:             'neutral',
  expired:              'neutral'
}

/**
 * SubscriptionStatusBadge — wraps DS Badge with subscription-specific status mapping.
 * @param {{ status: string }} props
 */
const SubscriptionStatusBadge = ({ status }) => {
  const { t } = useTranslation()

  return (
    <Badge variant={STATUS_VARIANT[status] || 'neutral'}>
      {t(`SETTINGS.SUBSCRIPTION.STATUS.${status}`, { defaultValue: status })}
    </Badge>
  )
}

export default SubscriptionStatusBadge
