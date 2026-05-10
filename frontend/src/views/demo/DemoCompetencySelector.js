import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectCompetency } from 'store/@reducers/guestSession'
import styles from './DemoSteps.module.scss'

const COMPETENCIES = [
  {
    key: 'Listening',
    icon: '🎧',
    titleKey: 'DEMO.competencies.listening.title',
    descKey: 'DEMO.competencies.listening.description',
  },
  {
    key: 'Grammar',
    icon: '📝',
    titleKey: 'DEMO.competencies.grammar.title',
    descKey: 'DEMO.competencies.grammar.description',
  },
]

const DemoCompetencySelector = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleSelect = (competency) => {
    dispatch(selectCompetency(competency))
    history.push('/demo/exercise')
  }

  return (
    <div className={styles.wrapper}>
      {/* Progress dots */}
      <div className={styles.progressDots} aria-hidden="true">
        <span className={`${styles.dot} ${styles.dotDone}`} />
        <span className={`${styles.dot} ${styles.dotActive}`} />
        <span className={styles.dot} />
      </div>

      <span className={styles.stepLabel}>
        {t('DEMO.step2', { defaultValue: 'Paso 2 de 3' })}
      </span>
      <h1 className={styles.heading}>
        {t('DEMO.competencies.heading', { defaultValue: '¿Qué quieres practicar hoy?' })}
      </h1>
      <p className={styles.subheading}>
        {t('DEMO.competencies.subheading', { defaultValue: 'Selecciona una competencia para empezar los ejercicios' })}
      </p>

      <div className={styles.options}>
        {COMPETENCIES.map(comp => (
          <button
            key={comp.key}
            type="button"
            className={styles.optionCard}
            onClick={() => handleSelect(comp.key)}
            aria-label={t(comp.titleKey, { defaultValue: comp.key })}
          >
            <span className={styles.optionIcon} aria-hidden="true">
              {comp.icon}
            </span>
            <span className={styles.optionContent}>
              <span className={styles.optionTitle}>
                {t(comp.titleKey, { defaultValue: comp.key })}
              </span>
              <span className={styles.optionDesc}>
                {t(comp.descKey, { defaultValue: '' })}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DemoCompetencySelector
