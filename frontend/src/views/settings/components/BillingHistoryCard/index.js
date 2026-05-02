import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Badge } from 'components/ui'
import styles from './BillingHistoryCard.module.scss'

const STATUS_VARIANT = {
  paid:          'active',
  open:          'warning',
  void:          'neutral',
  uncollectible: 'danger'
}

/**
 * @param {Object} props
 * @param {import('hooks/useSubscription').InvoiceInfo[]} props.invoices
 */
const BillingHistoryCard = ({ invoices }) => {
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

  return (
    <Card elevated>
      <Card.Body>
        <span className={styles.sectionLabel}>
          {t('SETTINGS.BILLING_HISTORY.title')}
        </span>

        {!invoices.length ? (
          <p className={styles.empty}>{t('SETTINGS.BILLING_HISTORY.empty')}</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('SETTINGS.BILLING_HISTORY.date')}</th>
                  <th>{t('SETTINGS.BILLING_HISTORY.amount')}</th>
                  <th>{t('SETTINGS.BILLING_HISTORY.status')}</th>
                  <th>{t('SETTINGS.BILLING_HISTORY.receipt')}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{formatAmount(invoice.amount, invoice.currency)}</td>
                    <td>
                      <Badge variant={STATUS_VARIANT[invoice.status] || 'neutral'}>
                        {t(
                          `SETTINGS.BILLING_HISTORY.STATUS.${invoice.status}`,
                          { defaultValue: invoice.status }
                        )}
                      </Badge>
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default BillingHistoryCard
