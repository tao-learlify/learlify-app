import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { resetGuestSession } from 'store/@reducers/guestSession'
import PaymentModal from 'components/PaymentModal'
import styles from './UnlockModal.module.scss'

/**
 * UnlockModal — first screen: speed selection (Rápido vs Básico).
 * Then delegates to PaymentModal for plan selection + Stripe checkout.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.examType - 'Aptis' | 'IELTS'
 */
const UnlockModal = ({ isOpen, onClose, examType }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [showPayment, setShowPayment] = useState(false)
  const [paymentConfig, setPaymentConfig] = useState({}) // { planCode, filterByModel }

  const handleClose = () => {
    dispatch(resetGuestSession())
    history.push('/dashboard')
    onClose()
  }

  const handleSelectRapido = () => {
    // AptisGo Rápido → show pro plans for the selected exam type
    setPaymentConfig({ filterByModel: examType || 'Aptis' })
    setShowPayment(true)
  }

  const handleSelectBasico = () => {
    // Aptis Básico → show exam_essentials only
    setPaymentConfig({ planCode: 'exam_essentials' })
    setShowPayment(true)
  }

  const handlePaymentSuccess = useCallback((subscription) => {
    dispatch(resetGuestSession())
    history.push('/dashboard')
  }, [dispatch, history])

  const handlePaymentClose = () => {
    dispatch(resetGuestSession())
    history.push('/dashboard')
  }

  if (!isOpen) return null

  // Show PaymentModal for step 2
  if (showPayment) {
    return (
      <PaymentModal
        isOpen={true}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
        planCode={paymentConfig.planCode || null}
        filterByModel={paymentConfig.filterByModel || null}
      />
    )
  }

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

        <div className={styles.emoji} aria-hidden="true">🚀</div>
        <h2 className={styles.title}>
          {t('UNLOCK.title', { defaultValue: '¿Cómo quieres prepararte?' })}
        </h2>
        <p className={styles.subtitle}>
          {t('UNLOCK.subtitle', { defaultValue: 'Elige la velocidad que mejor se adapte a tu objetivo' })}
        </p>

        <div className={styles.speedGrid}>
          {/* AptisGo Rápido */}
          <button
            type="button"
            className={styles.speedCard}
            onClick={handleSelectRapido}
          >
            <span className={styles.speedIcon} aria-hidden="true">⚡</span>
            <span className={styles.speedName}>
              {t('UNLOCK.fast.title', { defaultValue: 'AptisGo Rápido' })}
            </span>
            <span className={styles.speedDesc}>
              {t('UNLOCK.fast.description', { defaultValue: 'Acceso completo a todos los exámenes y herramientas' })}
            </span>
            <ul className={styles.features}>
              <li>{t('UNLOCK.fast.f1', { defaultValue: 'Todos los exámenes completos' })}</li>
              <li>{t('UNLOCK.fast.f2', { defaultValue: 'Speaking & Writing con IA' })}</li>
              <li>{t('UNLOCK.fast.f3', { defaultValue: 'Estadísticas detalladas' })}</li>
              <li>{t('UNLOCK.fast.f4', { defaultValue: 'Simulacros ilimitados' })}</li>
            </ul>
          </button>

          {/* Aptis Básico */}
          <button
            type="button"
            className={styles.speedCard}
            onClick={handleSelectBasico}
          >
            <span className={styles.speedIcon} aria-hidden="true">📚</span>
            <span className={styles.speedName}>
              {t('UNLOCK.basic.title', { defaultValue: 'Aptis Básico' })}
            </span>
            <span className={styles.speedDesc}>
              {t('UNLOCK.basic.description', { defaultValue: 'Preparación paso a paso con lo esencial' })}
            </span>
            <ul className={styles.features}>
              <li>{t('UNLOCK.basic.f1', { defaultValue: 'Exámenes de práctica' })}</li>
              <li>{t('UNLOCK.basic.f2', { defaultValue: 'Correcciones automáticas' })}</li>
              <li>{t('UNLOCK.basic.f3', { defaultValue: 'Acceso a materiales' })}</li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnlockModal
