import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  CheckIcon,
  XCircleIcon,
  ArrowRightIcon,
  LightningIcon,
  SparkleIcon,
  ArrowsClockwise,
  DotsSixVertical,
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import styles from './ReadingExercise.module.scss'

// ── Phase ──────────────────────────────────────────────────────────────────────
const PHASE = {
  IDLE:    'idle',    // < all slots filled
  READY:   'ready',   // all slots filled, check enabled
  SUCCESS: 'success', // all correct
  ERROR:   'error',   // some incorrect
}

const CORRECT_MSGS = [
  'Perfect order! 🎉',
  'Spot on! 🌟',
  "That's the right sequence!",
  'Nailed it! 🎯',
]

const ERROR_MSGS = [
  'Almost! Try again 🔁',
  'Not quite — reorder and retry',
  'Close! Rearrange and try again',
]

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

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

// ── SequenceSlot ───────────────────────────────────────────────────────────────
function SequenceSlot({
  number, card, isOver, isSelected, result, isDragging, phase,
  onDragOver, onDragLeave, onDrop, onClick, onCardDragStart, onCardDragEnd,
}) {
  const state = result ?? (card ? 'filled' : 'empty')
  return (
    <div
      className={styles.slot}
      data-state={state}
      data-over={isOver || undefined}
      data-selected={isSelected || undefined}
      style={{ '--slot-delay': `${(number - 1) * 90}ms` }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      role="listitem"
    >
      <span className={styles.slotNumber}>{number}</span>

      {card ? (
        <div
          className={styles.slotCard}
          draggable={phase !== PHASE.SUCCESS}
          data-dragging={isDragging || undefined}
          onDragStart={onCardDragStart}
          onDragEnd={onCardDragEnd}
        >
          <DotsSixVertical className={styles.dragHandle} weight="bold" size={14} aria-hidden="true" />
          <span className={styles.cardText}>{card.text}</span>
          {result === 'correct'   && <CheckIcon   className={styles.resultIcon} weight="bold" size={14} aria-hidden="true" />}
          {result === 'incorrect' && <XCircleIcon className={styles.resultIcon} weight="bold" size={14} aria-hidden="true" />}
        </div>
      ) : (
        <span className={styles.slotPlaceholder} data-over={isOver || undefined}>
          {isOver ? 'Drop here' : `Step ${number}`}
        </span>
      )}
    </div>
  )
}

// ── PoolCard ───────────────────────────────────────────────────────────────────
function PoolCard({ card, isDragging, isSelected, onDragStart, onDragEnd, onClick }) {
  return (
    <div
      className={styles.poolCard}
      data-dragging={isDragging || undefined}
      data-selected={isSelected || undefined}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onClick() : undefined}
    >
      <DotsSixVertical className={styles.dragHandle} weight="bold" size={14} aria-hidden="true" />
      <span className={styles.cardText}>{card.text}</span>
    </div>
  )
}

// ── FeedbackBanner ─────────────────────────────────────────────────────────────
function FeedbackBanner({ isCorrect, message, xpReward, description, onContinue, onRetry }) {
  return (
    <div className={styles.feedback} data-correct={isCorrect} role="status" aria-live="assertive">
      <div className={styles.feedbackBody}>
        <div className={styles.feedbackIcon} data-correct={isCorrect}>
          {isCorrect
            ? <CheckIcon  weight="bold" size={20} aria-hidden="true" />
            : <XCircleIcon weight="bold" size={20} aria-hidden="true" />
          }
        </div>
        <div>
          <p className={styles.feedbackTitle}>{message}</p>
          {isCorrect && (
            <span className={styles.feedbackXp} aria-label={`+${xpReward} XP earned`}>
              <LightningIcon weight="fill" size={12} aria-hidden="true" />
              +{xpReward} XP earned
            </span>
          )}
          {description && <p className={styles.feedbackDesc}>{description}</p>}
        </div>
      </div>

      {isCorrect ? (
        <button
          className={styles.continueBtn}
          onClick={onContinue}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        >
          Continue
          <ArrowRightIcon weight="bold" size={18} aria-hidden="true" />
        </button>
      ) : (
        <button className={styles.retryBtn} onClick={onRetry} autoFocus>
          <ArrowsClockwise weight="bold" size={16} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}

// ── ReadingExerciseView ────────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{ title?, items: [{id, text}], correct: [id, ...], description? }]
 *   xpReward   — XP per correct answer (default 15)
 *   onComplete — () => void  called after last question
 *   onQuit     — () => void  called when × is pressed
 */
export function ReadingExerciseView({
  exercises = [],
  xpReward  = 15,
  onComplete,
  onQuit,
}) {
  const [idx,         setIdx]        = useState(0)
  const [phase,       setPhase]      = useState(PHASE.IDLE)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const exercise = exercises[idx]
  const items    = useMemo(() => exercise?.items ?? [], [exercise])
  const total    = exercises.length

  const [slots,       setSlots]       = useState(() => Array(items.length).fill(null))
  const [slotResults, setSlotResults] = useState([])
  // selected: { cardId, from: 'pool'|'slot', slotIndex? } — tap-to-place selection
  const [selected, setSelected] = useState(null)
  const [dragging, setDragging] = useState(null) // cardId being dragged
  const [dragOver, setDragOver] = useState(null) // slot index | 'pool' | null

  // Drag source stored in a ref (avoids stale closure in drag handlers)
  const dragInfoRef = useRef(null)

  // Reset all interaction state on question change
  useEffect(() => {
    setSlots(Array(items.length).fill(null))
    setSlotResults([])
    setSelected(null)
    setDragging(null)
    setDragOver(null)
    setPhase(PHASE.IDLE)
  }, [idx, items.length])

  // ── Derived ─────────────────────────────────────────────────────────────────
  const pool      = useMemo(() => items.filter(item => !slots.includes(item.id)), [items, slots])
  const allFilled = slots.length > 0 && slots.every(id => id !== null)

  // ── Slot mutation — always clears check results ──────────────────────────────
  const commitSlots = useCallback(newSlots => {
    setSlots(newSlots)
    setSlotResults([])
    const filled = newSlots.every(id => id !== null)
    setPhase(filled ? PHASE.READY : PHASE.IDLE)
  }, [])

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const handleDragStart = useCallback((e, cardId, from, slotIndex) => {
    e.dataTransfer.effectAllowed = 'move'
    dragInfoRef.current = { cardId, from, slotIndex }
    setDragging(cardId)
    setSelected(null) // clear tap-selection on drag start
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragging(null)
    setDragOver(null)
    dragInfoRef.current = null
  }, [])

  const handleDropOnSlot = useCallback((e, targetSlotIndex) => {
    e.preventDefault()
    const info = dragInfoRef.current
    if (!info) return

    const newSlots = [...slots]
    if (info.from === 'pool') {
      newSlots[targetSlotIndex] = info.cardId
    } else {
      // Slot-to-slot swap
      const displaced = newSlots[targetSlotIndex]
      newSlots[targetSlotIndex] = info.cardId
      newSlots[info.slotIndex]  = displaced
    }
    commitSlots(newSlots)
    handleDragEnd()
  }, [slots, commitSlots, handleDragEnd])

  const handleDropOnPool = useCallback(e => {
    e.preventDefault()
    const info = dragInfoRef.current
    if (!info || info.from !== 'slot') return

    const newSlots = [...slots]
    newSlots[info.slotIndex] = null
    commitSlots(newSlots)
    handleDragEnd()
  }, [slots, commitSlots, handleDragEnd])

  // ── Tap / click handlers (touch & keyboard fallback) ─────────────────────────
  const handlePoolCardClick = useCallback(cardId => {
    if (phase === PHASE.SUCCESS) return
    setSelected(prev =>
      prev?.cardId === cardId && prev.from === 'pool'
        ? null
        : { cardId, from: 'pool' }
    )
  }, [phase])

  const handleSlotClick = useCallback(slotIndex => {
    if (phase === PHASE.SUCCESS) return
    const slotCardId = slots[slotIndex]

    if (selected) {
      const newSlots = [...slots]
      if (selected.from === 'pool') {
        newSlots[slotIndex] = selected.cardId
        // displaced slot card returns to pool automatically (derived)
      } else {
        // Slot-to-slot swap via tap
        newSlots[slotIndex]          = selected.cardId
        newSlots[selected.slotIndex] = slotCardId
      }
      commitSlots(newSlots)
      setSelected(null)
    } else if (slotCardId) {
      // Select filled slot card for moving
      setSelected({ cardId: slotCardId, from: 'slot', slotIndex })
    }
  }, [phase, selected, slots, commitSlots])

  // ── Check answer ─────────────────────────────────────────────────────────────
  const handleCheck = useCallback(() => {
    if (!allFilled || !exercise) return
    const results = exercise.correct.map((correctId, i) =>
      slots[i] === correctId ? 'correct' : 'incorrect'
    )
    setSlotResults(results)
    const allCorrect = results.every(r => r === 'correct')
    setFeedbackMsg(allCorrect ? pickRandom(CORRECT_MSGS) : pickRandom(ERROR_MSGS))
    setPhase(allCorrect ? PHASE.SUCCESS : PHASE.ERROR)
  }, [allFilled, exercise, slots])

  const handleRetry = useCallback(() => {
    setSlotResults([])
    setPhase(PHASE.READY) // cards stay in slots, colors clear
  }, [])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) {
      onComplete?.()
    } else {
      setIdx(i => i + 1)
      setFeedbackMsg('')
    }
  }, [idx, total, onComplete])

  if (!exercise) return null

  // ── Panda ────────────────────────────────────────────────────────────────────
  const pandaMood    = phase === PHASE.SUCCESS ? 'happy' : phase === PHASE.ERROR ? 'oops' : 'idle'
  const pandaMessage = phase === PHASE.SUCCESS ? feedbackMsg
    : phase === PHASE.ERROR   ? 'Almost! Try again 🔁'
    : 'Build the correct order 👇'

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>
        {/* ── Skill label + XP ─────────────────────────────────────── */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <SparkleIcon weight="fill" size={12} aria-hidden="true" />
            Reading
          </span>
          <span className={styles.xpBadge} aria-label={`+${xpReward} XP per correct answer`}>
            <LightningIcon weight="fill" size={13} aria-hidden="true" />
            +{xpReward} XP
          </span>
        </div>

        {/* ── Instruction ───────────────────────────────────────────── */}
        <p className={styles.instruction}>Drag to build the correct sequence</p>

        {/* ── Panda ─────────────────────────────────────────────────── */}
        <PandaGuide mood={pandaMood} message={pandaMessage} />

        {/* ── Optional question title ───────────────────────────────── */}
        {exercise.title && (
          <p className={styles.question}>{exercise.title}</p>
        )}

        {/* ── Sequence area (drop slots) ────────────────────────────── */}
        <section className={styles.sequenceArea} aria-label="Your sequence">
          <h2 className={styles.areaLabel}>
            <span>Your sequence</span>
            <span className={styles.areaCount}>
              {slots.filter(Boolean).length}/{slots.length}
            </span>
          </h2>
          <div className={styles.slots} role="list">
            {slots.map((cardId, i) => {
              const card = items.find(item => item.id === cardId) ?? null
              return (
                <SequenceSlot
                  key={i}
                  number={i + 1}
                  card={card}
                  isOver={dragOver === i}
                  isSelected={selected?.from === 'slot' && selected?.slotIndex === i}
                  result={slotResults[i] ?? null}
                  isDragging={card ? dragging === card.id : false}
                  phase={phase}
                  onDragOver={e => { e.preventDefault(); setDragOver(i) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDropOnSlot(e, i)}
                  onClick={() => handleSlotClick(i)}
                  onCardDragStart={card ? e => handleDragStart(e, card.id, 'slot', i) : undefined}
                  onCardDragEnd={handleDragEnd}
                />
              )
            })}
          </div>
        </section>

        {/* ── Pool area (available steps) ───────────────────────────── */}
        <section
          className={styles.poolArea}
          aria-label="Available steps"
          data-over={dragOver === 'pool' || undefined}
          onDragOver={e => { e.preventDefault(); setDragOver('pool') }}
          onDragLeave={() => setDragOver(null)}
          onDrop={handleDropOnPool}
        >
          <h2 className={styles.areaLabel}>Available steps</h2>
          <div className={styles.pool}>
            {pool.length === 0 ? (
              <p className={styles.poolEmpty}>
                <CheckIcon weight="bold" size={14} aria-hidden="true" />
                All steps placed
              </p>
            ) : (
              pool.map(item => (
                <PoolCard
                  key={item.id}
                  card={item}
                  isDragging={dragging === item.id}
                  isSelected={selected?.cardId === item.id && selected.from === 'pool'}
                  onDragStart={e => handleDragStart(e, item.id, 'pool')}
                  onDragEnd={handleDragEnd}
                  onClick={() => handlePoolCardClick(item.id)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        {phase !== PHASE.SUCCESS && phase !== PHASE.ERROR ? (
          <button
            className={styles.checkBtn}
            disabled={!allFilled}
            onClick={handleCheck}
          >
            Check answer
          </button>
        ) : (
          <FeedbackBanner
            isCorrect={phase === PHASE.SUCCESS}
            message={feedbackMsg}
            xpReward={xpReward}
            description={exercise.description}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  )
}
