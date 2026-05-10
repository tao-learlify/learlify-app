import React, { useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import {
  X,
  Check,
  XCircle,
  ArrowRight,
  Lightning,
  Sparkle,
  LightningIcon,
  CheckIcon,
  XCircleIcon,
  ArrowRightIcon,
  SparkleIcon
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda.svg'
import styles from './GrammarExercise.module.scss'

// ── Phase constants ────────────────────────────────────────────────────────────
const PHASE = {
  IDLE: 'idle', // no option selected
  SELECTED: 'selected', // option chosen, awaiting check
  CHECKED: 'checked' // answer submitted, feedback visible
}

// ── Feedback message system ────────────────────────────────────────────────────
const BASE_MESSAGES = [
  'Nice one!',
  'Great job!',
  'Well done!',
  'You got it!',
  "That's correct!",
  'Keep it up!',
  'Solid answer!',
  'Perfect!',
  'On point!',
  "You're doing great!"
]

// Shown when the user has 3+ consecutive correct answers
const STREAK_MESSAGES = [
  "🔥 You're on fire!",
  'Unstoppable!',
  "You're crushing it!",
  '🚀 On a roll!',
  'Incredible streak!'
]

// Supportive — not punishing, gently redirecting
const ERROR_MESSAGES = [
  'Almost there!',
  'Not quite right',
  'Good try!',
  'Close one!',
  "Let's try again",
  "You're getting there",
  'Nearly got it!',
]

function pickErrorMessage() {
  return pickRandom(ERROR_MESSAGES)
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickFeedbackMessage(streak) {
  // After 3+ in a row, 40% chance to celebrate the streak
  if (streak >= 3 && Math.random() < 0.4) {
    return pickRandom(STREAK_MESSAGES)
  }
  return pickRandom(BASE_MESSAGES)
}

// ── Data helpers ───────────────────────────────────────────────────────────────

/**
 * Strip the leading letter prefix from answer options.
 * "A. often"  →  "often"
 * "B.twice a week"  →  "twice a week"
 */
function stripAnswerPrefix(str) {
  return str.replace(/^[A-Za-z]\.\s*/, '').trim()
}

/**
 * Strip the leading question number from the title.
 * "1.We see each other {x}."  →  "We see each other {x}."
 * " 5.I couldn't sleep {x}"  →  "I couldn't sleep {x}"
 */
function stripQuestionNumber(str) {
  return str.replace(/^\s*\d+\.\s*/, '').trim()
}

/**
 * Split the title on {x} into [before, after].
 * Titles without {x} return [title, ''].
 */
function parseSentence(title) {
  const clean = stripQuestionNumber(title)
  const [before, after = ''] = clean.split('{x}')
  return { before, after }
}

/**
 * Normalize description — treat "None" / empty as null.
 */
function normalizeDesc(desc) {
  if (!desc || desc.trim().toLowerCase() === 'none') return null
  return desc.trim()
}

// ── GapSlot ───────────────────────────────────────────────────────────────────
function GapSlot({ text, phase, isCorrect }) {
  let state = 'empty'
  if (text && phase === PHASE.SELECTED) state = 'filled'
  if (text && phase === PHASE.CHECKED)
    state = isCorrect ? 'correct' : 'incorrect'

  return (
    <span
      className={styles.gap}
      data-state={state}
      aria-label={text ? `Selected: ${text}` : 'blank'}
    >
      {/* non-breaking spaces keep the slot wide when empty */}
      {text ?? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </span>
  )
}

// ── SentenceWithGap ───────────────────────────────────────────────────────────
export function SentenceWithGap({ title, selectedText, phase, isCorrect }) {
  const { before, after } = useMemo(() => parseSentence(title), [title])

  return (
    <p
      className={styles.sentence}
      aria-label={title
        .replace(/^\s*\d+\.\s*/, '')
        .replace('{x}', selectedText ?? 'blank')}
    >
      {before}
      <GapSlot text={selectedText} phase={phase} isCorrect={isCorrect} />
      {after}
    </p>
  )
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

// ── AnswerOptionCard ──────────────────────────────────────────────────────────
export function AnswerOptionCard({
  answer,
  letter,
  isSelected,
  isChecked,
  isCorrectOption,
  onSelect
}) {
  let state = 'idle'
  if (isSelected && !isChecked) state = 'selected'
  if (isChecked && isCorrectOption) state = 'correct'
  if (isChecked && isSelected && !isCorrectOption) state = 'incorrect'

  return (
    <button
      className={styles.option}
      data-state={state}
      disabled={isChecked}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={[
        answer,
        isChecked && isCorrectOption ? '(correct answer)' : '',
        isChecked && isSelected && !isCorrectOption
          ? '(your answer, incorrect)'
          : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.optionLetter} aria-hidden="true">
        {isChecked && isCorrectOption ? (
          <Check weight="bold" size={14} />
        ) : null}
        {isChecked && isSelected && !isCorrectOption ? (
          <XCircle weight="bold" size={14} />
        ) : null}
        {!isChecked ? letter : null}
      </span>
      <span className={styles.optionText}>{answer}</span>
    </button>
  )
}

// ── AnswerOptionList ──────────────────────────────────────────────────────────
export function AnswerOptionList({
  answers,
  selectedIdx,
  phase,
  correctIdx,
  onSelect
}) {
  return (
    <div className={styles.options} role="group" aria-label="Answer choices">
      {answers.map((raw, idx) => (
        <AnswerOptionCard
          key={idx}
          answer={stripAnswerPrefix(raw)}
          letter={LETTERS[idx] ?? String(idx + 1)}
          isSelected={selectedIdx === idx}
          isChecked={phase === PHASE.CHECKED}
          isCorrectOption={correctIdx === idx}
          onSelect={() => onSelect(idx)}
        />
      ))}
    </div>
  )
}

// ── ExerciseHeader ────────────────────────────────────────────────────────────
export function ExerciseHeader({ current, total, onQuit }) {
  const pct = Math.round((current / total) * 100)

  return (
    <header className={styles.header}>
      <button
        className={styles.quitBtn}
        onClick={onQuit}
        aria-label="Exit exercise"
      >
        <X weight="bold" size={20} />
      </button>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>

      <span className={styles.counter} aria-live="polite">
        {current} / {total}
      </span>
    </header>
  )
}

// ── FeedbackBanner ────────────────────────────────────────────────────────────
export function FeedbackBanner({
  isCorrect,
  correctAnswer,
  description,
  xpReward,
  message,
  onContinue
}) {
  const desc = normalizeDesc(description)

  return (
    <div
      className={styles.feedback}
      data-correct={isCorrect}
      role="status"
      aria-live="assertive"
    >
      <div className={styles.feedbackBody}>
        <div className={styles.feedbackIcon} data-correct={isCorrect}>
          {isCorrect ? (
            <CheckIcon weight="bold" size={20} aria-hidden="true" />
          ) : (
            <XCircleIcon weight="bold" size={20} aria-hidden="true" />
          )}
        </div>

        <div>
          <p className={styles.feedbackTitle}>{message}</p>
          {isCorrect && (
            <span
              className={styles.feedbackXp}
              aria-label={`+${xpReward} XP earned`}
            >
              <LightningIcon weight="fill" size={12} aria-hidden="true" />
              +{xpReward} XP earned
            </span>
          )}
          {desc && <p className={styles.feedbackDesc}>{desc}</p>}
        </div>
      </div>

      <button
        className={styles.continueBtn}
        data-correct={isCorrect}
        onClick={onContinue}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      >
        Continue
        <ArrowRightIcon weight="bold" size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

// ── GrammarExerciseView ───────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — array of exercise objects from the JSON schema
 *                (filtered to label === 'Grammar' or category === 'Grammar & Vocabulary')
 *   onComplete — () => void   called when last question is answered
 *   onQuit     — () => void   called when × is pressed
 */
export function GrammarExerciseView({
  exercises = [],
  xpReward = 10,
  onComplete,
  onQuit,
  onAnswer,
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null) // 0-based index into answers[]
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [streak, setStreak] = useState(0) // consecutive correct answers
  const [feedbackMsg, setFeedbackMsg] = useState('') // frozen at check time

  const exercise = exercises[idx]
  const total = exercises.length

  const isCorrect = selected === exercise?.correct
  const selectedText =
    selected != null ? stripAnswerPrefix(exercise.answers[selected]) : null
  const correctText = exercise
    ? stripAnswerPrefix(exercise.answers[exercise.correct])
    : ''

  const handleSelect = useCallback(
    answerIdx => {
      if (phase === PHASE.CHECKED) return
      setSelected(answerIdx)
      setPhase(PHASE.SELECTED)
    },
    [phase]
  )

  const handleCheck = useCallback(() => {
    const correct   = selected === exercise?.correct
    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    // Freeze both correct and incorrect messages at check time
    setFeedbackMsg(
      correct ? pickFeedbackMessage(newStreak) : pickErrorMessage()
    )
    setPhase(PHASE.CHECKED)
  }, [selected, exercise, streak])

  const handleContinue = useCallback(() => {
    onAnswer?.()
    if (idx + 1 >= total) {
      onComplete?.()
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setFeedbackMsg('')
      setPhase(PHASE.IDLE)
    }
  }, [idx, total, onComplete, onAnswer])

  if (!exercise) return null

  const pandaMood =
    phase === PHASE.CHECKED ? (isCorrect ? 'happy' : 'oops') : 'idle'

  const pandaMoodClass = {
    idle: styles.pandaIdle,
    happy: styles.pandaHappy,
    oops: styles.pandaOops
  }[pandaMood]

  const speechText = {
    happy: 'Great work! 🎉',
    oops: 'Keep going! 💪'
  }[pandaMood]

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>
        <span className={styles.skillLabel}>
          <SparkleIcon weight="fill" size={12} aria-hidden="true" />
          {exercise.label ?? 'Grammar'}
        </span>

        <div className={styles.metaRow}>
          <span
            className={styles.xpBadge}
            aria-label={`+${xpReward} XP per correct answer`}
          >
            <LightningIcon weight="fill" size={13} aria-hidden="true" />+
            {xpReward} XP
          </span>
          <span className={styles.instruction}>
            Pick the best answer to complete the sentence
          </span>
        </div>

        <div className={styles.pandaWrapper}>
          {speechText && (
            <div className={styles.speechBubble} data-mood={pandaMood}>
              {speechText}
            </div>
          )}
          <img
            src={pandaImg}
            alt=""
            aria-hidden="true"
            className={clsx(styles.pandaDecor, pandaMoodClass)}
          />
        </div>

        <SentenceWithGap
          title={exercise.title}
          selectedText={phase !== PHASE.IDLE ? selectedText : null}
          phase={phase}
          isCorrect={isCorrect}
        />

        <AnswerOptionList
          answers={exercise.answers}
          selectedIdx={selected}
          phase={phase}
          correctIdx={exercise.correct}
          onSelect={handleSelect}
        />
      </main>

      <div className={styles.footer}>
        {phase !== PHASE.CHECKED ? (
          <button
            className={clsx(styles.checkBtn)}
            disabled={phase === PHASE.IDLE}
            onClick={handleCheck}
          >
            Check answer
          </button>
        ) : (
          <FeedbackBanner
            isCorrect={isCorrect}
            correctAnswer={correctText}
            description={exercise.description}
            xpReward={xpReward}
            message={feedbackMsg}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}
