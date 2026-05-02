import React from 'react'
import { ToastsStore } from 'react-toasts'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'clsx'

import useAccess from 'hooks/useAccess'
import useAuthProvider from 'hooks/useAuthProvider'
import useOffers from 'hooks/useOffers'
import useToggler from 'hooks/useToggler'

import Payment from 'components/Payment'
import Plan from 'components/Plan'

import styles from './styles.module.scss'
import { getItemStyle } from 'components/Exams/utils'
import { Button } from 'styled'
import { useDispatch } from 'react-redux'
import { select } from 'store/@reducers/plans'
import PATH from 'utils/path'
import { grantControls } from 'store/@reducers/exams'
import { BLUE, WHITE } from 'assets/colors'
import Register from 'components/Register'

const Banner = () => {
  const { demo } = useAuthProvider()

  const access = useAccess()

  const dispatch = useDispatch()

  const history = useHistory()

  const offers = useOffers()

  const { t } = useTranslation()

  const [openPayment, setPayment] = useToggler()

  /**
   * @param {Plan} plan
   */
  const handleOfferSelected = plan => {
    dispatch(select(plan))

    setPayment()
  }

  const handleRedirection = () => {
    history.push(PATH.PAYMENTS)
  }

  /**
   * @param {Package} payment
   */
  const handlePaymentRequestCompleted = payment => {
    /**
     * @description
     * If package contain access to exams we need to transform current exams to grant controls.
     */
    const grantsControlOnExams = access.haveAccess(payment.plan, [
      access.accesses.EXAMS
    ])

    /**
     * @description
     * Dispatching action, to unblock all exams.
     */
    if (grantsControlOnExams) {
      dispatch(grantControls())
    }

    ToastsStore.success(
      t('COMPONENTS.BANNER.unblocked', {
        package: payment.plan.name
      })
    )
  }

  return (
    <div className={classNames('border', styles.round, styles.container)}>
      {offers.data.map((offer, index) => (
        <Plan
          className={classNames(
            'text-center',
            styles.title,
            styles[getItemStyle(index)]
          )}
          item={styles[getItemStyle(index)]}
          key={offer.id}
          onUnblock={handleOfferSelected}
          {...offer}
        >
          <Button
            color={BLUE}
            background={WHITE}
            onClick={handleRedirection}
            className="w-75 mb-2 d-block d-sm-none"
          >
            {t('COMPONENTS.BANNER.details')}
          </Button>
        </Plan>
      ))}
      <br />
      {demo && openPayment ? (
        <Register
          enabled={openPayment}
          onClose={setPayment}
          onComplete={() => history.push(PATH.MODELS)}
        />
      ) : (
        <Payment
          openWindow={openPayment}
          onCloseWindow={setPayment}
          onPaymentRequest={handlePaymentRequestCompleted}
          defaultPaymentMethod
        />
      )}
    </div>
  )
}

export default Banner
