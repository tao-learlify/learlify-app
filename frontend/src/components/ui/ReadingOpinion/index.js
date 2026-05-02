import React, { useState, useCallback, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  LightningIcon,
  BookOpenIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react'
import pandaImg from 'assets/img/panda.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import styles from './ReadingOpinion.module.scss'

// ── Person palette — A B C D fixed colors ─────────────────────────────────────
// Each letter maps to a distinct, accessible color used across pills AND cards.
const PALETTE = {
  A: { bg: '#CCFBF1', border: '#5EEAD4', text: '#0F766E', badge: '#0D9488' },
  B: { bg: '#DBEAFE', border: '#93C5FD', text: '#1D4ED8', badge: '#3B82F6' },
  C: { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E', badge: '#D97706' },
  D: { bg: '#F3E8FF', border: '#D8B4FE', text: '#6D28D9', badge: '#7C3AED' },
}

const PHASE = {
  ANSWERING: 'answering',
  RESULTS:   'results',
}

// ── Compute pill display status ────────────────────────────────────────────────
function getPillStatus(letter, answer, phase, correctAnswer) {
  if (phase !== PHASE.RESULTS) {
    return answer === letter ? 'selected' : 'default'
  }
  // Results phase
  if (answer === letter) {
    return letter === correctAnswer ? 'correct' : 'wrong'
  }
  // Show correct answer hint only when user got it wrong
  if (letter === correctAnswer && answer !== null) return 'hint'
  return 'default'
}

// ── PersonCard ────────────────────────────────────────────────────────────────
// `assignedNums`  — array of question numbers (1-based) answered with this person
// `isActive`      — any question currently points to this person
// `isHighlighted` — the question the user is hovering has this person selected
function PersonCard({ person, isActive, isHighlighted, assignedNums }) {
  const pal = PALETTE[person.id]

  return (
    <div
      className={styles.personCard}
      data-active={isActive || undefined}
      data-highlighted={isHighlighted || undefined}
      style={{
        '--pal-bg':     pal.bg,
        '--pal-border': pal.border,
        '--pal-text':   pal.text,
        '--pal-badge':  pal.badge,
      }}
    >
      <div className={styles.personHeader}>
        <div className={styles.personBadge} aria-hidden="true">
          {person.id}
        </div>
        <span className={styles.personName}>{person.name}</span>

        {/* Question-number tags assigned to this person */}
        {assignedNums.length > 0 && (
          <div className={styles.assignedNums} aria-label={`Questions assigned: ${assignedNums.join(', ')}`}>
            {assignedNums.map(n => (
              <span key={n} className={styles.assignedDot}>{n}</span>
            ))}
          </div>
        )}
      </div>

      <p className={styles.personOpinion}>{person.opinion}</p>
    </div>
  )
}

// ── Pill ──────────────────────────────────────────────────────────────────────
function Pill({ letter, status, onClick, disabled }) {
  const pal = PALETTE[letter]

  return (
    <button
      className={clsx(styles.pill, styles[`pill_${status}`])}
      style={status === 'selected' ? {
        '--pal-bg':     pal.bg,
        '--pal-border': pal.border,
        '--pal-text':   pal.text,
      } : {}}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={status === 'selected' || status === 'correct'}
      aria-label={`Select person ${letter}`}
    >
      {status === 'correct' && <CheckCircleIcon weight="fill" size={11} aria-hidden="true" />}
      {status === 'wrong'   && <XCircleIcon     weight="fill" size={11} aria-hidden="true" />}
      {letter}
    </button>
  )
}

// ── QuestionItem ──────────────────────────────────────────────────────────────
function QuestionItem({ question, answer, phase, qIndex, onAnswer, onHover, onHoverEnd }) {
  const isAnswered = answer !== null
  const resultState = phase === PHASE.RESULTS
    ? (answer === question.correct ? 'correct' : 'wrong')
    : null

  return (
    <div
      className={clsx(styles.questionItem, {
        [styles.questionItem_answered]: isAnswered && phase === PHASE.ANSWERING,
        [styles.questionItem_correct]:  resultState === 'correct',
        [styles.questionItem_wrong]:    resultState === 'wrong',
      })}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <div className={styles.questionTop}>
        <span className={styles.questionNum} aria-hidden="true">{qIndex + 1}</span>
        <p className={styles.questionText}>{question.text}</p>
      </div>

      <div
        className={styles.pillRow}
        role="group"
        aria-label={`Answers for question ${qIndex + 1}`}
      >
        {['A', 'B', 'C', 'D'].map(letter => (
          <Pill
            key={letter}
            letter={letter}
            status={getPillStatus(letter, answer, phase, question.correct)}
            onClick={() => onAnswer(question.id, letter)}
            disabled={phase === PHASE.RESULTS}
          />
        ))}
      </div>
    </div>
  )
}

// ── ProgressStrip ─────────────────────────────────────────────────────────────
function ProgressStrip({ answered, total }) {
  return (
    <div className={styles.progressStrip}>
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={answered} aria-valuemax={total}>
        <div
          className={styles.progressFill}
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <span className={styles.progressLabel}>{answered}/{total}</span>
    </div>
  )
}

// ── FeedbackBanner ────────────────────────────────────────────────────────────
function FeedbackBanner({ score, total, xpReward, onContinue, onRetry }) {
  const allCorrect = score === total

  return (
    <div
      className={styles.feedbackBanner}
      data-correct={allCorrect}
      role="status"
      aria-live="assertive"
    >
      <div className={styles.feedbackBody}>
        <div className={styles.feedbackIcon} data-correct={allCorrect} aria-hidden="true">
          {allCorrect
            ? <CheckCircleIcon weight="fill" size={22} />
            : <XCircleIcon     weight="fill" size={22} />
          }
        </div>
        <div>
          <p className={styles.feedbackTitle}>
            {allCorrect ? 'All correct! 🎉' : `${score} of ${total} correct`}
          </p>
          {allCorrect && (
            <span className={styles.feedbackXp}>
              <LightningIcon weight="fill" size={12} aria-hidden="true" />
              +{xpReward} XP earned
            </span>
          )}
          {!allCorrect && (
            <p className={styles.feedbackSub}>
              Review the highlighted questions and try again.
            </p>
          )}
        </div>
      </div>

      <div className={styles.feedbackActions}>
        {!allCorrect && (
          <button className={styles.retryBtn} onClick={onRetry}>
            <ArrowsClockwiseIcon weight="bold" size={16} aria-hidden="true" />
            Try again
          </button>
        )}
        {allCorrect && (
          <button className={styles.continueBtn} onClick={onContinue} autoFocus>
            Continue
            <ArrowRightIcon weight="bold" size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── ReadingOpinionView ────────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{
 *     title, instruction?,
 *     people: [{ id: 'A'|'B'|'C'|'D', name, opinion }],
 *     questions: [{ id, text, correct: 'A'|'B'|'C'|'D' }]
 *   }]
 *   xpReward   — XP for perfect score (default 20)
 *   onComplete — () => void
 *   onQuit     — () => void
 */
export function ReadingOpinionView({
  exercises = [],
  xpReward  = 20,
  onComplete,
  onQuit,
}) {
  const [idx,      setIdx]     = useState(0)
  const [phase,    setPhase]   = useState(PHASE.ANSWERING)
  const [answers,  setAnswers] = useState({})    // { [questionId]: letter | null }
  const [hoveredQ, setHoveredQ] = useState(null) // questionId user is hovering

  const exercise = exercises[idx]
  const total    = exercises.length

  // Reset on exercise change
  useEffect(() => {
    setPhase(PHASE.ANSWERING)
    setAnswers({})
    setHoveredQ(null)
  }, [idx])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((qId, letter) => {
    if (phase === PHASE.RESULTS) return
    setAnswers(prev => ({
      ...prev,
      [qId]: prev[qId] === letter ? null : letter, // toggle deselects
    }))
  }, [phase])

  const handleCheck = useCallback(() => {
    setPhase(PHASE.RESULTS)
  }, [])

  const handleRetry = useCallback(() => {
    setAnswers({})
    setPhase(PHASE.ANSWERING)
  }, [])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) onComplete?.()
    else setIdx(i => i + 1)
  }, [idx, total, onComplete])

  if (!exercise) return null

  const { people, questions } = exercise

  // ── Derived ──────────────────────────────────────────────────────────────────
  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  )
  const allAnswered = answeredCount === questions.length

  const score = useMemo(
    () => phase === PHASE.RESULTS
      ? questions.filter(q => answers[q.id] === q.correct).length
      : 0,
    [phase, questions, answers]
  )

  // Map person → question numbers assigned to them (for badge dots on cards)
  const assignedMap = useMemo(() => {
    const map = { A: [], B: [], C: [], D: [] }
    questions.forEach((q, i) => {
      const selected = answers[q.id]
      if (selected) map[selected].push(i + 1)
    })
    return map
  }, [answers, questions])

  // Which person is currently referenced by the hovered question
  const hoveredPerson = hoveredQ !== null ? (answers[hoveredQ] ?? null) : null

  // Panda guidance
  const pandaMessage =
    phase === PHASE.RESULTS
      ? score === questions.length
        ? 'Perfect score! 🎉'
        : `${score}/${questions.length} correct — check the red ones and retry 🔁`
    : answeredCount === 0
      ? 'Read each opinion, then match the questions 👇'
    : answeredCount < questions.length
      ? `${questions.length - answeredCount} more to go…`
    : 'All done! Check your answers when ready 👀'

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>

        {/* ── Top row ─────────────────────────────────────────────────── */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <BookOpenIcon weight="fill" size={12} aria-hidden="true" />
            Reading
          </span>
          <span className={styles.xpBadge}>
            <LightningIcon weight="fill" size={13} aria-hidden="true" />
            +{xpReward} XP
          </span>
        </div>

        {/* ── Panda guide ─────────────────────────────────────────────── */}
        <div className={styles.pandaRow}>
          <img src={pandaImg} alt="" aria-hidden="true" className={styles.pandaImg} />
          <div className={styles.pandaBubble} key={pandaMessage} role="status">
            {pandaMessage}
          </div>
        </div>

        {/* ── Exercise header ──────────────────────────────────────────── */}
        <div className={styles.exerciseHeader}>
          <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
          <p className={styles.exerciseInstruction}>
            {exercise.instruction ?? 'Which person (A, B, C or D) says each of the following?'}
          </p>
        </div>

        {/* ── Progress strip ───────────────────────────────────────────── */}
        <ProgressStrip answered={answeredCount} total={questions.length} />

        {/* ── Split layout ─────────────────────────────────────────────── */}
        <div className={styles.splitLayout}>

          {/* Left: person opinion cards */}
          <section className={styles.leftPanel} aria-label="Opinions">
            <p className={styles.panelLabel}>Read the opinions</p>
            <div className={styles.personList}>
              {people.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  isActive={assignedMap[person.id].length > 0}
                  isHighlighted={hoveredPerson === person.id}
                  assignedNums={assignedMap[person.id]}
                />
              ))}
            </div>
          </section>

          {/* Right: question items */}
          <section className={styles.rightPanel} aria-label="Questions">
            <p className={styles.panelLabel}>Match the questions</p>
            <div className={styles.questionList}>
              {questions.map((q, i) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  answer={answers[q.id] ?? null}
                  phase={phase}
                  qIndex={i}
                  onAnswer={handleAnswer}
                  onHover={() => setHoveredQ(q.id)}
                  onHoverEnd={() => setHoveredQ(null)}
                />
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        {phase === PHASE.ANSWERING ? (
          <button
            className={clsx(styles.checkBtn, { [styles.checkBtnReady]: allAnswered })}
            disabled={!allAnswered}
            onClick={handleCheck}
          >
            {allAnswered ? 'Check answers' : `Answer all ${questions.length} questions first`}
          </button>
        ) : (
          <FeedbackBanner
            score={score}
            total={questions.length}
            xpReward={xpReward}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  )
}
