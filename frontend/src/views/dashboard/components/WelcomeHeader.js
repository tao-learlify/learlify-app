import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Fire, Lightning, Star } from '@phosphor-icons/react'
import styles from './WelcomeHeader.module.scss'

/**
 * WelcomeHeader — Dashboard greeting with inline stat pills.
 *
 * @param {string} firstName    - User's first name
 * @param {number} [streak]     - Current streak days (shown as pill)
 * @param {number} [totalXP]    - Total XP earned (shown as pill)
 * @param {number} [stars]      - Stars earned (shown as pill)
 * @param {string} [className]
 */
const WelcomeHeader = memo(function WelcomeHeader({
  firstName,
  streak,
  totalXP,
  stars,
  className,
}) {
  const { t } = useTranslation()

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? t('DASHBOARD.goodMorning', { defaultValue: 'Good morning' })
    : hour < 18 ? t('DASHBOARD.goodAfternoon', { defaultValue: 'Good afternoon' })
    : t('DASHBOARD.goodEvening', { defaultValue: 'Good evening' })

  return (
    <header className={className}>
      <div className={styles.textBlock}>
        <h1 className={styles.greeting}>
          {greeting}{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className={styles.sub}>
          {t('DASHBOARD.welcomeSubtitle', { defaultValue: "Let's keep the momentum going." })}
        </p>
      </div>

      {(streak != null || totalXP != null || stars != null) && (
        <div className={styles.pills}>
          {streak != null && (
            <div className={styles.pill} aria-label={`${streak} days on streak`}>
              <Fire weight="fill" size="var(--icon-lg)" className={styles.pillIconFire} aria-hidden="true" />
              <span className={`${styles.pillValue} ${styles.pillValueAmber}`}>{streak}</span>
              <span className={styles.pillLabel}>days on streak</span>
            </div>
          )}
          {totalXP != null && (
            <div className={styles.pill} aria-label={`${totalXP} XP`}>
              <Lightning weight="fill" size="var(--icon-lg)" className={styles.pillIconXP} aria-hidden="true" />
              <span className={`${styles.pillValue} ${styles.pillValueGreen}`}>{totalXP}</span>
              <span className={styles.pillLabel}>XP</span>
            </div>
          )}
          {stars != null && (
            <div className={styles.pill} aria-label={`${stars} stars`}>
              <Star weight="fill" size="var(--icon-lg)" className={styles.pillIconStar} aria-hidden="true" />
              <span className={`${styles.pillValue} ${styles.pillValueAmber}`}>{stars}</span>
              <span className={styles.pillLabel}>stars</span>
            </div>
          )}
        </div>
      )}
    </header>
  )
})

export default WelcomeHeader
