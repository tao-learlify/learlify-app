import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ToastsStore } from 'react-toasts'
import { useTranslation } from 'react-i18next'

import useAccess from 'hooks/useAccess'
import usePlans from 'hooks/usePlans'

import Template from 'components/Template'

import PATH from 'utils/path'

import Payment from 'components/Payment'

const Error402 = () => {
  const { t } = useTranslation()

  const { accesses } = useAccess()

  const { fetchPlans } = usePlans()

  const location = useLocation()

  const history = useHistory()

  useEffect(() => {
    if (!Object(location.state).hasOwnProperty('paymentNeeded')) {
      history.push(PATH.DASHBOARD)
    }
  }, [history, location.state])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  useEffect(() => {
    switch (location.search) {
      case '?q=courses':
        break

      default:
        history.push(PATH.DASHBOARD)
    }
  }, [history, location.search])

  /**
   * @description
   * Handle payment request.
   */
  const handlePaymentRequest = ({ plan }) => {
    const planUnblocked = t('COMPONENTS.BANNER.unblocked', {
      package: plan.name
    })

    ToastsStore.success(planUnblocked)

    history.push(PATH.COURSES)
  }

  return (
    <Template view>
      <Payment
        defaultPaymentMethod={false}
        restrict={[accesses.COURSES]}
        onPaymentRequest={handlePaymentRequest}
      />
    </Template>
  )
}

export default Error402
