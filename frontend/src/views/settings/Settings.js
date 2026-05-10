import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ToastsStore } from 'react-toasts'

import { Button } from 'components/ui'
import Template from 'components/Template'
import Text from 'components/Text'

import useAuthProvider from 'hooks/useAuthProvider'
import useSubscription from 'hooks/useSubscription'

import { withVerification as WV } from 'hocs'

import AccountMembershipCard from './components/AccountMembershipCard'
import PaymentMethodCard from './components/PaymentMethodCard'
import ProfileInfoCard from './components/ProfileInfoCard'
import SecurityCard from './components/SecurityCard'
import BillingHistoryCard from './components/BillingHistoryCard'

import styles from './settings.module.scss'

const Settings = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { profile, demo, loading: authLoading, logOut } = useAuthProvider()
  const {
    subscription,
    paymentMethod,
    invoices,
    loading: subLoading,
    isLegacy
  } = useSubscription()

  const loading = authLoading || subLoading

  return (
    <Template withSidebar withAnimationType="fadeIn" withLoader={loading} view>
      <br />
      <div className={styles.row1}>
        <AccountMembershipCard
          subscription={subscription}
          isLegacy={isLegacy}
          demo={demo}
        />
        <PaymentMethodCard paymentMethod={paymentMethod} demo={demo} />
      </div>

      <div className={styles.row2}>
        <ProfileInfoCard profile={profile} demo={demo} />
        <SecurityCard profile={profile} demo={demo} />
      </div>

      <div className={styles.fullRow}>
        <BillingHistoryCard invoices={invoices} />
      </div>
      <br />
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '0 16px' }}>
        <Button
          variant="danger"
          block
          onClick={() => {
            logOut()
            ToastsStore.info(t('AUTHENTICATION.loggedOut', { defaultValue: 'Sesión cerrada' }))
            history.push('/')
          }}
        >
          {t('AUTHENTICATION.logout', { defaultValue: 'Cerrar sesión' })}
        </Button>
      </div>
    </Template>
  )
}

export default WV(Settings)
