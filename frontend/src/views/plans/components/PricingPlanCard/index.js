import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Button, Badge } from 'components/ui'
import { formatPrice } from 'utils/pricing'
import PricingFeatureList from '../PricingFeatureList'
import styles from './pricing-plan-card.module.scss'

import pandaReading from 'assets/illustrations/pandas/panda.svg'
import pandaColor from 'assets/illustrations/pandas/panda.svg'
import pandaKing from 'assets/illustrations/pandas/panda.svg'

const PLAN_PANDAS = {
  exam_essentials: { src: pandaReading, alt: 'Exam Essentials Panda', top: 28, height: 100 },
  aptis_pro:       { src: pandaColor,   alt: 'Aptis Pro Panda',       top: 20, height: 106 },
  ielts_pro:       { src: pandaColor,   alt: 'IELTS Pro Panda',       top: 20, height: 106 },
  pro_max:         { src: pandaKing,    alt: 'Pro Max Panda',          top: 14, height: 92  }
}

const CYCLE_MONTHS = { monthly: 1, quarterly: 3, yearly: 12 }

/**
 * @typedef {Object} PricingPlanCardProps
 * @property {import('@types/subscriptions').Plan} plan
 * @property {string}  selectedCycle - monthly | quarterly | yearly
 * @property {boolean} popular
 * @property {(code: string) => void} onSelect
 * @property {boolean} disabled - true while checkout is open
 */

/** @type {React.FunctionComponent<PricingPlanCardProps>} */
const PricingPlanCard = ({ plan, selectedCycle, popular, onSelect, disabled }) => {
  const { t } = useTranslation()

  const priceEntry = plan.prices?.find(p => p.billingCycle === selectedCycle)
  const totalAmount = priceEntry ? priceEntry.finalPrice / 100 : null
  const monthlyEquivalent =
    totalAmount !== null
      ? Math.ceil(totalAmount / (CYCLE_MONTHS[selectedCycle] || 1))
      : null
  const discountPct = priceEntry?.discountPercentage || 0

  const name        = t(`PLANS.CATALOG.${plan.code.toUpperCase()}.name`,        { defaultValue: plan.name })
  const description = t(`PLANS.CATALOG.${plan.code.toUpperCase()}.description`, { defaultValue: plan.description || '' })

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

        <Button
          fullWidth
          onClick={() => onSelect(plan.code)}
          disabled={disabled}
        >
          {t('PLANS.PRICING.subscribe')}
        </Button>

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
  popular:  false,
  disabled: false
}

export default PricingPlanCard
