import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Card, Button, Modal, Badge } from 'components/ui'
import SubscriptionStatusBadge from '../SubscriptionStatusBadge'
import EmptyMembershipState from '../EmptyMembershipState'
import useCancelSubscription from 'hooks/useCancelSubscription'
import PATH from 'utils/path'
import styles from './AccountMembershipCard.module.scss'

/**
 * @param {Object} props
 * @param {import('hooks/useSubscription').SubscriptionInfo|null} props.subscription
 * @param {boolean} [props.isLegacy]
 * @param {boolean} [props.demo]
 */
const AccountMembershipCard = ({ subscription, isLegacy, demo }) => {
  const { t } = useTranslation()
  const history = useHistory()

  const { cancel, loading: canceling } = useCancelSubscription()

  const [showCancelModal, setShowCancelModal] = useState(false)

  const formatDate = isoStr => {
    if (!isoStr) return t('SETTINGS.SUBSCRIPTION.noRenewal')
    return new Date(isoStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleCancelConfirm = async () => {
    if (!subscription?.subscriptionId) return
    await cancel(subscription.subscriptionId, false)
    setShowCancelModal(false)
  }

  if (isLegacy) {
    return (
      <Card elevated>
        <Card.Body>
          <span className={styles.sectionLabel}>
            {t('SETTINGS.SUBSCRIPTION.title')}
          </span>
          <p className={styles.legacyDescription}>
            {t('SETTINGS.LEGACY.description')}
          </p>
          <div className={styles.actions}>
            <Button onClick={() => history.push(PATH.PAYMENTS)}>
              {t('SETTINGS.LEGACY.cta')}
            </Button>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card elevated>
        <Card.Body>
          <span className={styles.sectionLabel}>
            {t('SETTINGS.SUBSCRIPTION.title')}
          </span>

          {!subscription ? (
            <EmptyMembershipState />
          ) : (
            <>
              <div className={styles.planLayout}>
                <div className={styles.planIcon} aria-hidden="true">
                  {subscription.planName.charAt(0)}
                </div>
                <div className={styles.planContent}>
                  <div className={styles.planNameRow}>
                    <p className={styles.planName}>{subscription.planName}</p>
                    <SubscriptionStatusBadge status={subscription.status} />
                  </div>

                  {subscription.price != null && (
                    <p className={styles.planPrice}>
                      {subscription.discount > 0 && (
                        <Badge variant="active">
                          -{subscription.discount}%
                        </Badge>
                      )}
                      <span className={styles.priceAmount}>
                        {subscription.price}&nbsp;{subscription.currency}
                      </span>
                      <span className={styles.perMonth}>
                        {t('SETTINGS.SUBSCRIPTION.perMonth')}
                      </span>
                    </p>
                  )}

                  <dl className={styles.metaList}>
                    <div className={styles.metaItem}>
                      <dt>{t('SETTINGS.SUBSCRIPTION.billingCycleLabel')}</dt>
                      <dd>
                        {t(
                          `SETTINGS.SUBSCRIPTION.BILLING_CYCLE.${subscription.billingCycle}`,
                          { defaultValue: subscription.billingCycle }
                        )}
                      </dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>{t('SETTINGS.SUBSCRIPTION.renewalLabel')}</dt>
                      <dd>
                        {subscription.cancelAtPeriodEnd
                          ? t('SETTINGS.SUBSCRIPTION.noRenewal')
                          : formatDate(subscription.currentPeriodEnd)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <p className={styles.cancelNotice}>
                  {t('SETTINGS.SUBSCRIPTION.cancelAtPeriodEndMessage', {
                    date: formatDate(subscription.currentPeriodEnd)
                  })}
                </p>
              )}

              <div className={styles.actions}>
                <Button
                  onClick={() => history.push(PATH.PAYMENTS)}
                  disabled={demo}
                >
                  {t('SETTINGS.SUBSCRIPTION.changePlan')}
                </Button>
                {subscription.status === 'active' &&
                  !subscription.cancelAtPeriodEnd && (
                    <Button
                      variant="danger"
                      disabled={demo || canceling}
                      onClick={() => setShowCancelModal(true)}
                    >
                      {t('SETTINGS.SUBSCRIPTION.cancelSubscription')}
                    </Button>
                  )}
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title={t('SETTINGS.SUBSCRIPTION.cancelModal.title')}
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowCancelModal(false)}
              disabled={canceling}
            >
              {t('SETTINGS.SUBSCRIPTION.cancelModal.dismiss')}
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
              loading={canceling}
            >
              {canceling
                ? t('SETTINGS.SUBSCRIPTION.cancelModal.canceling')
                : t('SETTINGS.SUBSCRIPTION.cancelModal.confirm')}
            </Button>
          </>
        }
      >
        {t('SETTINGS.SUBSCRIPTION.cancelModal.body', {
          date: formatDate(subscription?.currentPeriodEnd)
        })}
      </Modal>
    </>
  )
}

AccountMembershipCard.defaultProps = {
  demo: false,
  isLegacy: false
}

export default AccountMembershipCard
