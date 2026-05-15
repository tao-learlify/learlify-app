import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Badge, Button } from 'components/ui'
import styles from './PaymentMethodCard.module.scss'

const BRAND_LABEL = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  amex: 'AMEX',
  discover: 'DISCOVER',
  jcb: 'JCB',
  unionpay: 'UNIONPAY',
  diners: 'DINERS'
}

const BRAND_ACCENT = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#006FCF',
  discover: '#E65C00',
  jcb: '#2A31AC',
  unionpay: '#B0262B',
  diners: '#004A97'
}

/**
 * @param {Object} props
 * @param {import('hooks/useSubscription').PaymentMethodInfo} props.paymentMethod
 * @param {boolean} [props.isDefault]
 * @param {boolean} [props.demo]
 * @param {() => void} [props.onUpdate]
 * @param {() => void} [props.onRemove]
 */
const PaymentMethodCard = ({
  paymentMethod,
  isDefault,
  demo,
  onUpdate,
  onRemove
}) => {
  const { t } = useTranslation()

  const brandLabel =
    BRAND_LABEL[paymentMethod.brand] ||
    (paymentMethod.brand || 'CARD').toUpperCase()
  const brandAccent =
    BRAND_ACCENT[paymentMethod.brand] || 'var(--color-brand-primary)'

  return (
    <div className={clsx(styles.card, isDefault && styles.isDefault)}>
      {/* Visual card face */}
      <div className={styles.cardFace}>
        {/* Top row: brand name + chip */}
        <div className={styles.cardTopRow}>
          <span
            className={styles.brandName}
            style={{ color: isDefault ? 'rgba(255,255,255,0.95)' : 'inherit' }}
          >
            {brandLabel}
          </span>
          <span className={styles.chip} aria-hidden="true" />
        </div>

        {/* Middle: masked number */}
        <span className={styles.maskedNumber}>
          &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;
          &bull;&bull;&bull;&bull; {paymentMethod.last4}
        </span>

        {/* Bottom row: expiry + default badge */}
        <div className={styles.cardBottomRow}>
          <div className={styles.expiryBlock}>
            <span className={styles.expiryLabel}>
              {t('SETTINGS.PAYMENT_METHOD.expiryLabel')}
            </span>
            <span className={styles.expiryValue}>
              {String(paymentMethod.expMonth).padStart(2, '0')}/
              {String(paymentMethod.expYear).slice(-2)}
            </span>
          </div>
          {isDefault && (
            <Badge variant="active" dot className={styles.defaultBadge}>
              {t('SETTINGS.PAYMENT_METHOD.defaultBadge')}
            </Badge>
          )}
        </div>
      </div>

      {/* Brand accent bar */}
      <div
        className={styles.brandBar}
        style={{ background: brandAccent }}
        aria-hidden="true"
      />

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUpdate}
          disabled={demo}
          className={styles.actionBtn}
        >
          {t('SETTINGS.PAYMENT_METHOD.actionEdit')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={demo}
          className={clsx(styles.actionBtn, styles.removeBtn)}
        >
          {t('SETTINGS.PAYMENT_METHOD.actionRemove')}
        </Button>
      </div>
    </div>
  )
}

PaymentMethodCard.defaultProps = {
  isDefault: false,
  demo: false
}

export default PaymentMethodCard
