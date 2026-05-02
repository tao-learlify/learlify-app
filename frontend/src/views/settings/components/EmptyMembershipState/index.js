import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Button } from 'components/ui'
import PATH from 'utils/path'
import styles from './EmptyMembershipState.module.scss'

const EmptyMembershipState = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <div className={styles.container}>
      <div className={styles.icon} aria-hidden="true">🎓</div>
      <h4 className={styles.title}>{t('SETTINGS.EMPTY_MEMBERSHIP.title')}</h4>
      <p className={styles.description}>
        {t('SETTINGS.EMPTY_MEMBERSHIP.description')}
      </p>
      <Button onClick={() => history.push(PATH.PAYMENTS)}>
        {t('SETTINGS.EMPTY_MEMBERSHIP.cta')}
      </Button>
    </div>
  )
}

export default EmptyMembershipState
