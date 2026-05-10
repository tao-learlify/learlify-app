import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import PricingPlanCard from 'views/plans/components/PricingPlanCard'
import { fetchPlansThunk } from 'store/@thunks/plans'
import { select } from 'store/@reducers/plans'
import Payment from 'components/Payment'
import styles from './PaymentModal.module.scss'

const BILLING_CYCLES = ['monthly', 'quarterly', 'yearly']

/**
 * Reusable payment modal — wraps plan selection + Stripe checkout.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(subscription: any) => void} props.onSuccess
 * @param {string|null} props.planCode - if provided, skip plan selection
 * @param {string} props.billingCycle
 * @param {string|null} props.filterByModel - 'Aptis' | 'IELTS' | null
 * @param {object|null} props.preselectedPlan - if set, go directly to Stripe
 */
const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  planCode,
  billingCycle = 'monthly',
  filterByModel,
  preselectedPlan,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const plans = useSelector(state => state.plans)
  const [step, setStep] = useState('select') // 'select' | 'checkout'
  const [selectedCycle, setSelectedCycle] = useState(billingCycle)

  // Fetch plans when opening
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPlansThunk())
      // If preselectedPlan or planCode is provided, go directly to checkout
      if (preselectedPlan || planCode) {
        setStep('checkout')
        if (planCode) {
          dispatch(select(planCode))
        }
      } else {
        setStep('select')
      }
    }
  }, [isOpen, dispatch, preselectedPlan, planCode])

  // Filter plans by model
  const filteredPlans = useMemo(() => {
    /** @type {Array} */
    const data = plans.data || []
    if (!filterByModel) return data
    return data.filter(p => {
      const code = (p.code || '').toLowerCase()
      const model = filterByModel.toLowerCase()
      if (model === 'aptis') return code.includes('aptis') || code === 'exam_essentials' || code === 'pro_max'
      if (model === 'ielts') return code.includes('ielts') || code === 'exam_essentials' || code === 'pro_max'
      return true
    })
  }, [plans.data, filterByModel])

  const handleSelectPlan = useCallback((code) => {
    dispatch(select(code))
    setStep('checkout')
  }, [dispatch])

  const handlePaymentSuccess = useCallback((result) => {
    if (onSuccess) {
      onSuccess(result)
    }
    onClose()
  }, [onSuccess, onClose])

  const handleClose = () => {
    setStep('select')
    onClose()
  }

  if (!isOpen) return null

  // If preselected plan, go directly to Payment
  if (step === 'checkout' || preselectedPlan || planCode) {
    return (
      <Payment
        openWindow={isOpen}
        onCloseWindow={handleClose}
        onPaymentRequest={handlePaymentSuccess}
        defaultPaymentMethod={false}
        billingCycle={selectedCycle}
        restrict={null}
      />
    )
  }

  // Step 1: Plan selection
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label={t('COMPONENTS.modal.close', { defaultValue: 'Cerrar' })}
        >
          ×
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('PAYMENT.modal.title', { defaultValue: 'Elige tu plan' })}
          </h2>
          <p className={styles.subtitle}>
            {t('PAYMENT.modal.subtitle', { defaultValue: 'Selecciona el plan que mejor se adapte a ti' })}
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.billingToggle}>
            {BILLING_CYCLES.map(cycle => (
              <button
                key={cycle}
                type="button"
                className={`${styles.billingOption} ${selectedCycle === cycle ? styles.billingOptionActive : ''}`}
                onClick={() => setSelectedCycle(cycle)}
              >
                {t(`PLANS.BILLING.${cycle}`, { defaultValue: cycle })}
              </button>
            ))}
          </div>

          {plans.loading ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
              {t('COMPONENTS.loading', { defaultValue: 'Cargando planes…' })}
            </p>
          ) : (
            <div className={styles.planGrid}>
              {filteredPlans.map(plan => (
                <PricingPlanCard
                  key={plan.code || plan.id}
                  plan={plan}
                  selectedCycle={selectedCycle}
                  popular={plan.code === 'aptis_pro'}
                  onSelect={handleSelectPlan}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className={styles.skipBtn}
            onClick={handleClose}
          >
            {t('PAYMENT.modal.maybeLater', { defaultValue: 'Ahora no' })}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
