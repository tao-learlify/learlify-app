import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Badge } from 'components/ui'
import styles from './BillingHistoryCard.module.scss'

const STATUS_VARIANT = {
  paid: 'active',
  open: 'warning',
  void: 'neutral',
  uncollectible: 'danger'
}

/**
 * @param {Object} props
 * @param {import('hooks/useSubscription').InvoiceInfo[]} props.invoices
 * @param {boolean} [props.loading]
 */
const BillingHistoryCard = ({ invoices, loading }) => {
  const { t } = useTranslation()

  const formatDate = isoStr => {
    if (!isoStr) return '—'
    return new Date(isoStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount, currency) => {
    return `${amount.toFixed(2)} ${(currency || 'EUR').toUpperCase()}`
  }

  const renderContent = () => {
    if (loading) {
      return (
        <ul className={styles.invoiceList} aria-busy="true">
          {[1, 2, 3].map(i => (
            <li
              key={i}
              className={`${styles.invoiceRow} ${styles.skeletonRow}`}
            >
              <span className={styles.skeletonLine} style={{ width: '70%' }} />
              <span className={styles.skeletonLine} style={{ width: '50%' }} />
              <span className={styles.skeletonLine} style={{ width: '40%' }} />
              <span className={styles.skeletonLine} style={{ width: '30%' }} />
            </li>
          ))}
        </ul>
      )
    }
    if (!invoices.length) {
      return (
        <p className={styles.empty}>{t('SETTINGS.BILLING_HISTORY.empty')}</p>
      )
    }
    return (
      <>
        <div className={styles.listHeader}>
          <span>{t('SETTINGS.BILLING_HISTORY.date')}</span>
          <span>{t('SETTINGS.BILLING_HISTORY.amount')}</span>
          <span>{t('SETTINGS.BILLING_HISTORY.status')}</span>
          <span>{t('SETTINGS.BILLING_HISTORY.receipt')}</span>
        </div>
        <ul className={styles.invoiceList}>
          {invoices.map(invoice => (
            <li key={invoice.id} className={styles.invoiceRow}>
              <span className={styles.invoiceDate}>
                {formatDate(invoice.date)}
              </span>
              <span className={styles.invoiceAmount}>
                {formatAmount(invoice.amount, invoice.currency)}
              </span>
              <span className={styles.invoiceStatus}>
                <Badge variant={STATUS_VARIANT[invoice.status] || 'neutral'}>
                  {t(`SETTINGS.BILLING_HISTORY.STATUS.${invoice.status}`, {
                    defaultValue: invoice.status
                  })}
                </Badge>
              </span>
              <span className={styles.invoiceAction}>
                {invoice.receiptUrl ? (
                  <a
                    href={invoice.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadLink}
                  >
                    {t('SETTINGS.BILLING_HISTORY.download')}
                  </a>
                ) : (
                  <span className={styles.noReceipt}>—</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <Card elevated>
      <Card.Body>
        <span className={styles.sectionLabel}>
          {t('SETTINGS.BILLING_HISTORY.title')}
        </span>
        {renderContent()}
      </Card.Body>
    </Card>
  )
}

export default BillingHistoryCard
