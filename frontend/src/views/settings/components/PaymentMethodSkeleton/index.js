import React from 'react'
import styles from './PaymentMethodSkeleton.module.scss'

/**
 * Shimmer skeleton loader for the payment methods section.
 * Shown while payment data is being fetched.
 */
const PaymentMethodSkeleton = () => {
  return (
    <div className={styles.wrapper} aria-hidden="true" role="presentation">
      {/* Fake credit card */}
      <div className={styles.cardSkeleton}>
        <div className={styles.cardTopRow}>
          <div className={`${styles.shimmer} ${styles.brandPill}`} />
          <div className={`${styles.shimmer} ${styles.chip}`} />
        </div>
        <div className={`${styles.shimmer} ${styles.number}`} />
        <div className={styles.cardBottomRow}>
          <div className={`${styles.shimmer} ${styles.expiry}`} />
          <div className={`${styles.shimmer} ${styles.badge}`} />
        </div>
      </div>

      {/* Fake action bar */}
      <div className={styles.actionRow}>
        <div className={`${styles.shimmer} ${styles.actionBtn}`} />
        <div className={`${styles.shimmer} ${styles.actionBtn}`} />
      </div>
    </div>
  )
}

export default PaymentMethodSkeleton
