import React, { useState, useCallback } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Input, Alert } from 'components/ui'
import styles from './AddPaymentMethodModal.module.scss'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: 'Varela Round, sans-serif',
      fontSize: '15px',
      color: '#3C3C3C',
      '::placeholder': { color: '#AFAFAF' },
      lineHeight: '1.6'
    },
    invalid: { color: '#EA2B2B', iconColor: '#EA2B2B' }
  },
  hidePostalCode: true
}

/**
 * AddPaymentMethodModal
 *
 * Stripe-powered modal for adding a new card. Uses CardElement for PCI-compliant
 * card input. The actual API call to attach the payment method is marked as TODO
 * pending a backend endpoint for standalone payment method management.
 *
 * @param {Object}      props
 * @param {boolean}     props.isOpen
 * @param {() => void}  props.onClose
 * @param {(data: { paymentMethodId: string }) => void} [props.onSuccess]
 */
const AddPaymentMethodModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation()
  const stripe = useStripe()
  const elements = useElements()

  const [nameOnCard, setNameOnCard] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      if (!stripe || !elements) return

      if (!nameOnCard.trim()) {
        setError(t('SETTINGS.PAYMENT_METHOD.validNameRequired'))
        return
      }

      setLoading(true)
      setError(null)

      try {
        const cardElement = elements.getElement(CardElement)
        const { error: stripeError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: { name: nameOnCard.trim() }
          })

        if (stripeError) {
          setError(stripeError.message)
          setLoading(false)
          return
        }

        // TODO: Call backend API to attach paymentMethod.id to the customer's
        // Stripe account once the endpoint is available:
        // await api.subscriptions.attachPaymentMethod({ paymentMethodId: paymentMethod.id })
        console.log(
          '[AddPaymentMethodModal] paymentMethod created:',
          paymentMethod.id
        )

        setSuccess(true)
        setTimeout(() => {
          onSuccess?.({
            paymentMethodId: paymentMethod.id,
            card: paymentMethod.card
              ? {
                  brand: paymentMethod.card.brand || '',
                  last4: paymentMethod.card.last4 || '',
                  expMonth: paymentMethod.card.exp_month || 0,
                  expYear: paymentMethod.card.exp_year || 0
                }
              : null
          })
          handleClose()
        }, 2200)
      } catch (err) {
        setError(err?.message || 'Something went wrong. Please try again.')
        setLoading(false)
      }
    },
    [stripe, elements, nameOnCard, t, onSuccess]
  )

  const handleClose = useCallback(() => {
    if (loading) return
    setNameOnCard('')
    setError(null)
    setSuccess(false)
    setLoading(false)
    onClose()
  }, [loading, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('SETTINGS.PAYMENT_METHOD.addCardTitle')}
      size="md"
      footer={
        !success ? (
          <div className={styles.footerActions}>
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              {t('SETTINGS.PAYMENT_METHOD.addCardCancel')}
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="add-card-form"
              loading={loading}
              disabled={!stripe || !elements || loading}
              chunky
            >
              {loading
                ? t('SETTINGS.PAYMENT_METHOD.addCardAdding')
                : t('SETTINGS.PAYMENT_METHOD.addCardSubmit')}
            </Button>
          </div>
        ) : null
      }
    >
      {success ? (
        /* ── Success state ── */
        <div className={styles.successState} role="status" aria-live="polite">
          <div className={styles.checkmarkCircle} aria-hidden="true">
            <svg
              className={styles.checkmarkSvg}
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.checkmarkCirclePath}
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={styles.checkmarkCheck}
                d="M14 26l9 9 15-18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className={styles.successMessage}>
            {t('SETTINGS.PAYMENT_METHOD.addCardSuccess')}
          </p>
        </div>
      ) : (
        /* ── Form ── */
        <form
          id="add-card-form"
          onSubmit={handleSubmit}
          noValidate
          className={styles.form}
        >
          <p className={styles.description}>
            {t('SETTINGS.PAYMENT_METHOD.addCardDescription')}
          </p>

          {/* Name on card */}
          <Input
            label={t('SETTINGS.PAYMENT_METHOD.nameOnCard')}
            placeholder={t('SETTINGS.PAYMENT_METHOD.nameOnCardPlaceholder')}
            value={nameOnCard}
            onChange={e => setNameOnCard(e.target.value)}
            required
            autoComplete="cc-name"
            disabled={loading}
          />

          {/* Stripe CardElement */}
          <div className={styles.cardFieldGroup}>
            <label className={styles.cardFieldLabel}>
              {t('SETTINGS.PAYMENT_METHOD.cardDetails')}
            </label>
            <div className={styles.cardElementBox}>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}
        </form>
      )}
    </Modal>
  )
}

export default AddPaymentMethodModal
