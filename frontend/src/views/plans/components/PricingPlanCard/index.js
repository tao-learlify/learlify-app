import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ToastsStore } from 'react-toasts'
import { Button, Badge } from 'components/ui'
import { formatPrice } from 'utils/pricing'
import PricingFeatureList from '../PricingFeatureList'
import CancelSubscriptionModal from '../CancelSubscriptionModal'
import styles from './pricing-plan-card.module.scss'
import {
  cancelAtPeriodEndThunk,
  reactivateSubscriptionThunk
} from 'store/@thunks/subscriptions'

import pandaReading from 'assets/illustrations/pandas/panda.svg'
import pandaColor from 'assets/illustrations/pandas/panda.svg'
import pandaKing from 'assets/illustrations/pandas/panda.svg'

const PLAN_PANDAS = {
  exam_essentials: {
    src: pandaReading,
    alt: 'Exam Essentials Panda',
    top: 28,
    height: 100
  },
  aptis_pro: { src: pandaColor, alt: 'Aptis Pro Panda', top: 20, height: 106 },
  ielts_pro: { src: pandaColor, alt: 'IELTS Pro Panda', top: 20, height: 106 },
  pro_max: { src: pandaKing, alt: 'Pro Max Panda', top: 14, height: 92 }
}

const CYCLE_MONTHS = { monthly: 1, quarterly: 3, yearly: 12 }

/**
 * @typedef {Object} PricingPlanCardProps
 * @property {import('@types/subscriptions').Plan} plan
 * @property {string}  selectedCycle - monthly | quarterly | yearly
 * @property {boolean} popular
 * @property {(code: string) => void} onSelect
 * @property {boolean} disabled - true while checkout is open
 * @property {import('@types/subscriptions').Subscription|null} [activeSubscription]
 */

/** @type {React.FunctionComponent<PricingPlanCardProps>} */
const PricingPlanCard = ({
  plan,
  selectedCycle,
  popular,
  onSelect,
  disabled,
  activeSubscription
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false)
  const [reactivateModalOpen, setReactivateModalOpen] = React.useState(false)
  const [actionLoading, setActionLoading] = React.useState(false)

  const canceling = useSelector(state => state.subscriptions.canceling.loading)

  const isCurrentPlan =
    activeSubscription?.status === 'active' &&
    activeSubscription?.plan?.code === plan.code

  const cancelAtEnd =
    isCurrentPlan && Boolean(activeSubscription?.cancelAtPeriodEnd)

  const planName = activeSubscription?.plan?.name ?? plan.name ?? 'Pro'
  const speakingReviews = activeSubscription?.plan?.includedSpeakingReviews ?? 0
  const writingReviews = activeSubscription?.plan?.includedWritingReviews ?? 0

  const periodEndDate = activeSubscription?.currentPeriodEnd
    ? new Date(activeSubscription.currentPeriodEnd).toLocaleDateString(
        'es-ES',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      )
    : ''

  const handleConfirmCancel = async () => {
    setActionLoading(true)
    try {
      await dispatch(
        cancelAtPeriodEndThunk({ subscriptionId: activeSubscription.id })
      ).unwrap()
      setCancelModalOpen(false)
      ToastsStore.success(t('PLANS.PRICING.endsOn', { date: periodEndDate }))
    } catch (err) {
      ToastsStore.error(err?.message || 'Error al cancelar la suscripción')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmReactivate = async () => {
    setActionLoading(true)
    try {
      await dispatch(
        reactivateSubscriptionThunk({ subscriptionId: activeSubscription.id })
      ).unwrap()
      setReactivateModalOpen(false)
      ToastsStore.success(t('PLANS.PRICING.renewsOn', { date: periodEndDate }))
    } catch (err) {
      ToastsStore.error(err?.message || 'Error al reactivar la suscripción')
    } finally {
      setActionLoading(false)
    }
  }

  const priceEntry = plan.prices?.find(p => p.billingCycle === selectedCycle)
  const totalAmount = priceEntry ? priceEntry.finalPrice / 100 : null
  const monthlyEquivalent =
    totalAmount !== null
      ? Math.ceil(totalAmount / (CYCLE_MONTHS[selectedCycle] || 1))
      : null
  const discountPct = priceEntry?.discountPercentage || 0

  const name = t(`PLANS.CATALOG.${plan.code.toUpperCase()}.name`, {
    defaultValue: plan.name
  })
  const description = t(
    `PLANS.CATALOG.${plan.code.toUpperCase()}.description`,
    { defaultValue: plan.description || '' }
  )

  const panda = PLAN_PANDAS[plan.code]

  return (
    <div className={styles.wrapper}>
      {panda && (
        <img
          src={panda.src}
          alt={panda.alt}
          className={styles.panda}
          style={{ top: panda.top + 'px', height: panda.height + 'px' }}
          aria-hidden="true"
        />
      )}

      <div className={clsx(styles.card, popular && styles.popular)}>
        {discountPct > 0 && (
          <div className={styles.discountBadge}>
            <Badge variant="active">-{discountPct}%</Badge>
          </div>
        )}

        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.priceRow}>
          <span className={styles.amount}>
            {monthlyEquivalent !== null ? formatPrice(monthlyEquivalent) : '—'}
          </span>
          <span className={styles.period}>/{t('PLANS.BILLING.month')}</span>
        </div>

        <div className={styles.features}>
          <PricingFeatureList
            includedExams={plan.includedExams}
            includedSpeakingReviews={plan.includedSpeakingReviews}
            includedWritingReviews={plan.includedWritingReviews}
            includesCourse={plan.includesCourse}
          />
        </div>

        {popular && (
          <div className={styles.popularBadgeWrapper}>
            <Badge variant="primary">{t('PLANS.PRICING.popular')}</Badge>
          </div>
        )}

        {isCurrentPlan ? (
          <div className={styles.activePlanPanel}>
            <div className={styles.statusBadgeRow}>
              {cancelAtEnd ? (
                <Badge variant="warning" dot>
                  {t('PLANS.PRICING.statusBadge.endingSoon')}
                </Badge>
              ) : (
                <Badge variant="active" dot>
                  {t('PLANS.PRICING.statusBadge.active')}
                </Badge>
              )}
            </div>

            <div className={styles.planStatusRow}>
              <span
                className={clsx(styles.planStatusDot, {
                  [styles.cancelingDot]: cancelAtEnd
                })}
              />
              <span className={styles.planStatusText}>
                {cancelAtEnd
                  ? t('PLANS.PRICING.endsOn', { date: periodEndDate })
                  : t('PLANS.PRICING.renewsOn', { date: periodEndDate })}
              </span>
            </div>

            {cancelAtEnd ? (
              <Button
                fullWidth
                variant="primary"
                onClick={() => setReactivateModalOpen(true)}
                disabled={actionLoading || canceling}
              >
                {t('PLANS.PRICING.reactivateSubscription')}
              </Button>
            ) : (
              <Button
                fullWidth
                variant="ghost"
                onClick={() => setCancelModalOpen(true)}
                disabled={actionLoading || canceling}
              >
                {t('PLANS.PRICING.cancelSubscription')}
              </Button>
            )}

            <CancelSubscriptionModal
              mode="cancel"
              isOpen={cancelModalOpen}
              onClose={() => setCancelModalOpen(false)}
              onConfirm={handleConfirmCancel}
              loading={actionLoading || canceling}
              periodEndDate={periodEndDate}
              planName={planName}
              speakingReviews={speakingReviews}
              writingReviews={writingReviews}
            />

            <CancelSubscriptionModal
              mode="reactivate"
              isOpen={reactivateModalOpen}
              onClose={() => setReactivateModalOpen(false)}
              onConfirm={handleConfirmReactivate}
              loading={actionLoading || canceling}
              periodEndDate={periodEndDate}
              planName={planName}
            />
          </div>
        ) : (
          <Button
            fullWidth
            onClick={() => !isCurrentPlan && onSelect(plan.code)}
            disabled={disabled}
          >
            {t('PLANS.PRICING.subscribe')}
          </Button>
        )}

        {popular && (
          <span className={styles.socialProof}>
            🔥 5.000+ estudiantes ya lo usan
          </span>
        )}
      </div>
    </div>
  )
}

PricingPlanCard.defaultProps = {
  popular: false,
  disabled: false,
  activeSubscription: null
}

export default PricingPlanCard
