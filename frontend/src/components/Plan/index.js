import React from 'react'
import { useTranslation } from 'react-i18next'

import Text from 'components/Text'
import BreaklineText from 'components/BreaklineText'
import FlexContainer from 'components/FlexContainer'


import { Button } from 'styled'
import { YELLOW } from 'assets/colors'

import styles from './styles.module.scss'

import { getPackagePrice } from 'utils/functions'


/**
 * @type {React.FunctionComponent<Plan>}
 */
const Plan = ({ children, className, currency, name, price, pandaUrl, onUnblock }) => {
  const { t } = useTranslation()

  /**
   * @param {Plan} plan
   */
  const handleUnblockOffer = () => {
    onUnblock(name)
  }

  return (
    <div className={className}>
      <img alt="plan" className={styles.padding} src={pandaUrl} width={150} />
      <div about="selector">
        <Text center bold tag="h3">
          {name}
        </Text>
        <BreaklineText
          className={styles.text}
          center
          tag="h5"
          splitWithDiv
          breaklineClassName="p-0 m-0"
          value={t(`PLANS.banner.${name}`)}
        />
        <FlexContainer>
          {children}
        </FlexContainer>
        <Button
          onClick={handleUnblockOffer}
          about="unblock"
          block
          background={YELLOW}
        >
          {t('COMPONENTS.BANNER.unblock')} {getPackagePrice(price)} {currency}
        </Button>
      </div>
    </div>
  )
}

export default Plan
