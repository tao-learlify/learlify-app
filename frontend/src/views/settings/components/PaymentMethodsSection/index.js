import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { fetchBillingThunk } from 'store/@thunks/subscriptions'
import { Card, Button } from 'components/ui'
import PaymentMethodCard from '../PaymentMethodCard'
import PaymentMethodEmptyState from '../PaymentMethodEmptyState'
import PaymentMethodSkeleton from '../PaymentMethodSkeleton'
import AddPaymentMethodModal from '../AddPaymentMethodModal'
import RemovePaymentMethodDialog from '../RemovePaymentMethodDialog'
import styles from './PaymentMethodsSection.module.scss'

/**
 * PaymentMethodsSection
 *
 * Top-level orchestrator for the payment methods experience inside Settings.
 * Renders a friendly Duo-style surface with:
 *   - Section header + description
 *   - Loading skeleton
 *   - Empty state (no cards)
 *   - Payment method card(s) with actions
 *   - Add payment method CTA
 *   - Billing trust indicators
 *
 * @param {Object}  props
 * @param {import('hooks/useSubscription').PaymentMethodInfo|null} props.paymentMethod
 * @param {boolean} [props.loading]
 * @param {boolean} [props.demo]
 */
const PaymentMethodsSection = ({ paymentMethod, loading, demo }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [removingMethod, setRemovingMethod] = useState(null)
  const [optimisticCard, setOptimisticCard] = useState(null)

  // Prefer live paymentMethod from Redux; fall back to optimistic card until refetch completes
  const resolvedMethod = paymentMethod || optimisticCard
  const methods = resolvedMethod ? [{ ...resolvedMethod, id: 'primary' }] : []
  const hasCards = methods.length > 0

  const handleRemoveClick = method => {
    setRemovingMethod(method)
    setShowRemove(true)
  }

  const handleRemoveClose = () => {
    setShowRemove(false)
    setRemovingMethod(null)
  }

  return (
    <>
      <Card elevated className={styles.section}>
        <Card.Body className={styles.body}>
          {/* ── Header ─────────────────────────────────────────── */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <span className={styles.sectionLabel}>
                {t('SETTINGS.PAYMENT_METHOD.title')}
              </span>
              <p className={styles.sectionDescription}>
                {t('SETTINGS.PAYMENT_METHOD.sectionDescription')}
              </p>
            </div>
            <div className={styles.lockBadge} aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          {/* ── Content area ───────────────────────────────────── */}
          {loading ? (
            <PaymentMethodSkeleton />
          ) : !hasCards ? (
            <PaymentMethodEmptyState
              onAdd={() => setShowAdd(true)}
              demo={demo}
            />
          ) : (
            <div className={styles.methodsList}>
              {methods.map((method, idx) => (
                <PaymentMethodCard
                  key={method.id || `${method.brand}-${method.last4}`}
                  paymentMethod={method}
                  isDefault={idx === 0}
                  demo={demo}
                  onUpdate={() => setShowAdd(true)}
                  onRemove={() => handleRemoveClick(method)}
                />
              ))}

              {/* Add another card CTA */}
              <button
                type="button"
                className={styles.addCardBtn}
                onClick={() => setShowAdd(true)}
                disabled={demo}
                aria-label={t('SETTINGS.PAYMENT_METHOD.addCard')}
              >
                <span className={styles.addCardIcon} aria-hidden="true">
                  ＋
                </span>
                <span>{t('SETTINGS.PAYMENT_METHOD.addCard')}</span>
              </button>
            </div>
          )}

          {/* ── Trust indicators ──────────────────────────────── */}
          <div className={styles.trustBar} aria-label="Security information">
            <span className={styles.trustItem}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {t('SETTINGS.PAYMENT_METHOD.trust1')}
            </span>
            <span className={styles.trustDot} aria-hidden="true" />
            <span className={styles.trustItem}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t('SETTINGS.PAYMENT_METHOD.trust2')}
            </span>
            <span className={styles.trustDot} aria-hidden="true" />
            <span className={styles.trustItem}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {t('SETTINGS.PAYMENT_METHOD.trust3')}
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <AddPaymentMethodModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={({ card }) => {
          if (card) setOptimisticCard(card)
          setShowAdd(false)
          dispatch(fetchBillingThunk())
        }}
      />

      <RemovePaymentMethodDialog
        isOpen={showRemove}
        onClose={handleRemoveClose}
        paymentMethod={removingMethod}
      />
    </>
  )
}

PaymentMethodsSection.defaultProps = {
  paymentMethod: null,
  loading: false,
  demo: false
}

export default PaymentMethodsSection
