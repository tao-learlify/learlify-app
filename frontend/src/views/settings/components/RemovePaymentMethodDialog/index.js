import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Alert } from 'components/ui'
import styles from './RemovePaymentMethodDialog.module.scss'

/**
 * RemovePaymentMethodDialog
 *
 * Friendly, Duo-style confirmation dialog before removing a payment method.
 * Maintains a warm, non-threatening tone while clearly explaining consequences.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen
 * @param {() => void} props.onClose
 * @param {import('hooks/useSubscription').PaymentMethodInfo|null} props.paymentMethod
 * @param {() => Promise<void>} [props.onConfirm]
 */
const RemovePaymentMethodDialog = ({
  isOpen,
  onClose,
  paymentMethod,
  onConfirm
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirm = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Call API to detach payment method when endpoint is available:
      // await api.subscriptions.detachPaymentMethod({ paymentMethodId })
      await onConfirm?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [onConfirm, onClose])

  const handleClose = useCallback(() => {
    if (loading) return
    setError(null)
    onClose()
  }, [loading, onClose])

  const brandLabel = paymentMethod?.brand
    ? paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)
    : 'Card'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('SETTINGS.PAYMENT_METHOD.removeTitle')}
      size="sm"
      footer={
        <div className={styles.footerActions}>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            {t('SETTINGS.PAYMENT_METHOD.removeDismiss')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
          >
            {loading
              ? t('SETTINGS.PAYMENT_METHOD.removeRemoving')
              : t('SETTINGS.PAYMENT_METHOD.removeConfirm')}
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        {/* Card preview badge */}
        {paymentMethod && (
          <div className={styles.cardPreview} aria-hidden="true">
            <span className={styles.previewBrand}>{brandLabel}</span>
            <span className={styles.previewNumber}>
              &bull;&bull;&bull;&bull; {paymentMethod.last4}
            </span>
          </div>
        )}

        {/* Explanation */}
        <p className={styles.body}>{t('SETTINGS.PAYMENT_METHOD.removeBody')}</p>

        {/* Error feedback */}
        {error && (
          <Alert variant="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}
      </div>
    </Modal>
  )
}

export default RemovePaymentMethodDialog
