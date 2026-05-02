import React from 'react'
import { useTranslation } from 'react-i18next'

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
  const { profile, demo, loading: authLoading } = useAuthProvider()
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
    </Template>
  )
}

export default WV(Settings)
