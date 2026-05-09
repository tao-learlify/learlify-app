import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import styles from './subscription-cancellation-panel.module.scss'
import { Button } from 'components/ui'
import { cancelSubscriptionThunk } from 'store/@thunks/subscriptions'
import { activeSubscriptionSelector } from 'store/@selectors/subscriptions'

const SubscriptionCancellationPanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const activeSubscription = useSelector(activeSubscriptionSelector)

  const [loading, setLoading] = React.useState(false)
  const [cancelled, setCancelled] = React.useState(false)

  if (!activeSubscription) {
    return null
  }

  if (cancelled || activeSubscription.cancelAtPeriodEnd) {
    return (
      <div className={clsx(styles.panel, styles.cancelled)}>
        <h4 className={styles.title}>
          {t('PLANS.CANCEL.cancelledTitle') || 'Subscription Cancelled'}
        </h4>
        <p className={styles.description}>
          {t('PLANS.CANCEL.cancelledDescription') ||
            'Your subscription has been cancelled. You will continue to have access until the end of your current billing period.'}
        </p>
      </div>
    )
  }

  const handleCancelSubscription = async () => {
    if (
      !window.confirm(
        t('PLANS.CANCEL.confirm') ||
          'Are you sure? Your access will continue until the end of the billing period.'
      )
    ) {
      return
    }

    setLoading(true)

    try {
      await dispatch(
        cancelSubscriptionThunk({
          subscriptionId: activeSubscription.id,
          immediately: false
        })
      ).unwrap()
      setCancelled(true)
      ToastsStore.success(
        t('PLANS.CANCEL.success') || 'Subscription cancelled successfully'
      )
    } catch (error) {
      ToastsStore.error(
        error?.message ||
          'Failed to cancel subscription. Please try again or contact support.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.panel}>
      <h4 className={styles.title}>
        {t('PLANS.CANCEL.title') || 'Cancel Subscription'}
      </h4>
      <p className={styles.description}>
        {t('PLANS.CANCEL.description') ||
          'If you cancel your subscription, you will continue to have access to all features until the end of your current billing period.'}
      </p>
      <Button
        variant="ghost"
        className={styles.cancelButton}
        onClick={handleCancelSubscription}
        disabled={loading}
      >
        {loading
          ? 'Cancelling...'
          : t('PLANS.CANCEL.action') || 'Cancel Subscription'}
      </Button>
    </div>
  )
}

export default SubscriptionCancellationPanel
