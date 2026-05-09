import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'

import { withVerification as WV } from 'hocs'

import usePricing from 'hooks/usePricing'
import useToggler from 'hooks/useToggler'

import Template from 'components/Template'
import Payment from 'components/Payment'

import { select } from 'store/@reducers/plans'
import { fetchSubscriptionsThunk } from 'store/@thunks/subscriptions'
import { activeSubscriptionSelector } from 'store/@selectors/subscriptions'

import PATH from 'utils/path'

import PricingHero from './components/PricingHero'
import BillingCycleToggle from './components/BillingCycleToggle'
import PricingPlanCard from './components/PricingPlanCard'
import PricingLegalNotice from './components/PricingLegalNotice'
import PricingFAQ from './components/PricingFAQ'
import SubscriptionCancellationPanel from './components/SubscriptionCancellationPanel'

import styles from './plans.module.scss'

const Plans = () => {
  const history = useHistory()

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const pricing = usePricing({ preload: true })

  const activeSubscription = useSelector(activeSubscriptionSelector)

  useEffect(() => {
    dispatch(fetchSubscriptionsThunk())
  }, [dispatch])

  const [checkout, setCheckout] = useToggler()

  /**
   * Plans sorted by sortOrder from the catalog.
   * @type {import('@types/subscriptions').Plan[]}
   */
  const sortedPlans = [...pricing.data].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  )

  /**
   * Mark a plan as "popular" by convention: code aptis_pro (sortOrder=2).
   * Could be driven by a backend field in the future.
   * @param {import('@types/subscriptions').Plan} plan
   * @returns {boolean}
   */
  const isPopular = plan => plan.code === 'aptis_pro'

  /**
   * Select the plan from the catalog and open the checkout modal.
   * @param {string} planCode
   */
  const handleSelectPlan = planCode => {
    dispatch(select(planCode))
    setCheckout()
  }

  /**
   * @param {{ plan: { name: string } }} pkg
   */
  const handlePaymentRequest = ({ plan }) => {
    ToastsStore.success(
      t('COMPONENTS.BANNER.unblocked', { package: plan?.name || '' })
    )

    history.push(PATH.DASHBOARD)

    setCheckout()
  }

  return (
    <>
      <Template view>
        <PricingHero />

        <BillingCycleToggle
          selected={pricing.selectedBillingCycle}
          onChange={pricing.setBillingCycle}
        />

        <div className={styles.grid}>
          {sortedPlans.map(plan => (
            <PricingPlanCard
              key={plan.code}
              plan={plan}
              selectedCycle={pricing.selectedBillingCycle}
              popular={isPopular(plan)}
              onSelect={handleSelectPlan}
              disabled={checkout}
              activeSubscription={activeSubscription}
            />
          ))}
        </div>

        <PricingLegalNotice />

        <PricingFAQ />

        <SubscriptionCancellationPanel />
      </Template>

      <Payment
        defaultPaymentMethod
        billingCycle={pricing.selectedBillingCycle}
        openWindow={checkout}
        onCloseWindow={setCheckout}
        onPaymentRequest={handlePaymentRequest}
      />
    </>
  )
}

export default WV(Plans)
