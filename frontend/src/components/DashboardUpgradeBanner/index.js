import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import PaymentModal from 'components/PaymentModal'
import styles from './DashboardUpgradeBanner.module.scss'

/**
 * Banner shown at the top of the dashboard for users without an active subscription.
 * Clicking "Ver planes" opens the PaymentModal.
 */
const DashboardUpgradeBanner = () => {
  const { t } = useTranslation()
  const [showPayment, setShowPayment] = useState(false)
  const subscriptions = useSelector(state => state.subscriptions)

  // Don't show if user has an active subscription
  const hasActiveSubscription = subscriptions?.active?.status === 'active' && !subscriptions?.active?.cancelAtPeriodEnd
  if (hasActiveSubscription) return null

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    // Subscription state will auto-update via Redux
  }

  return (
    <>
      <div className={styles.banner} role="alert">
        <div className={styles.content}>
          <span className={styles.icon} aria-hidden="true">🔒</span>
          <div className={styles.text}>
            <h3 className={styles.title}>
              {t('BANNER.upgrade.title', { defaultValue: 'Desbloquea el acceso completo' })}
            </h3>
            <p className={styles.description}>
              {t('BANNER.upgrade.description', { defaultValue: 'Accede a todos los exámenes, speaking con IA, estadísticas y mucho más.' })}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.cta}
          onClick={() => setShowPayment(true)}
        >
          {t('BANNER.upgrade.cta', { defaultValue: 'Ver planes' })}
        </button>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}

export default DashboardUpgradeBanner
