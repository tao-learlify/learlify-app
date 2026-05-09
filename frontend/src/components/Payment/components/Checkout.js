import React, { memo } from 'react'
import { CardElement } from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import { WhisperSpinner } from 'react-spinners-kit'

import styles from '../payment.module.scss'

import pandaImg from 'assets/illustrations/pandas/panda.svg'

const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: 'Varela Round, sans-serif',
      fontSize: '16px',
      color: '#4B4B4B',
      '::placeholder': { color: '#AFAFAF' }
    },
    invalid: { color: '#EA2B2B' }
  }
}

const BENEFIT_KEYS = [
  'payment.benefit_speaking',
  'payment.benefit_writing',
  'payment.benefit_simulations',
  'payment.benefit_progress',
  'payment.benefit_unlimited'
]

/**
 * @typedef {Object} CheckoutProps
 * @property {boolean} disabled
 * @property {() => void} onPaymentRequest
 * @property {() => void} onCancelPaymentRequest
 */

/**
 * @type {React.FunctionComponent<CheckoutProps>}
 */
const Checkout = ({ disabled, onPaymentRequest, onCancelPaymentRequest }) => {
  const { t } = useTranslation()

  const handleSubmit = e => {
    e.preventDefault()
    onPaymentRequest()
  }

  return (
    <div className={styles.proModal}>
      {/* Mascot */}
      <div className={styles.mascotWrap}>
        <img
          className={styles.mascot}
          src={pandaImg}
          alt=""
          aria-hidden="true"
          width={88}
          height={88}
        />
      </div>

      {/* Hero */}
      <h2 className={styles.proTitle}>{t('COMPONENTS.payment.proTitle')}</h2>
      <p className={styles.proSubtitle}>
        {t('COMPONENTS.payment.proSubtitle')}
      </p>

      {/* Benefits */}
      <ul
        className={styles.benefits}
        aria-label={t('COMPONENTS.payment.benefitsLabel')}
      >
        {BENEFIT_KEYS.map(key => (
          <li key={key} className={styles.benefitPill}>
            <span className={styles.benefitCheck} aria-hidden="true">
              ✓
            </span>
            {t(`COMPONENTS.${key}`)}
          </li>
        ))}
      </ul>

      {/* Payment form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="stripe-card-element">
            {disabled
              ? t('COMPONENTS.payment.invoice')
              : t('COMPONENTS.payment.cardLabel')}
          </label>
          <div className={styles.cardField} id="stripe-card-element">
            <CardElement options={{ ...STRIPE_ELEMENT_OPTIONS, disabled }} />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          className={styles.ctaBtn}
          disabled={disabled}
          aria-busy={disabled}
        >
          {disabled ? (
            <span className={styles.ctaLoading}>
              <WhisperSpinner
                size={18}
                frontColor="#fff"
                backColor="rgba(255,255,255,0.3)"
              />
              {t('COMPONENTS.payment.invoice')}
            </span>
          ) : (
            t('COMPONENTS.payment.ctaLabel')
          )}
        </button>
      </form>

      {/* Trust microcopy */}
      <div
        className={styles.trustRow}
        aria-label={t('COMPONENTS.payment.benefitsLabel')}
      >
        <span>🔒 {t('COMPONENTS.payment.secure')}</span>
        <span aria-hidden="true">·</span>
        <span>{t('COMPONENTS.payment.cancelAnytime')}</span>
        <span aria-hidden="true">·</span>
        <span>{t('COMPONENTS.payment.instantAccess')}</span>
      </div>

      {/* Ghost action */}
      <button
        type="button"
        className={styles.ghostBtn}
        onClick={onCancelPaymentRequest}
        disabled={disabled}
      >
        {t('COMPONENTS.payment.notNow')}
      </button>
    </div>
  )
}

export default memo(Checkout)
