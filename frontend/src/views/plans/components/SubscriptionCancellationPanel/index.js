import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './subscription-cancellation-panel.module.scss'

const SubscriptionCancellationPanel = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.panel}>
      <h4 className={styles.title}>{t('PLANS.CANCEL.title')}</h4>
      <p className={styles.description}>{t('PLANS.CANCEL.description')}</p>
    </div>
  )
}

export default SubscriptionCancellationPanel
