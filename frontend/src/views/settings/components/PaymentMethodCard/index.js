import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'
import { Card, Button } from 'components/ui'
import styles from './PaymentMethodCard.module.scss'

const BRAND_LABEL = {
  visa:       'Visa',
  mastercard: 'Mastercard',
  amex:       'American Express',
  discover:   'Discover',
  jcb:        'JCB',
  unionpay:   'UnionPay',
  diners:     'Diners Club'
}

/**
 * @param {Object} props
 * @param {import('hooks/useSubscription').PaymentMethodInfo|null} props.paymentMethod
 * @param {boolean} [props.demo]
 */
const PaymentMethodCard = ({ paymentMethod, demo }) => {
  const { t } = useTranslation()

  const handleUpdate = () => {
    ToastsStore.info(t('SETTINGS.PAYMENT_METHOD.update'))
  }

  return (
    <Card elevated>
      <Card.Body className={styles.body}>
        <span className={styles.sectionLabel}>
          {t('SETTINGS.PAYMENT_METHOD.title')}
        </span>

        {!paymentMethod ? (
          <p className={styles.noCard}>{t('SETTINGS.PAYMENT_METHOD.noCard')}</p>
        ) : (
          <div className={styles.cardRow}>
            <div className={styles.cardVisual}>
              <span className={styles.brandLabel}>
                {BRAND_LABEL[paymentMethod.brand] || paymentMethod.brand}
              </span>
              <span className={styles.cardNumber}>
                •••• •••• •••• {paymentMethod.last4}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.expiryLabel}>
                {t('SETTINGS.PAYMENT_METHOD.expiryLabel')}
              </span>
              <span className={styles.expiry}>
                {String(paymentMethod.expMonth).padStart(2, '0')}/
                {String(paymentMethod.expYear).slice(-2)}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={handleUpdate}
          disabled={demo}
        >
          {t('SETTINGS.PAYMENT_METHOD.update')}
        </Button>
      </Card.Body>
    </Card>
  )
}

PaymentMethodCard.defaultProps = {
  demo: false
}

export default PaymentMethodCard
