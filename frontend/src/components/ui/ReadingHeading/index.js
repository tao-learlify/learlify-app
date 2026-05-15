import React, { useState, useCallback, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightning,
  BookOpen,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import styles from './ReadingHeading.module.scss'

const PHASE = {
  ANSWERING: 'answering',
  RESULTS:   'results',
}

// ── Heading status ─────────────────────────────────────────────────────────────
// Returns: 'default' | 'pending' | 'used' | 'correct' | 'wrong' | 'distractor'
function getHeadingStatus(letter, pending, assignments, phase, exercise) {
  if (phase === PHASE.RESULTS) {
    const assignedPara = Object.entries(assignments).find(([, l]) => l === letter)?.[0]
    if (!assignedPara) return 'distractor'
    const para = exercise.paragraphs.find(p => String(p.num) === assignedPara)
    return para?.correct === letter ? 'correct' : 'wrong'
  }
  if (pending === letter) return 'pending'
  return Object.values(assignments).includes(letter) ? 'used' : 'default'
}

// ── Paragraph status ───────────────────────────────────────────────────────────
// Returns: 'empty' | 'assigned' | 'invite' | 'correct' | 'wrong'
function getParagraphStatus(num, pending, assignments, phase, exercise) {
  if (phase === PHASE.RESULTS) {
    const assigned = assignments[String(num)]
    if (!assigned) return 'empty'
    const para = exercise.paragraphs.find(p => p.num === num)
    return assigned === para?.correct ? 'correct' : 'wrong'
  }
  if (assignments[String(num)]) return 'assigned'
  if (pending !== null) return 'invite'
  return 'empty'
}

// ── StepGuide ──────────────────────────────────────────────────────────────────
// Persistent 2-step flow indicator — always visible, makes next action obvious.
function StepGuide({ pending, phase }) {
  if (phase === PHASE.RESULTS) return null

  const step1Done = pending !== null

  return (
    <div className={styles.stepGuide} aria-label="How to answer">
      <div className={clsx(styles.stepPill, step1Done ? styles.stepPill_done : styles.stepPill_active)}>
        <span className={styles.stepNum}>
          {step1Done
            ? <CheckCircle weight="fill" size={12} aria-hidden="true" />
            : '1'
          }
        </span>
        <span className={styles.stepLabel}>
          {step1Done ? 'Heading selected' : 'Select a heading'}
        </span>
      </div>

      <span className={styles.stepArrow} aria-hidden="true">›</span>

      <div className={clsx(styles.stepPill, step1Done ? styles.stepPill_active : styles.stepPill_idle)}>
        <span className={styles.stepNum}>2</span>
        <span className={styles.stepLabel}>Tap a paragraph</span>
      </div>
    </div>
  )
}

// ── HeadingCard ────────────────────────────────────────────────────────────────
// assignedTo — paragraph number (int) this heading is currently placed in, or null
function HeadingCard({ heading, assignedTo, status, onClick }) {
  return (
    <button
      className={clsx(styles.headingCard, styles[`headingCard_${status}`])}
      onClick={onClick}
      disabled={
        status === 'correct' ||
        status === 'wrong'   ||
        status === 'distractor'
      }
      aria-pressed={status === 'pending'}
      aria-label={`Heading ${heading.letter}: ${heading.text}${assignedTo ? `, assigned to paragraph ${assignedTo}` : ''}`}
    >
      <span className={styles.headingLetter}>{heading.letter}</span>
      <span className={styles.headingText}>{heading.text}</span>
      {status === 'used' && assignedTo && (
        <span className={styles.headingAssignedTag} aria-hidden="true">¶{assignedTo}</span>
      )}
      {status === 'correct' && <CheckCircle weight="fill" size={15} className={styles.headingResultIcon} aria-hidden="true" />}
      {status === 'wrong'   && <XCircle     weight="fill" size={15} className={styles.headingResultIcon} aria-hidden="true" />}
    </button>
  )
}

// ── ParagraphCard ──────────────────────────────────────────────────────────────
function ParagraphCard({ paragraph, assignedHeading, headings, status, onClick }) {
  const assignedObj = assignedHeading ? headings.find(h => h.letter === assignedHeading) : null

  return (
    <div
      className={clsx(styles.paragraphCard, styles[`paragraphCard_${status}`])}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      aria-label={`Paragraph ${paragraph.num}${assignedHeading ? `, heading ${assignedHeading} assigned` : ', no heading assigned'}`}
    >
      <div className={styles.paragraphTop}>
        <span className={clsx(styles.paragraphNum, {
          [styles.paragraphNum_correct]: status === 'correct',
          [styles.paragraphNum_wrong]:   status === 'wrong',
        })}>
          {paragraph.num}
        </span>

        <div className={styles.paragraphMeta}>
          {assignedHeading && (
            <div className={clsx(styles.assignedBadge, {
              [styles.assignedBadge_correct]: status === 'correct',
              [styles.assignedBadge_wrong]:   status === 'wrong',
            })}>
              {status === 'correct' && <CheckCircle weight="fill" size={11} aria-hidden="true" />}
              {status === 'wrong'   && <XCircle     weight="fill" size={11} aria-hidden="true" />}
              <span className={styles.assignedLetter}>{assignedHeading}</span>
              {assignedObj && (
                <span className={styles.assignedHeadingText}>{assignedObj.text}</span>
              )}
            </div>
          )}
          {!assignedHeading && status === 'invite' && (
            <span className={styles.dropHint}>Drop here</span>
          )}
          {!assignedHeading && status === 'empty' && (
            <span className={styles.emptyHint}>—</span>
          )}
        </div>
      </div>

      <p className={styles.paragraphText}>{paragraph.text}</p>

      {status === 'wrong' && (
        <div className={styles.correctHint}>
          <span>
            Correct answer: <strong>{paragraph.correct}</strong>
            {' — '}
            {headings.find(h => h.letter === paragraph.correct)?.text}
          </span>
        </div>
      )}
    </div>
  )
}

// ── ProgressStrip ──────────────────────────────────────────────────────────────
function ProgressStrip({ assigned, total }) {
  return (
    <div className={styles.progressStrip}>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuenow={assigned}
        aria-valuemax={total}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${(assigned / total) * 100}%` }}
        />
      </div>
      <span className={styles.progressLabel}>{assigned}/{total}</span>
    </div>
  )
}

// ── FeedbackBanner ─────────────────────────────────────────────────────────────
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
            ? <CheckCircle weight="fill" size={22} />
            : <XCircle     weight="fill" size={22} />
          }
        </div>
        <div>
          <p className={styles.feedbackTitle}>
            {allCorrect ? 'All correct! 🎉' : `${score} of ${total} correct`}
          </p>
          {allCorrect && (
            <span className={styles.feedbackXp}>
              <Lightning weight="fill" size={12} aria-hidden="true" />
              +{xpReward} XP earned
            </span>
          )}
          {!allCorrect && (
            <p className={styles.feedbackSub}>
              Review the highlighted paragraphs and try again.
            </p>
          )}
        </div>
      </div>

      <div className={styles.feedbackActions}>
        {!allCorrect && (
          <button className={styles.retryBtn} onClick={onRetry}>
            <ArrowsClockwise weight="bold" size={16} aria-hidden="true" />
            Try again
          </button>
        )}
        {allCorrect && (
          <button className={styles.continueBtn} onClick={onContinue} autoFocus>
            Continue
            <ArrowRight weight="bold" size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── ReadingHeadingView ─────────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{
 *     title, instruction?,
 *     headings:   [{ letter: 'A'|...|'H', text }],   // 8 headings, 1 distractor
 *     paragraphs: [{ num: 19|...|25, text, correct: 'A'|...|'H' }]
 *   }]
 *   xpReward   — XP for perfect score (default 20)
 *   onComplete — () => void
 *   onQuit     — () => void
 */
export function ReadingHeadingView({
  exercises = [],
  xpReward  = 20,
  onComplete,
  onQuit,
}) {
  const [idx,         setIdx]        = useState(0)
  const [phase,       setPhase]      = useState(PHASE.ANSWERING)
  const [assignments, setAssignments] = useState({}) // { [paragraphNum as string]: letter }
  const [pending,     setPending]    = useState(null) // letter "in hand"

  const exercise = exercises[idx]
  const total    = exercises.length

  useEffect(() => {
    setPhase(PHASE.ANSWERING)
    setAssignments({})
    setPending(null)
  }, [idx])

  // ── Handlers ──────────────────────────────────────────────────────────────────

  // Click a heading → pick it up (or deselect if already pending)
  const handleHeadingClick = useCallback((letter) => {
    if (phase === PHASE.RESULTS) return

    if (pending === letter) {
      setPending(null)
      return
    }

    // If heading is already placed somewhere, un-assign it first
    const currentPara = Object.entries(assignments).find(([, l]) => l === letter)?.[0]
    if (currentPara) {
      setAssignments(prev => {
        const next = { ...prev }
        delete next[currentPara]
        return next
      })
    }

    setPending(letter)
  }, [phase, pending, assignments])

  // Click a paragraph → drop pending heading there, or pick up existing heading
  const handleParagraphClick = useCallback((num) => {
    if (phase === PHASE.RESULTS) return

    const key = String(num)

    if (pending !== null) {
      // Drop: assign pending heading to this paragraph (displaces any existing)
      setAssignments(prev => ({ ...prev, [key]: pending }))
      setPending(null)
    } else if (assignments[key]) {
      // Pick up: un-assign and put in hand
      const letter = assignments[key]
      setAssignments(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      setPending(letter)
    }
  }, [phase, pending, assignments])

  const handleCheck = useCallback(() => {
    setPending(null)
    setPhase(PHASE.RESULTS)
  }, [])

  const handleRetry = useCallback(() => {
    setAssignments({})
    setPending(null)
    setPhase(PHASE.ANSWERING)
  }, [])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) onComplete?.()
    else setIdx(i => i + 1)
  }, [idx, total, onComplete])

  if (!exercise) return null

  const { headings, paragraphs } = exercise

  // ── Derived ───────────────────────────────────────────────────────────────────
  const assignedCount = Object.keys(assignments).length
  const allAssigned   = assignedCount === paragraphs.length

  const score = useMemo(
    () => phase === PHASE.RESULTS
      ? paragraphs.filter(p => assignments[String(p.num)] === p.correct).length
      : 0,
    [phase, paragraphs, assignments]
  )

  const pandaMessage =
    phase === PHASE.RESULTS
      ? score === paragraphs.length
        ? 'All matched! Perfect score! 🎉'
        : `${score}/${paragraphs.length} correct — check the red ones 🔁`
    : assignedCount === 0
      ? 'Read the paragraphs, then match each one to a heading 👆'
    : assignedCount < paragraphs.length
      ? `${paragraphs.length - assignedCount} more to match…`
    : 'All matched! Check your answers 👀'

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>

        {/* ── Top row */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <BookOpen weight="fill" size={12} aria-hidden="true" />
            Reading
          </span>
          <span className={styles.xpBadge}>
            <Lightning weight="fill" size={13} aria-hidden="true" />
            +{xpReward} XP
          </span>
        </div>

        {/* ── Panda guide */}
        <div className={styles.pandaRow}>
          <img src={pandaImg} alt="" aria-hidden="true" className={styles.pandaImg} />
          <div className={styles.pandaBubble} key={pandaMessage} role="status">
            {pandaMessage}
          </div>
        </div>

        {/* ── Exercise header */}
        <div className={styles.exerciseHeader}>
          <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
          <p className={styles.exerciseInstruction}>
            {exercise.instruction ?? 'Choose the most suitable heading (A–H) for paragraphs 19–25. There is one heading you do not need to use.'}
          </p>
        </div>

        {/* ── Progress */}
        <ProgressStrip assigned={assignedCount} total={paragraphs.length} />

        {/* ── Step guide */}
        <StepGuide pending={pending} phase={phase} />

        {/* ── Split layout */}
        <div className={styles.splitLayout}>

          {/* Left: paragraphs */}
          <section className={styles.leftPanel} aria-label="Paragraphs">
            <p className={styles.panelLabel}>Paragraphs</p>
            <div className={styles.paragraphList}>
              {paragraphs.map(para => (
                <ParagraphCard
                  key={para.num}
                  paragraph={para}
                  assignedHeading={assignments[String(para.num)] ?? null}
                  headings={headings}
                  status={getParagraphStatus(para.num, pending, assignments, phase, exercise)}
                  onClick={() => handleParagraphClick(para.num)}
                />
              ))}
            </div>
          </section>

          {/* Right: headings */}
          <section className={styles.rightPanel} aria-label="Headings">
            <p className={styles.panelLabel}>
              Headings
              <span className={styles.panelLabelHint}>&nbsp;— one is extra</span>
            </p>
            <div className={styles.headingList}>
              {headings.map(h => {
                const assignedTo = Object.entries(assignments).find(([, l]) => l === h.letter)?.[0]
                return (
                  <HeadingCard
                    key={h.letter}
                    heading={h}
                    assignedTo={assignedTo ? Number(assignedTo) : null}
                    status={getHeadingStatus(h.letter, pending, assignments, phase, exercise)}
                    onClick={() => handleHeadingClick(h.letter)}
                  />
                )
              })}
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer */}
      <div className={styles.footer}>
        {phase === PHASE.ANSWERING ? (
          <button
            className={clsx(styles.checkBtn, { [styles.checkBtnReady]: allAssigned })}
            disabled={!allAssigned}
            onClick={handleCheck}
          >
            {allAssigned ? 'Check answers' : `Match all ${paragraphs.length} paragraphs first`}
          </button>
        ) : (
          <FeedbackBanner
            score={score}
            total={paragraphs.length}
            xpReward={xpReward}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  )
}
