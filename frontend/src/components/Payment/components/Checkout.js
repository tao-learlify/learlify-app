import React, { memo } from 'react'
import { Card } from 'react-bootstrap'
import { CardElement } from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import { WhisperSpinner } from 'react-spinners-kit'
import Icon from 'react-icons-kit'

import classNames from 'clsx'

import Text from 'components/Text'

import styles from '../payment.module.scss'
import { Button } from 'components/ui'
import { BLUE, GRAY, RED, TURQUOISE, WHITE } from 'assets/colors'
import { ic_cancel } from 'react-icons-kit/md/ic_cancel'
import { ic_card_giftcard } from 'react-icons-kit/md/ic_card_giftcard'


/**
 * @typedef {Object} CheckoutProps
 * @property {boolean} disabled
 * @property {() => void} onPaymentRequest
 * @property {() => void} onCancelPaymentRequest
 */

/**
 * @type {React.FunctionComponent<CheckoutProps>}
 */
const Checkout = ({ defaultPaymentMethod, disabled, onPaymentRequest, onCancelPaymentRequest }) => {
  const { t } = useTranslation()

  const handleSubmit = () => {
    onPaymentRequest()
  }

  return (
    <Card className={classNames(defaultPaymentMethod || styles.setup)}>
      <Card.Body>
        <div className={classNames('checkout', styles.container)}>
          <div>
            <div className="d-flex justify-content-center">
            <Text className={styles.title} lighter bold color="blue" tag="small">
              {disabled ? (
                <> 
                  {t('COMPONENTS.payment.invoice')}
                </>
              ) : t('COMPONENTS.payment.placeholder')}
            </Text>
            {disabled && (
              <WhisperSpinner size={20} frontColor={TURQUOISE} backColor={GRAY} />
            )}
            </div>
            <form>
              <CardElement className="form-control" options={{ disabled }} />
              <div className={styles.button}>
                <Button
                  className={styles.cancel}
                  disabled={disabled}
                  background={RED}
                  color={WHITE}
                  onClick={onCancelPaymentRequest}
                >
                  {t('COMPONENTS.payment.cancel')} <Icon icon={ic_cancel} />
                </Button>
                <Button
                  onClick={handleSubmit}
                  className={styles.checkout}
                  disabled={disabled}
                  background={BLUE}
                  color={WHITE}
                >
                  {t('COMPONENTS.payment.action')} <Icon icon={ic_card_giftcard} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default memo(Checkout)
