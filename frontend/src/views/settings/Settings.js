import React from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs } from 'components/ui'
import Template from 'components/Template'

import useAuthProvider from 'hooks/useAuthProvider'
import useSubscription from 'hooks/useSubscription'

import { withVerification as WV } from 'hocs'

import AccountMembershipCard from './components/AccountMembershipCard'
import PaymentMethodsSection from './components/PaymentMethodsSection'
import ProfileInfoCard from './components/ProfileInfoCard'
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
    isLegacy,
    billingLoading
  } = useSubscription()

  const loading = authLoading || subLoading

  return (
    <Template withSidebar withAnimationType="fadeIn" withLoader={loading} view>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('SETTINGS.title')}</h1>
      </div>

      <Tabs defaultActiveKey="membership">
        <Tabs.Tab eventKey="membership" title={t('SETTINGS.TABS.membership')}>
          <div className={styles.billingRow}>
            <AccountMembershipCard
              subscription={subscription}
              isLegacy={isLegacy}
              demo={demo}
            />
            <PaymentMethodsSection
              paymentMethod={paymentMethod}
              loading={subLoading}
              demo={demo}
            />
          </div>
          <BillingHistoryCard invoices={invoices} loading={billingLoading} />
        </Tabs.Tab>

        <Tabs.Tab eventKey="personal" title={t('SETTINGS.TABS.personal')}>
          <ProfileInfoCard profile={profile} demo={demo} />
        </Tabs.Tab>
      </Tabs>
    </Template>
  )
}

export default WV(Settings)
