import React from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'components/ui/Modal'
import { Button, Badge } from 'components/ui'
import styles from './cancel-subscription-modal.module.scss'

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   loading: boolean,
 *   periodEndDate: string,
 *   planName: string,
 *   speakingReviews: number,
 *   writingReviews: number,
 *   mode: 'cancel' | 'reactivate'
 * }} props
 */
const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  periodEndDate,
  planName = 'Pro',
  speakingReviews = 0,
  writingReviews = 0,
  mode = 'cancel'
}) => {
  const { t } = useTranslation()

  if (mode === 'reactivate') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        title={t('PLANS.PRICING.REACTIVATE_MODAL.title')}
        footer={
          <div className={styles.footer}>
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              {t('PLANS.PRICING.REACTIVATE_MODAL.notNow')}
            </Button>
            <Button variant="primary" onClick={onConfirm} disabled={loading} loading={loading}>
              {t('PLANS.PRICING.REACTIVATE_MODAL.confirm')}
            </Button>
          </div>
        }
      >
        <p className={styles.body}>
          {t('PLANS.PRICING.REACTIVATE_MODAL.body', {
            planName,
            date: periodEndDate
          })}
        </p>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={t('PLANS.PRICING.CANCEL_MODAL.title')}
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onConfirm} disabled={loading} loading={loading}>
            {t('PLANS.PRICING.CANCEL_MODAL.confirm')}
          </Button>
          <Button variant="primary" onClick={onClose} disabled={loading}>
            {t('PLANS.PRICING.CANCEL_MODAL.keep')}
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        <p className={styles.accessUntil}>
          {t('PLANS.PRICING.CANCEL_MODAL.accessUntil', {
            planName,
            date: periodEndDate
          })}
        </p>

        <p className={styles.loseAccess}>
          {t('PLANS.PRICING.CANCEL_MODAL.loseAccess')}
        </p>

        {(speakingReviews > 0 || writingReviews > 0) && (
          <div className={styles.planSummary}>
            <div className={styles.planSummaryHeader}>
              <span className={styles.planSummaryName}>{planName}</span>
              <Badge variant="active">
                {t('PLANS.PRICING.statusBadge.active')}
              </Badge>
            </div>
            <div className={styles.planCredits}>
              {speakingReviews > 0 && (
                <div className={styles.creditItem}>
                  <span className={styles.creditIcon}>🎤</span>
                  <span>
                    {t('PLANS.PRICING.CANCEL_MODAL.speakingReviews', {
                      count: speakingReviews
                    })}
                  </span>
                </div>
              )}
              {writingReviews > 0 && (
                <div className={styles.creditItem}>
                  <span className={styles.creditIcon}>✍️</span>
                  <span>
                    {t('PLANS.PRICING.CANCEL_MODAL.writingReviews', {
                      count: writingReviews
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <p className={styles.canReactivate}>
          {t('PLANS.PRICING.CANCEL_MODAL.canReactivate')}
        </p>
      </div>
    </Modal>
  )
}

export default CancelSubscriptionModal
