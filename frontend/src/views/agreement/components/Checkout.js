import React, { memo, useContext } from 'react'
import RequiredPayment from 'components/RequiredPayment'
import PLANS from 'utils/plans'
import Template from 'components/Template'
import animations from 'utils/animations'
import { StripeContext } from 'store/context'
import useAuthProvider from 'hooks/useAuthProvider'
import Register from 'components/Register'

/**
 * @typedef {Object} CheckoutProps
 * @property {() => void} onClose
 * @property {() => void} onCharge
 * @property {boolean} status
 */
const allowed = [
  PLANS.BLUE,
  PLANS.GREEN,
  PLANS.DIAMOND,
  PLANS.MASTER,
  PLANS.GRANDMASTER
]

/**
 * @type {React.FunctionComponent<CheckoutProps>}
 */
const Checkout = ({ status, onCharge, onClose, onConfirmation}) => {
  const { demo } = useAuthProvider()

  const context = useContext(StripeContext)

  const handleChange = plan => {
    context.setPlan({
      ...plan
    })
  }

  const payment = {
    status: context.loading
  }

  return (
    <Template
      withLoader={status}
      withAnimationType={animations.LIGHTSPEED.LIGHT_SPEED_IN}
      withSocket={false}
    >
      {demo ? (
        <Register enabled onClose={onClose} />
      ) : (
        <RequiredPayment
          allowed={allowed}
          currentPlan={context.plan ? context.plan.name : ''}
          enabled
          onCloseRequest={onClose}
          onCharge={onCharge}
          onChangePlan={handleChange}
          onChargeConfirmation={onConfirmation}
          payment={payment}
        />
      )}
    </Template>
  )
}

export default memo(Checkout)
