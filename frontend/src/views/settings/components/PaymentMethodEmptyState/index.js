import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/ui'
import styles from './PaymentMethodEmptyState.module.scss'

/**
 * Friendly empty state shown when the user has no payment methods.
 *
 * @param {Object}  props
 * @param {() => void} props.onAdd
 * @param {boolean} [props.demo]
 */
const PaymentMethodEmptyState = ({ onAdd, demo }) => {
  const { t } = useTranslation()

  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-label={t('SETTINGS.PAYMENT_METHOD.emptyTitle')}
    >
      {/* Illustration */}
      <div className={styles.illustration} aria-hidden="true">
        <div className={styles.cardStack}>
          <div className={styles.cardBack} />
          <div className={styles.cardFront}>
            <span className={styles.cardPlus}>+</span>
          </div>
        </div>
      </div>

      {/* Copy */}
      <h3 className={styles.title}>
        {t('SETTINGS.PAYMENT_METHOD.emptyTitle')}
      </h3>
      <p className={styles.description}>
        {t('SETTINGS.PAYMENT_METHOD.emptyDescription')}
      </p>

      {/* CTA */}
      <Button
        variant="primary"
        size="md"
        onClick={onAdd}
        disabled={demo}
        className={styles.cta}
      >
        {t('SETTINGS.PAYMENT_METHOD.emptyAdd')}
      </Button>
    </div>
  )
}

PaymentMethodEmptyState.defaultProps = {
  demo: false
}

export default PaymentMethodEmptyState
