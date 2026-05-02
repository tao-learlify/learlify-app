import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './pricing-legal-notice.module.scss'

const PricingLegalNotice = () => {
  const { t } = useTranslation()

  return <p className={styles.notice}>{t('PLANS.PRICING.legalNotice')}</p>
}

export default PricingLegalNotice
