import React, { useMemo, useState } from 'react'
import { ToastsStore } from 'react-toasts'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import useAccess from 'hooks/useAccess'
import useAuthProvider from 'hooks/useAuthProvider'
import usePackages from 'hooks/usePackages'
import usePlans from 'hooks/usePlans'

import Checkout from './components/Checkout'
import Text from 'components/Text'
import ModalDialog from 'components/ModalDialog'

import Details from './components/Details'
import FlexContainer from 'components/FlexContainer'

import creditCard from 'assets/img/credit-card.png'
import { select } from 'store/@reducers/plans'
import { createSubscriptionThunk } from 'store/@thunks/subscriptions'
import { getFullName } from 'utils/functions'

import styles from './payment.module.scss'
import PATH from 'utils/path'

import { grantControls } from 'store/@reducers/exams'
import { GRAY } from 'assets/colors'
import { Button } from 'styled'
import Register from 'components/Register'

/***
 * @typedef {Object} PaymentProps
 * @property {string} title
 * @property {boolean} openWindow
 * @property {() => void} onCloseWindow
 * @property {() => void} onPaymentRequest
 * @property {boolean} defaultPaymentMethod
 * @property {string []} restrict
 * @property {string} billingCycle
 */

/**
 * @type {React.FunctionComponent<PaymentProps>}
 */
const Payment = ({
  title,
  openWindow,
  onCloseWindow,
  onPaymentRequest,
  defaultPaymentMethod,
  restrict,
  billingCycle
}) => {
  const access = useAccess()

  const history = useHistory()

  const [processing, setProcessing] = useState(false)

  const idempotencyKeyRef = React.useRef(null)

  const user = useAuthProvider()

  const elements = useElements()

  const stripe = useStripe()

  const plans = usePlans()

  const { t } = useTranslation()

  const { createPackageIntent } = usePackages()

  const dispatch = useDispatch()

  React.useEffect(() => {
    if (openWindow) {
      idempotencyKeyRef.current = crypto.randomUUID()
    }
  }, [openWindow])

  /**
   * @param {React.FormEventHandler<HTMLFormElement>} e
   */
  const handlePayment = async e => {
    const { profile } = user

    const card = elements.getElement('card')

    setProcessing(true)
    /**
     * @description
     * First of all, we need to handle the paymentMethod.
     */
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name: getFullName(profile.firstName, profile.lastName)
      }
    })

    /**
     * @description
     * If error is presented, should be cancelled the process.
     */
    if (error) {
      setProcessing(false)

      return ToastsStore.error(error.message)
    }

    /**
     * Determine whether this is a new catalog plan (has prices[]) or a legacy plan.
     * New catalog plans use POST /subscriptions; legacy plans use POST /packages.
     */
    const selectedPlan = plans.selected
    const priceEntry = selectedPlan?.prices?.find(
      p => p.billingCycle === billingCycle
    )
    const planPriceId = priceEntry?.id

    if (planPriceId) {
      /**
       * New subscription flow: POST /api/v1/subscriptions
       */
      try {
        const result = await dispatch(
          createSubscriptionThunk({
            planPriceId,
            paymentMethodId: paymentMethod.id,
            idempotencyKey: idempotencyKeyRef.current
          })
        )

        unwrapResult(result)

        dispatch(grantControls())

        setProcessing(false)

        onCloseWindow()

        return onPaymentRequest({ plan: selectedPlan })
      } catch (err) {
        setProcessing(false)

        return ToastsStore.error(err?.message || t('COMPONENTS.payment.error'))
      }
    }

    /**
     * Legacy package flow: POST /api/v1/packages
     */
    const details = await createPackageIntent({
      paymentMethodId: paymentMethod.id,
      planId: plans.selected.id,
      requiresAction: false,
      cancel: false,
      billingCycle,
      idempotencyKey: idempotencyKeyRef.current
    })

    const results = unwrapResult(details)

    if (results.response.error) {
      ToastsStore.warning(results.response.details)

      return setProcessing(false)
    }

    if (results.response.intent.success) {
      if (
        access.haveAccess(results.response.package.plan, [
          access.accesses.EXAMS
        ])
      ) {
        dispatch(grantControls())
      }

      setProcessing(false)

      onCloseWindow()

      return onPaymentRequest(results.response.package)
    }

    if (results.response.intent.requiresAction) {
      const intent = await stripe.handleCardAction(
        results.response.intent.paymentIntentClientSecret
      )

      if (intent.error) {
        setProcessing(false)

        ToastsStore.warning(intent.error.message, expirationTimer)

        const result = await createPackageIntent({
          paymentMethodId: intent.error.payment_intent.id,
          planId: plans.selected.id,
          requiresAction: false,
          cancel: true,
          billingCycle,
          idempotencyKey: idempotencyKeyRef.current
        })

        const { response } = unwrapResult(result)

        if (response && response.package) {
          setProcessing(false)

          onCloseWindow()
        }
      }

      const setup = await createPackageIntent({
        paymentMethodId: intent.paymentIntent.id,
        planId: plans.selected.id,
        requiresAction: true,
        cancel: false,
        billingCycle,
        idempotencyKey: idempotencyKeyRef.current
      })

      const { response } = await unwrapResult(setup)

      if (response && response.package) {
        if (access.haveAccess(response.package.plan, [access.accesses.EXAMS])) {
          dispatch(grantControls())
        }

        setProcessing(false)

        onCloseWindow()

        return onPaymentRequest(response.package)
      }

      setProcessing(false)
    }
  }

  /**
   * @param {React.FormEvent<HTMLInputElement>}
   */
  const handleChangePlan = ({ target: { value } }) => {
    dispatch(select(value))
  }

  const handleHistoryRedirect = () => {
    history.push(PATH.DASHBOARD)
  }

  /**
   * @description
   * Filter results.
   */
  const filterWithAccess = useMemo(() => {
    return plans.data.filter(plan => access.haveAccess(plan, restrict))
  }, [access, plans.data, restrict])

  if (user.demo) {
    return (
      <Register
        enabled={openWindow}
        onClose={onCloseWindow}
        onComplete={() => history.push(PATH.MODELS)}
      />
    )
  }

  return (
    <React.Fragment>
      {defaultPaymentMethod || (
        <Text dunkin tag="h5" color="blue">
          {title ? title : t('COMPONENTS.payment.subscribe')}
          <img
            className={styles.image}
            alt="subscribe"
            src={creditCard}
            width={35}
          />
        </Text>
      )}
      {defaultPaymentMethod ? (
        <ModalDialog
          enabled={openWindow}
          textHeader={t('COMPONENTS.payment.details', {
            plan: plans.selected ? plans.selected.name : 'Default'
          })}
          onCloseRequest={onCloseWindow}
        >
          <FlexContainer>
            <Checkout
              defaultPaymentMethod
              disabled={processing}
              onPaymentRequest={handlePayment}
              onCancelPaymentRequest={onCloseWindow}
            />
          </FlexContainer>
        </ModalDialog>
      ) : restrict ? (
        <>
          <Details
            disabled={processing}
            data={filterWithAccess}
            onClick={handleChangePlan}
            current={plans.selected}
          />
          <FlexContainer>
            <Checkout
              defaultPaymentMethod={false}
              disabled={processing}
              onPaymentRequest={handlePayment}
              onCancelPaymentRequest={onCloseWindow}
            />
          </FlexContainer>
          <br />
          <FlexContainer>
            <Button background={GRAY} onClick={handleHistoryRedirect}>
              {t('ERRORS.dashboard')}
            </Button>
          </FlexContainer>
        </>
      ) : (
        <>
          <Details
            data={plans.data}
            onClick={handleChangePlan}
            current={plans.selected}
          />
          <br />
          <FlexContainer>
            <Button background={GRAY} onClick={handleHistoryRedirect}>
              {t('ERRORS.dashboard')}
            </Button>
          </FlexContainer>
        </>
      )}
      <br />
    </React.Fragment>
  )
}

const expirationTimer = 100000

Payment.defaultProps = {
  billingCycle: 'monthly',
  defaultPaymentMethod: true,
  onCloseWindow: () => null
}

export default React.memo(Payment)
