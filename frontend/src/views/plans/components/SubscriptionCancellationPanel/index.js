import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'
import clsx from 'clsx'
import styles from './subscription-cancellation-panel.module.scss'
import { Button } from 'components/ui'
import httpClient from 'utils/httpClient'

const SubscriptionCancellationPanel = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [activePackageId, setActivePackageId] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    httpClient({
      endpoint: '/api/v1/packages',
      method: 'GET',
      requiresAuth: true,
      queries: { active: true }
    }).then(data => {
      const packages = Array.isArray(data?.response) ? data.response : []
      if (packages.length > 0) {
        setActivePackageId(packages[0].id)
      }
      setFetching(false)
    }).catch(() => {
      setFetching(false)
    })
  }, [])

  const handleCancelSubscription = async () => {
    if (!window.confirm(t('PLANS.CANCEL.confirm') || 'Are you sure? Your access will continue until the end of the billing period.')) {
      return
    }

    setLoading(true)

    try {
      const data = await httpClient({
        endpoint: `/api/v1/packages/${activePackageId}`,
        method: 'DELETE',
        requiresAuth: true
      })

      if (data.statusCode === 200) {
        setCancelled(true)
        ToastsStore.success(data.message || 'Subscription cancelled successfully')
      } else {
        ToastsStore.error(data.message || 'Could not cancel subscription')
      }
    } catch (error) {
      ToastsStore.error('Failed to cancel subscription. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={clsx(styles.panel, cancelled && styles.cancelled)}>
      {fetching ? (
        <p className={styles.description}>Loading your subscription...</p>
      ) : !activePackageId ? (
        <p className={styles.description}>No active subscription to cancel.</p>
      ) : cancelled ? (
        <>
          <h4 className={styles.title}>{t('PLANS.CANCEL.cancelledTitle') || 'Subscription Cancelled'}</h4>
          <p className={styles.description}>
            {t('PLANS.CANCEL.cancelledDescription') || 'Your subscription has been cancelled. You will continue to have access until the end of your current billing period.'}
          </p>
        </>
      ) : (
        <>
          <h4 className={styles.title}>{t('PLANS.CANCEL.title') || 'Cancel Subscription'}</h4>
          <p className={styles.description}>
            {t('PLANS.CANCEL.description') || 'If you cancel your subscription, you will continue to have access to all features until the end of your current billing period. After that, your account will be downgraded to the free plan.'}
          </p>
          <Button
            variant="ghost"
            className={styles.cancelButton}
            onClick={handleCancelSubscription}
            disabled={loading}
          >
            {loading ? 'Cancelling...' : (t('PLANS.CANCEL.action') || 'Cancel Subscription')}
          </Button>
        </>
      )}
    </div>
  )
}

export default SubscriptionCancellationPanel
