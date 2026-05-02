import React from 'react'
import { useTranslation } from 'react-i18next'
import { img } from 'assets/img'
import styles from './pricing-feature-list.module.scss'

/**
 * @typedef {Object} PricingFeatureListProps
 * @property {number|null} includedExams              - null means unlimited
 * @property {number}      includedSpeakingReviews
 * @property {number}      includedWritingReviews
 * @property {boolean}     includesCourse
 */

/** @type {React.FunctionComponent<PricingFeatureListProps>} */
const PricingFeatureList = ({
  includedExams,
  includedSpeakingReviews,
  includedWritingReviews,
  includesCourse
}) => {
  const { t } = useTranslation()

  const items = [
    {
      key: 'exams',
      icon: img.test,
      label:
        includedExams === null
          ? t('PLANS.FEATURES.unlimitedExams')
          : t('PLANS.FEATURES.limitedExams', { count: includedExams }),
      available: true,
      count: null
    },
    {
      key: 'course',
      icon: includesCourse ? img.course : img.cancel,
      label: includesCourse
        ? t('PLANS.FEATURES.course')
        : t('PLANS.FEATURES.noCourse'),
      available: includesCourse,
      count: null
    },
    {
      key: 'writing',
      icon: includedWritingReviews > 0 ? img.writing : img.cancel,
      label:
        includedWritingReviews === 0
          ? t('PLANS.FEATURES.noWriting')
          : t('PLANS.FEATURES.writingLabel'),
      available: includedWritingReviews > 0,
      count: includedWritingReviews > 0 ? includedWritingReviews : null
    },
    {
      key: 'speaking',
      icon: includedSpeakingReviews > 0 ? img.speaking : img.cancel,
      label:
        includedSpeakingReviews === 0
          ? t('PLANS.FEATURES.noSpeaking')
          : t('PLANS.FEATURES.speakingLabel'),
      available: includedSpeakingReviews > 0,
      count: includedSpeakingReviews > 0 ? includedSpeakingReviews : null
    }
  ]

  return (
    <ul className={styles.list}>
      {items.map(({ key, icon, label, available, count }) => (
        <li
          key={key}
          className={available ? styles.available : styles.unavailable}
        >
          <span className={styles.icon}>
            <img src={icon} alt="" aria-hidden="true" />
          </span>
          <span>
            {label}
            {count !== null && (
              <>
                : <strong className={styles.count}>{count}</strong>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

PricingFeatureList.defaultProps = {
  includedExams: null,
  includedSpeakingReviews: 0,
  includedWritingReviews: 0,
  includesCourse: false
}

export default PricingFeatureList
