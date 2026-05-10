import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectExam } from 'store/@reducers/guestSession'
import styles from './DemoSteps.module.scss'

const EXAMS = [
  {
    key: 'Aptis',
    icon: '🎯',
    titleKey: 'DEMO.exams.aptis.title',
    descKey: 'DEMO.exams.aptis.description',
  },
  {
    key: 'IELTS',
    icon: '🌍',
    titleKey: 'DEMO.exams.ielts.title',
    descKey: 'DEMO.exams.ielts.description',
  },
]

const DemoExamSelector = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleSelect = (examType) => {
    dispatch(selectExam(examType))
    history.push('/demo/competency')
  }

  return (
    <div className={styles.wrapper}>
      {/* Progress dots */}
      <div className={styles.progressDots} aria-hidden="true">
        <span className={`${styles.dot} ${styles.dotActive}`} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>

      <span className={styles.stepLabel}>
        {t('DEMO.step', { defaultValue: 'Paso 1 de 3' })}
      </span>
      <h1 className={styles.heading}>
        {t('DEMO.exams.heading', { defaultValue: '¿Qué examen quieres preparar?' })}
      </h1>
      <p className={styles.subheading}>
        {t('DEMO.exams.subheading', { defaultValue: 'Elige el examen que mejor se adapte a tus objetivos' })}
      </p>

      <div className={styles.options}>
        {EXAMS.map(exam => (
          <button
            key={exam.key}
            type="button"
            className={styles.optionCard}
            onClick={() => handleSelect(exam.key)}
            aria-label={t(exam.titleKey, { defaultValue: exam.key })}
          >
            <span className={styles.optionIcon} aria-hidden="true">
              {exam.icon}
            </span>
            <span className={styles.optionContent}>
              <span className={styles.optionTitle}>
                {t(exam.titleKey, { defaultValue: exam.key })}
              </span>
              <span className={styles.optionDesc}>
                {t(exam.descKey, { defaultValue: '' })}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DemoExamSelector
