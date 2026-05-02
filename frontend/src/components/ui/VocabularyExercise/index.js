import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Check, XCircle, ArrowRight, Lightning, Sparkle, ArrowsClockwise, HourglassIcon } from '@phosphor-icons/react'
import pandaImg from 'assets/img/panda.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import styles from './VocabularyExercise.module.scss'

// ── Phase ──────────────────────────────────────────────────────────────────────
const PHASE = {
  FILL:             'fill',
  FAILED:           'failed',           // user submitted wrong answers — red state
  REVIEW_COUNTDOWN: 'reviewCountdown',  // 3…2…1 before cascade
  REVIEWING:        'reviewing',        // cascade actively revealing correct answers
  REVIEW_COMPLETE:  'reviewComplete',   // all rows revealed — try again CTA
  SUCCESS:          'success',          // all correct on first try — celebrate
}

// ── Timing ─────────────────────────────────────────────────────────────────────
const FAIL_PAUSE            = 800   // ms user sees red rows before countdown starts
const COUNTDOWN_START       = 3     // shows 3 → 2 → 1
const COUNTDOWN_TICK        = 1000  // ms per tick
const CASCADE_STAGGER       = 350   // ms between each row reveal (slow enough to read)
const CASCADE_ROW_DURATION  = 700   // ms per individual row correction animation
const REVIEW_COMPLETE_DELAY = 500   // ms after last row before showing CTA

const REVIEW_PANDA_MESSAGES = [
  "Watch carefully 👀",
  "Here's the right set",
  "Let's review 📝",
  "Almost! Let's see…",
]

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── Data helpers ───────────────────────────────────────────────────────────────
function stripAnswerPrefix(str) { return str.replace(/^[A-Za-z]\.\s*/, '').trim() }
function stripQuestionNumber(str) { return str.replace(/^\s*\d+\.\s*/, '').trim() }
function parseWord(title) { return stripQuestionNumber(title).split('{x}')[0].trim() }

function buildPool(questions) {
  const pool = []
  questions.forEach((q, qIdx) => {
    q.answers.forEach((ans, aIdx) => {
      pool.push({
        id:           `${qIdx}-${aIdx}`,
        text:         stripAnswerPrefix(ans),
        isCorrectFor: qIdx,
        isCorrect:    aIdx === q.correct,
      })
    })
  })
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

// ── PandaGuide ─────────────────────────────────────────────────────────────────
function PandaGuide({ mood, message }) {
  return (
    <div className={styles.pandaWrapper}>
      {message && (
        <div className={styles.speechBubble} data-mood={mood} key={message}>
          {message}
        </div>
      )}
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        className={clsx(styles.pandaDecor, {
          [styles.pandaIdle]:  mood === 'idle',
          [styles.pandaHappy]: mood === 'happy',
          [styles.pandaOops]:  mood === 'oops',
        })}
      />
    </div>
  )
}

// ── WordRow ────────────────────────────────────────────────────────────────────
// inReview: true during any review phase — suppresses XP badge on corrected rows
function WordRow({ word, icon, slot, isNext, onSlotClick, animDelay, xpReward, inReview }) {
  const { status, text, correctText } = slot

  let rowState = 'idle'
  if (!slot.answerId && isNext)  rowState = 'next'
  if (status === 'correct')      rowState = 'correct'
  if (status === 'incorrect')    rowState = 'incorrect'
  if (status === 'correcting')   rowState = 'correcting'
  if (status === 'corrected')    rowState = 'correct'

  let slotState = 'empty'
  if (!slot.answerId && isNext)  slotState = 'next'
  if (status === 'filled')       slotState = 'filled'
  if (status === 'correct')      slotState = 'correct'
  if (status === 'incorrect')    slotState = 'incorrect'
  if (status === 'correcting' || status === 'corrected') slotState = 'correct'

  const isLocked = ['correct', 'correcting', 'corrected'].includes(status)

  return (
    <div
      className={styles.wordRow}
      data-state={rowState}
      style={{ '--anim-delay': animDelay || '0ms' }}
    >
      {icon && <span className={styles.rowIcon} aria-hidden="true">{icon}</span>}

      <span className={styles.rowWord}>{word}</span>
      <span className={styles.rowConnector} aria-hidden="true">→</span>

      <button
        className={styles.slotTarget}
        data-state={slotState}
        onClick={onSlotClick}
        disabled={isLocked}
        aria-label={text ? `${word}: ${text}, tap to remove` : `${word}: empty`}
      >
        {status === 'correcting' ? (
          <span className={styles.swapContainer} aria-hidden="true">
            <span className={styles.wrongLeaves}>{text}</span>
            <span className={styles.correctEnters}>{correctText}</span>
          </span>
        ) : text ? (
          <>
            <span className={styles.slotText}>{text}</span>
            {status === 'correct' && (
              <Check weight="bold" size={14} className={styles.slotIcon} aria-hidden="true" />
            )}
            {status === 'corrected' && (
              <Check weight="bold" size={14} className={clsx(styles.slotIcon, styles.checkPop)} aria-hidden="true" />
            )}
            {status === 'incorrect' && (
              <XCircle weight="bold" size={14} className={styles.slotIcon} aria-hidden="true" />
            )}
          </>
        ) : (
          <span className={styles.slotPlaceholder}>
            {isNext ? 'place here' : '?'}
          </span>
        )}
      </button>

      {/* XP micro-badge: only for first-try correct answers, never during review */}
      {status === 'correct' && !inReview && (
        <span className={styles.microXp} aria-hidden="true">+{xpReward} XP</span>
      )}
    </div>
  )
}

// ── AnswerChip ─────────────────────────────────────────────────────────────────
function AnswerChip({ answer, chipState, onClick }) {
  return (
    <button
      className={styles.answerChip}
      data-state={chipState}
      disabled={chipState === 'used'}
      onClick={onClick}
      aria-label={answer.text}
    >
      {answer.text}
    </button>
  )
}

// ── VocabularyExerciseView ─────────────────────────────────────────────────────
export function VocabularyExerciseView({
  questions = [],
  xpReward  = 10,
  onComplete,
  onQuit,
}) {
  const pool = useMemo(() => buildPool(questions), [questions])
  const timersRef = useRef([])

  const makeEmptySlot = () => ({
    answerId: null, text: '', correctText: '', status: 'idle', isCorrect: false,
  })

  const [slots, setSlots] = useState(() =>
    Object.fromEntries(questions.map((_, i) => [i, makeEmptySlot()]))
  )

  const [phase,               setPhase]               = useState(PHASE.FILL)
  const [countdown,           setCountdown]           = useState(null)
  const [pandaMood,           setPandaMood]           = useState('idle')
  const [pandaMessage,        setPandaMessage]        = useState(null)
  const [xpTotal,             setXpTotal]             = useState(0)
  const [initialCorrectCount, setInitialCorrectCount] = useState(0)

  useEffect(() => {
    return () => { timersRef.current.forEach(clearTimeout) }
  }, [])

  const totalPossibleXp = questions.length * xpReward

  // True during any review phase — suppresses reward visuals
  const inReview = [
    PHASE.FAILED, PHASE.REVIEW_COUNTDOWN, PHASE.REVIEWING, PHASE.REVIEW_COMPLETE,
  ].includes(phase)

  const placedIds = useMemo(() => {
    const ids = new Set()
    Object.values(slots).forEach(s => { if (s.answerId) ids.add(s.answerId) })
    return ids
  }, [slots])

  const filledCount = Object.values(slots).filter(s => s.answerId).length
  const allFilled   = filledCount === questions.length

  const nextEmptyIdx = useMemo(
    () => questions.findIndex((_, i) => !slots[i]?.answerId),
    [questions, slots]
  )

  const handleChipClick = useCallback(answerId => {
    if (nextEmptyIdx === -1) return
    const answer = pool.find(a => a.id === answerId)
    if (!answer) return
    setSlots(prev => ({
      ...prev,
      [nextEmptyIdx]: { ...prev[nextEmptyIdx], answerId: answer.id, text: answer.text, status: 'filled' },
    }))
  }, [nextEmptyIdx, pool])

  const handleSlotClick = useCallback(qIdx => {
    if (phase !== PHASE.FILL) return
    const slot = slots[qIdx]
    if (!slot?.answerId) return
    setSlots(prev => ({
      ...prev,
      [qIdx]: { ...prev[qIdx], answerId: null, text: '', status: 'idle' },
    }))
  }, [phase, slots])

  // Reset to a fresh attempt
  const handleRetry = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setSlots(Object.fromEntries(questions.map((_, i) => [i, makeEmptySlot()])))
    setPhase(PHASE.FILL)
    setCountdown(null)
    setPandaMood('idle')
    setPandaMessage(null)
    setXpTotal(0)
    setInitialCorrectCount(0)
  }, [questions]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheck = useCallback(() => {
    // ── 1. Evaluate all slots ──────────────────────────────────────────────────
    const newSlots = {}
    let initialCorrect = 0
    questions.forEach((q, i) => {
      const slot          = slots[i]
      const answer        = pool.find(a => a.id === slot?.answerId)
      const isRight       = !!answer && answer.isCorrectFor === i && answer.isCorrect
      const correctAnswer = pool.find(a => a.isCorrectFor === i && a.isCorrect)
      newSlots[i] = {
        ...slot,
        isCorrect:   isRight,
        status:      isRight ? 'correct' : 'incorrect',
        correctText: isRight ? '' : (correctAnswer?.text || ''),
      }
      if (isRight) initialCorrect++
    })

    setSlots(newSlots)
    setInitialCorrectCount(initialCorrect)

    // ── 2. All correct — immediate success, full celebrate ─────────────────────
    if (initialCorrect === questions.length) {
      setPhase(PHASE.SUCCESS)
      setXpTotal(questions.length * xpReward)
      setPandaMood('happy')
      setPandaMessage('All matched! 🎉')
      return
    }

    // ── 3. Failed — enter guided review flow ───────────────────────────────────
    setPhase(PHASE.FAILED)
    setPandaMood('oops')
    setPandaMessage(pickRandom(REVIEW_PANDA_MESSAGES))

    const incorrectIdxs = questions.map((_, i) => i).filter(i => !newSlots[i].isCorrect)

    // Step A — brief pause so user sees the red state, then start countdown
    const tA = setTimeout(() => {
      setPhase(PHASE.REVIEW_COUNTDOWN)
      setCountdown(COUNTDOWN_START)

      // Tick the countdown down: COUNTDOWN_START-1 … 1
      for (let tick = 1; tick < COUNTDOWN_START; tick++) {
        const tTick = setTimeout(() => {
          setCountdown(COUNTDOWN_START - tick)
        }, tick * COUNTDOWN_TICK)
        timersRef.current.push(tTick)
      }

      // Step B — countdown ends, begin cascade
      const tB = setTimeout(() => {
        setCountdown(null)
        setPhase(PHASE.REVIEWING)
        setPandaMessage(null) // panda goes silent; cascade is the focus

        incorrectIdxs.forEach((qIdx, seqIdx) => {
          // Animate this row into correcting state
          const tRow = setTimeout(() => {
            setSlots(prev => ({
              ...prev,
              [qIdx]: { ...prev[qIdx], status: 'correcting' },
            }))

            // Swap complete — lock in the correct answer
            const tRowDone = setTimeout(() => {
              setSlots(prev => ({
                ...prev,
                [qIdx]: {
                  ...prev[qIdx],
                  text:      prev[qIdx].correctText,
                  isCorrect: true,
                  status:    'corrected',
                },
              }))

              // Last row finished — enter REVIEW_COMPLETE
              if (seqIdx === incorrectIdxs.length - 1) {
                const tComplete = setTimeout(() => {
                  setPhase(PHASE.REVIEW_COMPLETE)
                  setPandaMood('idle')
                  setPandaMessage('Got it? Give it another shot 💪')
                }, REVIEW_COMPLETE_DELAY)
                timersRef.current.push(tComplete)
              }
            }, CASCADE_ROW_DURATION)
            timersRef.current.push(tRowDone)
          }, seqIdx * CASCADE_STAGGER)
          timersRef.current.push(tRow)
        })
      }, COUNTDOWN_START * COUNTDOWN_TICK)
      timersRef.current.push(tB)
    }, FAIL_PAUSE)
    timersRef.current.push(tA)
  }, [questions, slots, pool, xpReward])

  // ── Derived text ───────────────────────────────────────────────────────────
  let instrPrimary = null
  let instrSecondary = null

  switch (phase) {
    case PHASE.FILL:
      instrPrimary   = 'Match each word with its meaning'
      instrSecondary = 'Tap an answer — it fills the next row automatically'
      break
    case PHASE.FAILED:
      instrPrimary = "Let's review the correct answers"
      break
    case PHASE.REVIEW_COUNTDOWN:
      instrPrimary = "Let's review the correct answers"
      break
    case PHASE.REVIEWING:
      instrPrimary = 'Here are the correct answers'
      break
    case PHASE.REVIEW_COMPLETE:
      instrPrimary = 'Reviewed! Try matching again from the start.'
      break
    case PHASE.SUCCESS:
      instrPrimary = 'All matched!'
      break
    default:
      break
  }

  // During review show only what the user actually got right, not the corrected total
  const headerCurrent =
    phase === PHASE.FILL    ? filledCount
    : phase === PHASE.SUCCESS ? questions.length
    : initialCorrectCount

  return (
    <div className={styles.root} data-phase={phase}>
      <ExerciseHeader
        current={headerCurrent}
        total={questions.length}
        onQuit={onQuit}
      />

      <main className={styles.body}>
        {/* ── Top section ──────────────────────────────────────────────── */}
        <div className={styles.topSection}>
          <div className={styles.topRow}>
            <span className={styles.skillLabel}>
              <Sparkle weight="fill" size={12} aria-hidden="true" />
              Vocabulary
            </span>

            {/* XP badge: hidden in all review phases — no reward while reviewing */}
            {!inReview && (
              <span
                className={styles.xpBadge}
                data-state={phase === PHASE.SUCCESS ? 'earned' : 'available'}
              >
                <Lightning weight="fill" size={13} aria-hidden="true" />
                {phase === PHASE.SUCCESS ? `+${xpTotal} XP` : `+${totalPossibleXp} XP`}
              </span>
            )}
          </div>

          {instrPrimary && (
            <div className={styles.instructionBlock}>
              <p className={styles.instrPrimary} data-phase={inReview ? 'review' : undefined}>
                {instrPrimary}
              </p>
              {instrSecondary && <p className={styles.instrSecondary}>{instrSecondary}</p>}
            </div>
          )}

          <PandaGuide mood={pandaMood} message={pandaMessage} />
        </div>

        {/* ── 2-column exercise grid ───────────────────────────────────── */}
        <div className={styles.exerciseGrid}>

          {/* LEFT — problems (always visible) */}
          <div className={styles.leftColumn}>
            <p className={styles.colLabel} aria-hidden="true">Words</p>

            {/* Countdown status pill — above the rows, separate from panda */}
            {phase === PHASE.REVIEW_COUNTDOWN && (
              <div className={styles.countdownStatus} role="status" aria-live="polite">
                <HourglassIcon weight="fill" size={13} aria-hidden="true" />
                <span>Showing correct answers in</span>
                <span className={styles.countdownNum} key={countdown}>{countdown}</span>
              </div>
            )}

            <div className={styles.rowList} role="group" aria-label="Words to match">
              {questions.map((q, idx) => (
                <WordRow
                  key={idx}
                  word={parseWord(q.title)}
                  icon={q.icon}
                  slot={slots[idx]}
                  isNext={phase === PHASE.FILL && idx === nextEmptyIdx}
                  onSlotClick={() => handleSlotClick(idx)}
                  animDelay={`${idx * 90}ms`}
                  xpReward={xpReward}
                  inReview={inReview}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — answer bank: hidden during review and success */}
          {!inReview && phase !== PHASE.SUCCESS && (
            <section className={styles.rightColumn} aria-label="Answer bank">
              <p className={styles.colLabel} aria-hidden="true">Answer bank</p>
              <div className={styles.answerPool} role="group" aria-label="Available answers">
                {pool.map(answer => (
                  <AnswerChip
                    key={answer.id}
                    answer={answer}
                    chipState={phase !== PHASE.FILL || placedIds.has(answer.id) ? 'used' : 'idle'}
                    onClick={() => handleChipClick(answer.id)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        {phase === PHASE.SUCCESS ? (
          // Success: full green celebrate banner
          <div className={styles.completeBanner}>
            <div className={styles.completeContent}>
              <span className={styles.completeXp}>
                <Lightning weight="fill" size={14} aria-hidden="true" />
                +{xpTotal} XP
              </span>
              <p className={styles.completeTitle}>Section complete!</p>
            </div>
            <button
              className={styles.continueBtn}
              onClick={onComplete}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            >
              Continue
              <ArrowRight weight="bold" size={18} aria-hidden="true" />
            </button>
          </div>

        ) : phase === PHASE.FILL ? (
          // Fill: check button (disabled until all filled)
          <button
            className={styles.checkBtn}
            disabled={!allFilled}
            onClick={handleCheck}
          >
            Check answers
          </button>

        ) : phase === PHASE.REVIEW_COMPLETE ? (
          // Review complete: try again (primary) + continue (secondary)
          // No green, no XP — this is a retry prompt, not a reward
          <div className={styles.reviewFooter}>
            <button className={styles.tryAgainBtn} onClick={handleRetry}>
              <ArrowsClockwise weight="bold" size={16} aria-hidden="true" />
              Try again
            </button>
            <button className={styles.continueLightBtn} onClick={onComplete}>
              Continue learning
            </button>
          </div>

        ) : null /* FAILED / REVIEW_COUNTDOWN / REVIEWING — no action during automated sequence */}
      </div>
    </div>
  )
}
