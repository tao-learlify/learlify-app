import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  recordAnswer,
  setTotalExercises,
  setScore as setGuestScore,
} from 'store/@reducers/guestSession'
import DemoAuthInterceptModal from './DemoAuthInterceptModal'
import styles from './DemoExerciseFlow.module.scss'

const AUTH_INTERCEPT_AFTER = 4  // configurable: show auth modal after this many exercises

function calculateLevel(score) {
  if (score <= 40) return 'A1'
  if (score <= 55) return 'A2'
  if (score <= 70) return 'B1'
  if (score <= 85) return 'B2'
  return 'C1'
}

/**
 * Dynamically load all exercises for the selected exam + competency.
 * For Aptis: loads from frontend/src/data/exams/aptis/exam-01.json through exam-10.json
 * For IELTS: loads from frontend/src/data/exams/ielts/ielts-01.json through ielts-05.json
 */
async function loadExercises(examType, competency) {
  /** @type {Array<{title: string, answers: string[], correct: number, description: string, label: string}>} */
  const allExercises = []

  if (examType === 'Aptis') {
    const count = 10
    // Map competency to the category name in Aptis data
    const categoryMap = {
      Grammar: 'Grammar & Vocabulary',
      Listening: 'Listening',
    }
    const targetCategory = categoryMap[competency] || competency

    for (let i = 1; i <= count; i++) {
      try {
        const num = String(i).padStart(2, '0')
        const exam = await import(`../../../data/exams/aptis/exam-${num}.json`)
        const schema = exam.schema || exam.default?.schema || []
        for (const section of schema) {
          if (section.category === targetCategory && section.exercises) {
            allExercises.push(...section.exercises)
          }
        }
      } catch {
        // file doesn't exist, skip
      }
    }
  } else if (examType === 'IELTS') {
    // IELTS data has a different structure — map competency to category
    const count = 5
    const categoryMap = {
      Grammar: 'Reading',    // IELTS Reading sections contain grammar questions
      Listening: 'Listening',
    }
    const targetCategory = categoryMap[competency] || competency
    for (let i = 1; i <= count; i++) {
      try {
        const num = String(i).padStart(2, '0')
        const exam = await import(`../../../data/exams/ielts/ielts-${num}.json`)
        const schema = exam.schema || exam.default?.schema || []
        for (const section of schema) {
          if (section.category === targetCategory) {
            for (const exercise of (section.exercises || [])) {
              // Flatten modules into individual questions
              if (exercise.modules) {
                for (const mod of exercise.modules) {
                  for (const q of (mod.questions || [])) {
                    allExercises.push({
                      title: q.title || '',
                      answers: q.answers || [],
                      correct: q.correct ?? 0,
                      description: mod.title || '',
                      label: mod.module || '',
                    })
                  }
                }
              } else if (exercise.answers) {
                // Direct exercise (like Aptis format)
                allExercises.push(exercise)
              }
            }
          }
        }
      } catch {
        // skip
      }
    }
  }

  return allExercises
}

function getAnswerLetter(index) {
  return String.fromCharCode(65 + index) // A, B, C, ...
}

const DemoExerciseFlow = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const guestSession = useSelector(state => state.guestSession)
  const { examType, competency, answers, authIntercepted } = guestSession

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  // Restore current index from session on refresh
  const [currentIndex, setCurrentIndex] = useState(guestSession.exerciseIndex || 0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Load exercises
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    loadExercises(examType, competency).then(all => {
      if (cancelled) return
      // Limit to 20 exercises max for the demo
      const limited = all.slice(0, 20)
      setExercises(limited)
      dispatch(setTotalExercises(limited.length))
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [examType, competency, dispatch])

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

  // beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const currentExercise = exercises[currentIndex]
  const total = exercises.length
  const progress = total > 0 ? ((currentIndex) / total) * 100 : 0

  const handleSelectAnswer = (answerIndex) => {
    if (showFeedback) return // already answered

    const isCorrect = answerIndex === currentExercise.correct
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    dispatch(recordAnswer({
      questionIndex: currentIndex,
      selectedAnswer: answerIndex,
      isCorrect,
    }))

    // Check for auth intercept
    const newScreensCompleted = (guestSession.screensCompleted || 0) + 1
    if (!authIntercepted && newScreensCompleted >= AUTH_INTERCEPT_AFTER) {
      // Show auth modal after a brief delay
      setTimeout(() => {
        setShowAuthModal(true)
      }, 800)
    }
  }

  const handleContinue = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= total) {
      // Finished all exercises
      const finalCorrect = answers.filter(a => a.isCorrect).length
      const score = Math.round((finalCorrect / total) * 100)
      const level = calculateLevel(score)
      dispatch(setGuestScore({ score, level }))
      setCompleted(true)
    } else {
      setCurrentIndex(nextIndex)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }, [currentIndex, total, answers, dispatch])

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
      <div className={styles.wrapper}>
        <div className={styles.exerciseArea}>
          <span className={styles.completionEmoji} aria-hidden="true">⏳</span>
          <p className={styles.completionSubtitle}>
            {t('DEMO.exercise.loading', { defaultValue: 'Preparando ejercicios…' })}
          </p>
        </div>
      </div>
    )
  }

  // Completion state
  if (completed) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.exerciseArea}>
          <div className={styles.completionScreen}>
            <span className={styles.completionEmoji} aria-hidden="true">🎉</span>
            <h2 className={styles.completionTitle}>
              {t('DEMO.exercise.completed', { defaultValue: '¡Has completado todos los ejercicios!' })}
            </h2>
            <p className={styles.completionSubtitle}>
              {t('DEMO.exercise.resultReady', { defaultValue: 'Veamos cómo lo has hecho' })}
            </p>
            <button
              type="button"
              className={styles.completionBtn}
              onClick={handleGoToResult}
            >
              {t('DEMO.exercise.seeResult', { defaultValue: 'Ver mi resultado' })}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No exercises found
  if (!currentExercise || total === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.exerciseArea}>
          <div className={styles.completionScreen}>
            <span className={styles.completionEmoji} aria-hidden="true">😕</span>
            <h2 className={styles.completionTitle}>
              {t('DEMO.exercise.noExercises', { defaultValue: 'No hay ejercicios disponibles' })}
            </h2>
            <p className={styles.completionSubtitle}>
              {t('DEMO.exercise.tryAnother', { defaultValue: 'Prueba con otro examen o competencia' })}
            </p>
            <button
              type="button"
              className={styles.completionBtn}
              onClick={() => history.push('/demo/exam')}
            >
              {t('DEMO.exercise.goBack', { defaultValue: 'Volver a empezar' })}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={styles.progressLabel}>
        <span>
          {t('DEMO.exercise.progress', { defaultValue: '{{current}} de {{total}}', current: currentIndex + 1, total })}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Exercise */}
      <div className={styles.exerciseArea}>
        <span className={styles.questionNumber}>
          {t('DEMO.exercise.question', { defaultValue: 'Pregunta {{n}}', n: currentIndex + 1 })}
        </span>
        <h2 className={styles.questionText}>
          {currentExercise.title?.replace(/\{x\}/g, '______') || currentExercise.description}
        </h2>

        <div className={styles.optionsList}>
          {(currentExercise.answers || []).map((answer, idx) => {
            let btnClass = styles.optionBtn
            let letterClass = styles.optionLetter

            if (showFeedback) {
              if (idx === currentExercise.correct) {
                btnClass += ` ${styles.optionCorrect}`
                letterClass += ` ${styles.optionLetterCorrect}`
              } else if (idx === selectedAnswer && idx !== currentExercise.correct) {
                btnClass += ` ${styles.optionWrong}`
                letterClass += ` ${styles.optionLetterWrong}`
              } else {
                btnClass += ` ${styles.optionDisabled}`
              }
            }

            return (
              <button
                key={idx}
                type="button"
                className={btnClass}
                onClick={() => handleSelectAnswer(idx)}
                disabled={showFeedback}
                aria-label={`${t('DEMO.exercise.option', { defaultValue: 'Opción' })} ${getAnswerLetter(idx)}: ${answer}`}
              >
                <span className={letterClass}>
                  {getAnswerLetter(idx)}
                </span>
                <span className={styles.optionText}>{answer.replace(/^[A-Z][.\s]+/, '')}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <>
            <div className={`${styles.feedbackBar} ${selectedAnswer === currentExercise.correct ? styles.feedbackCorrect : styles.feedbackWrong}`}>
              {selectedAnswer === currentExercise.correct
                ? t('DEMO.exercise.correct', { defaultValue: '✅ ¡Correcto!' })
                : t('DEMO.exercise.incorrect', { defaultValue: '❌ Incorrecto. La respuesta correcta es {{letter}}', letter: getAnswerLetter(currentExercise.correct) })
              }
            </div>
            <button
              type="button"
              className={styles.continueBtn}
              onClick={handleContinue}
            >
              {currentIndex + 1 >= total
                ? t('DEMO.exercise.finish', { defaultValue: 'Terminar' })
                : t('DEMO.exercise.continue', { defaultValue: 'Continuar' })
              }
            </button>
          </>
        )}
      </div>

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
          aria-label={t('DEMO.exercise.exitConfirm', { defaultValue: 'Confirmar salida' })}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1001, padding: 'var(--space-4)',
          }}
        >
          <div style={{ maxWidth: 360, background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>
              {t('DEMO.exercise.exitConfirm', { defaultValue: '¿Seguro que quieres salir?' })}
            </h3>
            <p style={{ margin: '0 0 16px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              {t('DEMO.exercise.exitMessage', { defaultValue: 'Perderás todo tu progreso actual.' })}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className={styles.continueBtn}
                style={{ background: '#ccc', boxShadow: 'none', flex: 1 }}
                onClick={handleExitConfirmClose}
              >
                {t('DEMO.exercise.stay', { defaultValue: 'Continuar' })}
              </button>
              <button
                type="button"
                className={styles.continueBtn}
                style={{ flex: 1 }}
                onClick={handleConfirmExit}
              >
                {t('DEMO.exercise.leave', { defaultValue: 'Salir' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoExerciseFlow
