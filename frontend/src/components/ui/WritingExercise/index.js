import React, { useState, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  PencilSimpleIcon,
  EnvelopeIcon,
  TimerIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LightningIcon,
  SparkleIcon,
  WarningIcon
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import styles from './WritingExercise.module.scss'

// ── Phase machine ─────────────────────────────────────────────────────────────
//  WRITING → (both tasks at min words) → (submit) → SUBMITTED
const PHASE = {
  WRITING: 'writing',
  SUBMITTED: 'submitted'
}

const TIMER_DURATION = 20 * 60 // 20 minutes

// ── Utilities ─────────────────────────────────────────────────────────────────
function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function fmtTime(totalSec) {
  const m = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function getWordStatus(count, task) {
  const { minWords, targetWords, maxWords } = task
  if (count === 0) return 'empty'
  if (count < Math.round(minWords * 0.5)) return 'starting'
  if (count < minWords) return 'building'
  if (count < targetWords) return 'almost'
  if (count <= maxWords) return 'great'
  return 'over'
}

function getWordFill(count, task) {
  return Math.min(100, Math.round((count / task.targetWords) * 100))
}

// ── PandaGuide ────────────────────────────────────────────────────────────────
function PandaGuide({ message, mood = 'idle' }) {
  if (!message) return null
  return (
    <div className={styles.pandaRow}>
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        className={styles.pandaImg}
      />
      <div
        className={styles.pandaBubble}
        data-mood={mood}
        role="status"
        key={message}
      >
        {message}
      </div>
    </div>
  )
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function Timer({ seconds }) {
  const urgent = seconds < 60
  const warning = seconds < 3 * 60
  return (
    <div
      className={clsx(styles.timer, {
        [styles.timerWarning]: warning && !urgent,
        [styles.timerUrgent]: urgent
      })}
      aria-live="off"
      aria-label={`Time remaining: ${fmtTime(seconds)}`}
    >
      <TimerIcon size={13} weight="fill" aria-hidden="true" />
      {fmtTime(seconds)}
    </div>
  )
}

// ── ContextCard ───────────────────────────────────────────────────────────────
function ContextCard({ context }) {
  return (
    <div className={styles.contextCard}>
      <div className={styles.contextHeader}>
        <div className={styles.contextIcon}>
          <EnvelopeIcon weight="fill" size={16} aria-hidden="true" />
        </div>
        <div className={styles.contextMeta}>
          <span className={styles.contextLabel}>Writing situation</span>
          {context.subject && (
            <span className={styles.contextSubject}>{context.subject}</span>
          )}
        </div>
      </div>
      <p className={styles.contextBody}>{context.scenario}</p>
    </div>
  )
}

// ── WordBar ───────────────────────────────────────────────────────────────────
function WordBar({ count, task }) {
  const fill = getWordFill(count, task)
  const status = getWordStatus(count, task)

  const hint = {
    empty: '',
    starting: 'Just getting started…',
    building: `${task.minWords - count} more to reach minimum`,
    almost: `${task.targetWords - count} more to hit target`,
    great: 'Great length ✓',
    over: `${count - task.maxWords} over the limit`
  }[status]

  return (
    <div className={styles.wordBarWrap}>
      <div className={styles.wordBarTrack}>
        <div
          className={styles.wordBarFill}
          data-status={status}
          style={{ width: `${fill}%` }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={task.targetWords}
          aria-label={`${count} of ${task.targetWords} words`}
        />
      </div>
      <div className={styles.wordBarLabels}>
        <span className={styles.wordCount} data-status={status}>
          {count}{' '}
          <span className={styles.wordTarget}>/ {task.targetWords} words</span>
        </span>
        {hint && (
          <span className={styles.wordHint} data-status={status}>
            {hint}
          </span>
        )}
      </div>
    </div>
  )
}

// ── HintChip ──────────────────────────────────────────────────────────────────
function HintChip({ text, type = 'tip' }) {
  return (
    <div className={styles.hintChip} data-type={type}>
      {type === 'warning' && (
        <WarningIcon weight="fill" size={13} aria-hidden="true" />
      )}
      {type === 'tip' && (
        <SparkleIcon weight="fill" size={13} aria-hidden="true" />
      )}
      {type === 'check' && (
        <CheckCircleIcon weight="fill" size={13} aria-hidden="true" />
      )}
      {text}
    </div>
  )
}

// ── TaskEditor ────────────────────────────────────────────────────────────────
function TaskEditor({ task, value, onChange }) {
  const wordCount = countWords(value)
  const status = getWordStatus(wordCount, task)

  return (
    <div className={styles.taskEditor}>
      {/* Task header */}
      <div className={styles.taskHeader}>
        <div className={styles.taskLabelGroup}>
          <span className={styles.taskLabel}>{task.label}</span>
          <span className={styles.taskType}>{task.type}</span>
        </div>
        <span className={styles.taskWordTarget}>
          {task.minWords}–{task.maxWords} words
        </span>
      </div>

      {/* Instruction */}
      <p className={styles.taskInstruction}>{task.instruction}</p>

      {/* Textarea */}
      <div className={styles.editorWrap} data-status={status}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={task.placeholder}
          spellCheck
          aria-label={`${task.label}: ${task.type}`}
        />
      </div>

      {/* Live word counter */}
      <WordBar count={wordCount} task={task} />
    </div>
  )
}

// ── SubmittedState ────────────────────────────────────────────────────────────
function SubmittedState({ answers, onContinue }) {
  const totalWords = answers.reduce((sum, a) => sum + countWords(a), 0)

  return (
    <div className={styles.submittedWrap}>
      {/* Checkmark icon */}
      <div className={styles.submittedIcon} aria-hidden="true">
        <CheckCircleIcon weight="fill" size={36} />
      </div>

      <h2 className={styles.submittedTitle}>Writing submitted!</h2>
      <p className={styles.submittedSub}>
        You wrote <strong>{totalWords} words</strong> across both tasks.
      </p>

      {/* Review status stepper */}
      <div className={styles.stepper} role="list" aria-label="Review progress">
        <div className={styles.step} role="listitem">
          <div className={styles.stepDot} data-done="true">
            <CheckCircleIcon weight="fill" size={13} aria-hidden="true" />
          </div>
          <span className={clsx(styles.stepLabel, styles.stepLabelDone)}>
            Submitted
          </span>
        </div>
        <div className={styles.stepLine} aria-hidden="true" />
        <div className={styles.step} role="listitem">
          <div className={styles.stepDot} data-active="true">
            <span className={styles.stepPulse} aria-hidden="true" />
          </div>
          <span className={clsx(styles.stepLabel, styles.stepLabelActive)}>
            AI Check
          </span>
        </div>
        <div className={styles.stepLine} aria-hidden="true" />
        <div className={styles.step} role="listitem">
          <div className={styles.stepDot} />
          <span className={styles.stepLabel}>Teacher Review</span>
        </div>
      </div>

      {/* What happens next */}
      <div className={styles.submittedMsg}>
        <p className={styles.submittedMsgTitle}>
          Your teacher will review your writing
        </p>
        <p className={styles.submittedMsgSub}>
          Our AI will first check for grammar and vocabulary. Then a certified
          teacher will give you personalised feedback on your style, structure,
          and register.
        </p>
      </div>

      <button className={styles.continueBtn} onClick={onContinue}>
        Continue
        <ArrowRightIcon weight="bold" size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

// ── WritingExerciseView ───────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{ context, tasks: [{ label, type, instruction, minWords,
 *                 targetWords, maxWords, placeholder, hints }] }]
 *   xpReward   — XP total (default 30)
 *   onComplete — () => void
 *   onQuit     — () => void
 */
export function WritingExerciseView({
  exercises = [],
  xpReward = 30,
  onComplete,
  onQuit
}) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState(PHASE.WRITING)
  const [activeTask, setActiveTask] = useState(0)
  const [answers, setAnswers] = useState(['', ''])
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const timerRef = useRef(null)

  const exercise = exercises[idx]
  const total = exercises.length

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.WRITING) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, idx])

  // ── Reset on exercise change ─────────────────────────────────────────────────
  useEffect(() => {
    setPhase(PHASE.WRITING)
    setActiveTask(0)
    setAnswers(['', ''])
    setTimeLeft(TIMER_DURATION)
    clearInterval(timerRef.current)
  }, [idx])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((taskIdx, value) => {
    setAnswers(prev => {
      const next = [...prev]
      next[taskIdx] = value
      return next
    })
  }, [])

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase(PHASE.SUBMITTED)
  }, [])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) onComplete?.()
    else setIdx(i => i + 1)
  }, [idx, total, onComplete])

  if (!exercise) return null

  // ── Derived values ──────────────────────────────────────────────────────────
  const tasks = exercise.tasks
  const t1Count = countWords(answers[0])
  const t2Count = countWords(answers[1])
  const t1Done = t1Count >= tasks[0].minWords
  const t2Done = t2Count >= tasks[1].minWords
  const bothDone = t1Done && t2Done
  const doneSoFar = (t1Done ? 1 : 0) + (t2Done ? 1 : 0)

  const pandaMessage =
    phase === PHASE.SUBMITTED
      ? 'Brilliant work! 🌟 Your teacher will review this soon.'
      : activeTask === 0 && t1Count === 0
        ? "Write naturally — don't overthink it! ✍️"
        : activeTask === 0 && t1Done
          ? 'Task 1 done! Now tackle the formal version 📋'
          : activeTask === 0
            ? `Keep going — ${tasks[0].minWords - t1Count} more words!`
            : activeTask === 1 && t2Count === 0
              ? 'Use formal language and full sentences 🎓'
              : activeTask === 1 && t2Done
                ? 'Both tasks done! Give it a final read 👀'
                : `Great progress — ${tasks[1].minWords - t2Count} more words!`

  const pandaMood = phase === PHASE.SUBMITTED || bothDone ? 'happy' : 'idle'

  // ── Submitted view ──────────────────────────────────────────────────────────
  if (phase === PHASE.SUBMITTED) {
    return (
      <div className={styles.root}>
        <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />
        <main className={styles.body}>
          <PandaGuide message={pandaMessage} mood={pandaMood} />
          <SubmittedState answers={answers} onContinue={handleContinue} />
        </main>
      </div>
    )
  }

  // ── Writing view ────────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>
        {/* ── Top row: skill label + XP + timer ──────────────────────── */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <PencilSimpleIcon weight="fill" size={12} aria-hidden="true" />
            Writing
          </span>
          <div className={styles.topRowRight}>
            <span className={styles.xpBadge}>
              <LightningIcon weight="fill" size={13} aria-hidden="true" />+
              {xpReward} XP
            </span>
            <Timer seconds={timeLeft} />
          </div>
        </div>

        {/* ── Panda guide ─────────────────────────────────────────────── */}
        <PandaGuide message={pandaMessage} mood={pandaMood} />

        {/* ── Context card ────────────────────────────────────────────── */}
        <ContextCard context={exercise.context} />

        {/* ── Task tabs ───────────────────────────────────────────────── */}
        <div
          className={styles.taskTabs}
          role="tablist"
          aria-label="Writing tasks"
        >
          {tasks.map((task, i) => {
            const wc = countWords(answers[i])
            const done = wc >= task.minWords
            return (
              <button
                key={i}
                role="tab"
                aria-selected={activeTask === i}
                className={clsx(styles.taskTab, {
                  [styles.taskTabActive]: activeTask === i,
                  [styles.taskTabDone]: done
                })}
                onClick={() => setActiveTask(i)}
              >
                {done && (
                  <CheckCircleIcon weight="fill" size={13} aria-hidden="true" />
                )}
                {task.label}
                <span className={styles.tabWordCount}>{wc}w</span>
              </button>
            )
          })}
        </div>

        {/* ── Active task editor ──────────────────────────────────────── */}
        <TaskEditor
          key={activeTask}
          task={tasks[activeTask]}
          value={answers[activeTask]}
          onChange={v => handleAnswer(activeTask, v)}
        />

        {/* ── Task completion summary strip ───────────────────────────── */}
        <div className={styles.taskSummary}>
          <div
            className={clsx(styles.taskPip, { [styles.taskPipDone]: t1Done })}
          >
            {t1Done ? '✓' : '1'}
          </div>
          <div className={styles.taskPipLine} aria-hidden="true" />
          <div
            className={clsx(styles.taskPip, { [styles.taskPipDone]: t2Done })}
          >
            {t2Done ? '✓' : '2'}
          </div>
          <span className={styles.taskSummaryText}>
            {doneSoFar === 0 && 'Complete both tasks to continue'}
            {doneSoFar === 1 && 'One down — complete the other task!'}
            {doneSoFar === 2 && 'Both tasks complete — ready to submit! 🎉'}
          </span>
        </div>
      </main>

      {/* ── Footer CTA ──────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        <button
          className={clsx(styles.submitBtn, {
            [styles.submitBtnReady]: bothDone
          })}
          onClick={handleSubmit}
          disabled={!bothDone}
          aria-label={
            bothDone ? 'Review my answer' : 'Complete both tasks to continue'
          }
        >
          {bothDone ? 'Review my answer' : 'Complete both tasks first'}
          {bothDone && (
            <ArrowRightIcon weight="bold" size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}
