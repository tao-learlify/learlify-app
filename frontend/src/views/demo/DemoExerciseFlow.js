import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { GrammarExerciseView, ListeningExerciseView } from 'components/ui'
import {
  setTotalExercises,
  setScore as setGuestScore,
} from 'store/@reducers/guestSession'
import DemoAuthInterceptModal from './DemoAuthInterceptModal'
import styles from './DemoExerciseFlow.module.scss'

const AUTH_INTERCEPT_AFTER = 4

function calculateLevel(score) {
  if (score <= 40) return 'A1'
  if (score <= 55) return 'A2'
  if (score <= 70) return 'B1'
  if (score <= 85) return 'B2'
  return 'C1'
}

/**
 * Dynamically load exercises matching the exam layout.
 * Aptis: Grammar & Vocabulary or Listening categories
 * IELTS: mapped categories
 */
async function loadExercises(examType, competency) {
  const allExercises = []

  if (examType === 'Aptis') {
    const categoryMap = {
      Grammar: 'Grammar & Vocabulary',
      Listening: 'Listening',
    }
    const targetCategory = categoryMap[competency] || competency

    for (let i = 1; i <= 10; i++) {
      try {
        const num = String(i).padStart(2, '0')
        const exam = await import(`../../data/exams/aptis/exam-${num}.json`)
        const schema = exam.schema || exam.default?.schema || []
        for (const section of schema) {
          if (section.category === targetCategory && section.exercises) {
            allExercises.push(...section.exercises)
          }
        }
      } catch { /* skip missing files */ }
    }
  } else if (examType === 'IELTS') {
    const categoryMap = {
      Grammar: 'Reading',
      Listening: 'Listening',
    }
    const targetCategory = categoryMap[competency] || competency
    for (let i = 1; i <= 5; i++) {
      try {
        const num = String(i).padStart(2, '0')
        const exam = await import(`../../data/exams/ielts/ielts-${num}.json`)
        const schema = exam.schema || exam.default?.schema || []
        for (const section of schema) {
          if (section.category === targetCategory) {
            for (const exercise of (section.exercises || [])) {
              if (exercise.modules) {
                for (const mod of exercise.modules) {
                  for (const q of (mod.questions || [])) {
                    allExercises.push({
                      title: q.title || '',
                      answers: q.answers || [],
                      correct: q.correct ?? 0,
                      description: mod.title || '',
                      label: mod.module || 'Grammar',
                    })
                  }
                }
              } else if (exercise.answers) {
                allExercises.push(exercise)
              }
            }
          }
        }
      } catch { /* skip */ }
    }
  }

  return allExercises
}

const DemoExerciseFlow = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const guestSession = useSelector(state => state.guestSession)
  const { examType, competency, authIntercepted } = guestSession

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [completed, setCompleted] = useState(false)
  const questionCountRef = useRef(0)
  const authShownRef = useRef(false)

  // Load exercises
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    loadExercises(examType, competency).then(all => {
      if (cancelled) return
      const limited = all.slice(0, 20)
      setExercises(limited)
      dispatch(setTotalExercises(limited.length))
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [examType, competency, dispatch])

  // Called by the exercise component each time the user clicks "Continue"
  const handleAnswer = useCallback(() => {
    if (authIntercepted || authShownRef.current) return
    questionCountRef.current += 1
    if (questionCountRef.current >= AUTH_INTERCEPT_AFTER) {
      authShownRef.current = true
      setShowAuthModal(true)
    }
  }, [authIntercepted])

  // Block browser back button
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
      setShowExitConfirm(true)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleComplete = () => {
    const answeredCount = questionCountRef.current
    const total = exercises.length
    // Demo: estimate score at 70% of answered questions
    const estimatedScore = total > 0
      ? Math.round(((answeredCount * 0.7) / total) * 100)
      : 0
    const level = calculateLevel(Math.max(estimatedScore, 40))
    dispatch(setGuestScore({ score: estimatedScore, level, answered: answeredCount, total }))
    setCompleted(true)
  }

  const handleQuit = () => {
    setShowExitConfirm(true)
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
  }

  const handleGoToResult = () => {
    history.push('/demo/result')
  }

  const handleExitConfirmClose = () => {
    setShowExitConfirm(false)
  }

  const handleConfirmExit = () => {
    history.push('/')
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.loadingWrap}>
          <span className={styles.loadingEmoji} aria-hidden="true">⏳</span>
          <p className={styles.loadingText}>
            {t('DEMO.exercise.loading', { defaultValue: 'Preparando ejercicios…' })}
          </p>
        </div>
      </div>
    )
  }

  // Completion state
  if (completed) {
    return (
      <div className={styles.root}>
        <div className={styles.doneScreen}>
          <span className={styles.doneEmoji} aria-hidden="true">🎉</span>
          <h2 className={styles.doneTitle}>
            {t('DEMO.exercise.completed', { defaultValue: '¡Has completado todos los ejercicios!' })}
          </h2>
          <p className={styles.doneSubtitle}>
            {t('DEMO.exercise.resultReady', { defaultValue: 'Veamos cómo lo has hecho' })}
          </p>
          <button type="button" className={styles.doneBtn} onClick={handleGoToResult}>
            {t('DEMO.exercise.seeResult', { defaultValue: 'Ver mi resultado' })}
          </button>
        </div>
      </div>
    )
  }

  // No exercises
  if (exercises.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.doneScreen}>
          <span className={styles.doneEmoji} aria-hidden="true">😕</span>
          <h2 className={styles.doneTitle}>
            {t('DEMO.exercise.noExercises', { defaultValue: 'No hay ejercicios disponibles' })}
          </h2>
          <button type="button" className={styles.doneBtn} onClick={() => history.push('/demo/exam')}>
            {t('DEMO.exercise.goBack', { defaultValue: 'Volver a empezar' })}
          </button>
        </div>
      </div>
    )
  }

  // Render the appropriate exercise component
  const ExerciseComponent = competency === 'Listening' ? ListeningExerciseView : GrammarExerciseView

  return (
    <>
      <ExerciseComponent
        exercises={exercises}
        onComplete={handleComplete}
        onQuit={handleQuit}
        onAnswer={handleAnswer}
      />

      {/* Auth intercept modal */}
      <DemoAuthInterceptModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
      />

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className={styles.exitOverlay}
        >
          <div className={styles.exitCard}>
            <h3 className={styles.exitTitle}>
              {t('DEMO.exercise.exitConfirm', { defaultValue: '¿Seguro que quieres salir?' })}
            </h3>
            <p className={styles.exitMessage}>
              {t('DEMO.exercise.exitMessage', { defaultValue: 'Perderás todo tu progreso actual.' })}
            </p>
            <div className={styles.exitActions}>
              <button type="button" className={styles.exitStayBtn} onClick={handleExitConfirmClose}>
                {t('DEMO.exercise.stay', { defaultValue: 'Continuar' })}
              </button>
              <button type="button" className={styles.exitLeaveBtn} onClick={handleConfirmExit}>
                {t('DEMO.exercise.leave', { defaultValue: 'Salir' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DemoExerciseFlow
