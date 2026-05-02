import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './pricing-hero.module.scss'

const PricingHero = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.hero}>
      <h1 className={styles.headline}>{t('PLANS.PRICING.heroTitle')}</h1>
      <p className={styles.subheadline}>{t('PLANS.PRICING.heroSubtitle')}</p>
    </div>
  )
}

export default PricingHero
