import React from 'react'
import classNames from 'clsx'
import { useTranslation } from 'react-i18next'
import styles from './billing-cycle-toggle.module.scss'

/**
 * @typedef {Object} BillingCycleToggleProps
 * @property {string} selected - 'monthly' | 'quarterly' | 'yearly'
 * @property {(cycle: string) => void} onChange
 */

/** @type {React.FunctionComponent<BillingCycleToggleProps>} */
const BillingCycleToggle = ({ selected, onChange }) => {
  const { t } = useTranslation()

  const cycles = [
    { key: 'monthly', label: t('PLANS.BILLING.monthly') },
    {
      key: 'quarterly',
      label: t('PLANS.BILLING.quarterly'),
      badge: t('PLANS.BILLING.save', { pct: 10 })
    },
    {
      key: 'yearly',
      label: t('PLANS.BILLING.yearly'),
      badge: t('PLANS.BILLING.save', { pct: 35 })
    }
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggle} role="group" aria-label="Billing cycle">
        {cycles.map(({ key, label, badge }) => (
          <button
            key={key}
            type="button"
            className={classNames(
              styles.option,
              selected === key && styles.active
            )}
            onClick={() => onChange(key)}
            aria-pressed={selected === key}
          >
            <span className={styles.label}>{label}</span>
            {badge && <span className={styles.badge}>{badge}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BillingCycleToggle
