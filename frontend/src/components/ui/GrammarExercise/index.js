import React, { useState, useCallback, useMemo, useEffect } from 'react'
import clsx from 'clsx'
import {
  X, Check, XCircle, ArrowRight, Lightning, Sparkle,
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda.svg'
import styles from './GrammarExercise.module.scss'

const PHASE = { IDLE: 'idle', SELECTED: 'selected', CHECKED: 'checked' }

const BASE_MESSAGES = [
  'Nice one!', 'Great job!', 'Well done!', 'You got it!',
  "That's correct!", 'Keep it up!', 'Solid answer!', 'Perfect!',
  'On point!', "You're doing great!",
]
const STREAK_MESSAGES = [
  "🔥 You're on fire!", 'Unstoppable!', "You're crushing it!",
  '🚀 On a roll!', 'Incredible streak!',
]
const ERROR_MESSAGES = [
  'Almost there!', 'Not quite right', 'Good try!', 'Close one!',
  "Let's try again", "You're getting there", 'Nearly got it!',
]
const LETTERS = ['A', 'B', 'C', 'D', 'E']

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pickErrorMessage() { return pickRandom(ERROR_MESSAGES) }
function pickFeedbackMessage(streak) {
  if (streak >= 3 && Math.random() < 0.4) return pickRandom(STREAK_MESSAGES)
  return pickRandom(BASE_MESSAGES)
}
function stripAnswerPrefix(str) { return (str || '').replace(/^[A-Za-z]\.\s*/, '').trim() }
function stripQuestionNumber(str) { return (str || '').replace(/^\s*\d+\.\s*/, '').trim() }
function parseSentence(title) {
  const clean = stripQuestionNumber(title)
  const [before, after = ''] = clean.split('{x}')
  return { before, after }
}
function normalizeDesc(desc) {
  if (!desc || desc.trim().toLowerCase() === 'none') return null
  return desc.trim()
}

// ── Shared sub-components ────────────────────────────────────────────────────

function GapSlot({ text, phase, isCorrect, small }) {
  let state = 'empty'
  if (text && phase === PHASE.SELECTED) state = 'filled'
  if (text && phase === PHASE.CHECKED) state = isCorrect ? 'correct' : 'incorrect'
  return (
    <span className={clsx(styles.gap, small && styles.gapSmall)} data-state={state}
      aria-label={text ? `Selected: ${text}` : 'blank'}>
      {text ?? '\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </span>
  )
}

export function SentenceWithGap({ title, selectedText, phase, isCorrect, small }) {
  const { before, after } = useMemo(() => parseSentence(title), [title])
  return (
    <p className={clsx(styles.sentence, small && styles.sentenceSmall)}
      aria-label={stripQuestionNumber(title).replace('{x}', selectedText ?? 'blank')}>
      {before}
      <GapSlot text={selectedText} phase={phase} isCorrect={isCorrect} small={small} />
      {after}
    </p>
  )
}

export function AnswerOptionCard({ answer, letter, isSelected, isChecked, isCorrectOption, onSelect, small }) {
  let state = 'idle'
  if (isSelected && !isChecked) state = 'selected'
  if (isChecked && isCorrectOption) state = 'correct'
  if (isChecked && isSelected && !isCorrectOption) state = 'incorrect'
  return (
    <button className={clsx(styles.option, small && styles.optionSmall)} data-state={state}
      disabled={isChecked} onClick={onSelect} aria-pressed={isSelected}
      aria-label={[answer, isChecked && isCorrectOption ? '(correct answer)' : '',
        isChecked && isSelected && !isCorrectOption ? '(your answer, incorrect)' : ''].filter(Boolean).join(' ')}>
      <span className={styles.optionLetter} aria-hidden="true">
        {isChecked && isCorrectOption ? <Check weight="bold" size={small ? 12 : 14} /> : null}
        {isChecked && isSelected && !isCorrectOption ? <XCircle weight="bold" size={small ? 12 : 14} /> : null}
        {!isChecked ? letter : null}
      </span>
      <span className={styles.optionText}>{answer}</span>
    </button>
  )
}

export function AnswerOptionList({ answers, selectedIdx, phase, correctIdx, onSelect }) {
  return (
    <div className={styles.options} role="group" aria-label="Answer choices">
      {answers.map((raw, idx) => (
        <AnswerOptionCard key={idx} answer={stripAnswerPrefix(raw)}
          letter={LETTERS[idx] ?? String(idx + 1)} isSelected={selectedIdx === idx}
          isChecked={phase === PHASE.CHECKED} isCorrectOption={correctIdx === idx}
          onSelect={() => onSelect(idx)} />
      ))}
    </div>
  )
}

export function ExerciseHeader({ current, total, onQuit }) {
  const pct = Math.round((current / total) * 100)
  return (
    <header className={styles.header}>
      <button className={styles.quitBtn} onClick={onQuit} aria-label="Exit exercise"><X weight="bold" size={20} /></button>
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={current} aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.counter} aria-live="polite">{current} / {total}</span>
    </header>
  )
}

export function FeedbackBanner({ isCorrect, correctAnswer, description, xpReward, message, onContinue }) {
  const desc = normalizeDesc(description)
  return (
    <div className={styles.feedback} data-correct={isCorrect} role="status" aria-live="assertive">
      <div className={styles.feedbackBody}>
        <div className={styles.feedbackIcon} data-correct={isCorrect}>
          {isCorrect ? <Check weight="bold" size={20} aria-hidden="true" />
            : <XCircle weight="bold" size={20} aria-hidden="true" />}
        </div>
        <div>
          <p className={styles.feedbackTitle}>{message}</p>
          {isCorrect && <span className={styles.feedbackXp} aria-label={`+${xpReward} XP earned`}><Lightning weight="fill" size={12} aria-hidden="true" />+{xpReward} XP earned</span>}
          {desc && <p className={styles.feedbackDesc}>{desc}</p>}
        </div>
      </div>
      <button className={styles.continueBtn} data-correct={isCorrect} onClick={onContinue} autoFocus>
        Continue <ArrowRight weight="bold" size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GrammarExerciseView
// ═══════════════════════════════════════════════════════════════════════════════
export function GrammarExerciseView({
  exercises = [], xpReward = 10, onComplete, onQuit, onAnswer,
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [streak, setStreak] = useState(0)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [vocabSelections, setVocabSelections] = useState(null)

  const exercise = exercises[idx]
  const total = exercises.length
  const isVocab = exercise?.questions?.length > 0

  const isValid = exercise && (
    isVocab || (exercise.title && exercise.answers && exercise.correct != null)
  )

  // Auto-skip malformed exercises
  useEffect(() => {
    if (exercise && !isValid) {
      if (idx + 1 >= total) { onComplete?.() }
      else { setIdx(i => i + 1); setSelected(null); setFeedbackMsg(''); setPhase(PHASE.IDLE) }
    }
  }, [exercise, isValid, idx, total, onComplete])

  // Initialize vocab selections when entering a vocab exercise
  useEffect(() => {
    if (isVocab && exercise) {
      const qCount = (exercise.questions || []).length
      setVocabSelections(new Array(qCount).fill(null))
      setSelected(null)
      setPhase(PHASE.IDLE)
      setFeedbackMsg('')
    }
  }, [idx, isVocab, exercise])

  // ── Grammar path variables & callbacks (always called, before any return) ──
  const grammarIsCorrect = isVocab ? false : selected === exercise?.correct
  const grammarSelectedText = isVocab ? null : (selected != null ? stripAnswerPrefix(exercise?.answers?.[selected]) : null)
  const grammarCorrectText = isVocab ? '' : (exercise ? stripAnswerPrefix(exercise?.answers?.[exercise?.correct]) : '')

  const handleSelect = useCallback(answerIdx => {
    if (phase === PHASE.CHECKED) return
    setSelected(answerIdx); setPhase(PHASE.SELECTED)
  }, [phase])

  const handleCheck = useCallback(() => {
    const correct = selected === exercise?.correct
    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    setFeedbackMsg(correct ? pickFeedbackMessage(newStreak) : pickErrorMessage())
    setPhase(PHASE.CHECKED)
  }, [selected, exercise, streak])

  const handleContinue = useCallback(() => {
    onAnswer?.()
    if (idx + 1 >= total) { onComplete?.() }
    else { setIdx(i => i + 1); setSelected(null); setFeedbackMsg(''); setPhase(PHASE.IDLE) }
  }, [idx, total, onComplete, onAnswer])

  if (!exercise) return null
  if (!isValid) return null

  // ── Vocabulary path ────────────────────────────────────────────────────
  if (isVocab) {
    const questions = exercise.questions || []
    const qCount = questions.length
    const allVocabSelected = vocabSelections && vocabSelections.every(s => s != null)

    const handleVocabSelect = (qIdx, optIdx) => {
      if (phase === PHASE.CHECKED) return
      setVocabSelections(prev => { const n = [...prev]; n[qIdx] = optIdx; return n })
      setPhase(PHASE.SELECTED)
    }

    const handleVocabCheck = () => {
      const correct = questions.filter((q, i) => vocabSelections[i] === q.correct).length
      const allRight = correct === qCount
      const newStreak = allRight ? streak + 1 : 0
      setStreak(newStreak)
      setFeedbackMsg(allRight ? pickFeedbackMessage(newStreak) : pickErrorMessage())
      setPhase(PHASE.CHECKED)
    }

    const handleVocabContinue = () => {
      onAnswer?.()
      if (idx + 1 >= total) { onComplete?.() }
      else { setIdx(i => i + 1); setSelected(null); setFeedbackMsg(''); setPhase(PHASE.IDLE) }
    }

    const vocabCorrectCount = phase === PHASE.CHECKED
      ? questions.filter((q, i) => vocabSelections[i] === q.correct).length : 0
    const vocabAllCorrect = vocabCorrectCount === qCount
    const vocabPandaMood = phase === PHASE.CHECKED ? (vocabAllCorrect ? 'happy' : 'oops') : 'idle'
    const vocabSpeechText = { happy: 'Great work! 🎉', oops: 'Keep going! 💪' }[vocabPandaMood]

    return (
      <div className={styles.root}>
        <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />
        <main className={styles.body}>
          <span className={styles.skillLabel}>
            <Sparkle weight="fill" size={12} aria-hidden="true" />
            {exercise.label ?? 'Vocabulary'}
          </span>
          {exercise.description && <p className={styles.vocabInstruction}>{exercise.description}</p>}
          <div className={styles.metaRow}>
            <span className={styles.xpBadge} aria-label={`+${xpReward} XP per correct answer`}>
              <Lightning weight="fill" size={13} aria-hidden="true" />+{xpReward} XP
            </span>
            <span className={styles.instruction}>Pick the best answer for each item</span>
          </div>
          {vocabPandaMood !== 'idle' && (
            <div className={styles.pandaWrapper}>
              {vocabSpeechText && <div className={styles.speechBubble} data-mood={vocabPandaMood}>{vocabSpeechText}</div>}
              <img src={pandaImg} alt="" aria-hidden="true"
                className={clsx(styles.pandaDecor,
                  vocabPandaMood === 'happy' ? styles.pandaHappy : vocabPandaMood === 'oops' ? styles.pandaOops : styles.pandaIdle)} />
            </div>
          )}
          <div className={styles.vocabList}>
            {questions.map((q, qIdx) => (
              <div key={qIdx} className={styles.vocabItem}>
                <SentenceWithGap title={q.title}
                  selectedText={vocabSelections && vocabSelections[qIdx] != null ? stripAnswerPrefix(q.answers[vocabSelections[qIdx]]) : null}
                  phase={phase} isCorrect={vocabSelections && vocabSelections[qIdx] === q.correct} small />
                <div className={styles.vocabOptions} role="group" aria-label={`Answer choices for question ${qIdx + 1}`}>
                  {(q.answers || []).map((raw, optIdx) => (
                    <AnswerOptionCard key={optIdx} answer={stripAnswerPrefix(raw)}
                      letter={LETTERS[optIdx] ?? String(optIdx + 1)}
                      isSelected={vocabSelections && vocabSelections[qIdx] === optIdx}
                      isChecked={phase === PHASE.CHECKED}
                      isCorrectOption={q.correct === optIdx}
                      onSelect={() => handleVocabSelect(qIdx, optIdx)} small />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className={styles.footer}>
          {phase !== PHASE.CHECKED ? (
            <>
              {!allVocabSelected && phase === PHASE.SELECTED && (
                <p className={styles.vocabHint}>
                  {(vocabSelections || []).filter(s => s != null).length} of {qCount} answered
                </p>
              )}
              <button className={clsx(styles.checkBtn)} disabled={!allVocabSelected} onClick={handleVocabCheck}>
                Check answers
              </button>
            </>
          ) : (
            <FeedbackBanner isCorrect={vocabAllCorrect}
              correctAnswer={`${vocabCorrectCount}/${qCount} correct`}
              description={null} xpReward={xpReward * vocabCorrectCount}
              message={feedbackMsg} onContinue={handleVocabContinue} />
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  GRAMMAR (gap-fill) PATH
  // ═══════════════════════════════════════════════════════════════════════════
  const isCorrect = grammarIsCorrect
  const selectedText = grammarSelectedText
  const correctText = grammarCorrectText

  const pandaMood = phase === PHASE.CHECKED ? (isCorrect ? 'happy' : 'oops') : 'idle'
  const pandaMoodClass = { idle: styles.pandaIdle, happy: styles.pandaHappy, oops: styles.pandaOops }[pandaMood]
  const speechText = { happy: 'Great work! 🎉', oops: 'Keep going! 💪' }[pandaMood]

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />
      <main className={styles.body}>
        <span className={styles.skillLabel}>
          <Sparkle weight="fill" size={12} aria-hidden="true" />
          {exercise.label ?? 'Grammar'}
        </span>
        <div className={styles.metaRow}>
          <span className={styles.xpBadge} aria-label={`+${xpReward} XP per correct answer`}>
            <Lightning weight="fill" size={13} aria-hidden="true" />+{xpReward} XP
          </span>
          <span className={styles.instruction}>Pick the best answer to complete the sentence</span>
        </div>
        <div className={styles.pandaWrapper}>
          {speechText && <div className={styles.speechBubble} data-mood={pandaMood}>{speechText}</div>}
          <img src={pandaImg} alt="" aria-hidden="true" className={clsx(styles.pandaDecor, pandaMoodClass)} />
        </div>
        <SentenceWithGap title={exercise.title}
          selectedText={phase !== PHASE.IDLE ? selectedText : null}
          phase={phase} isCorrect={isCorrect} />
        <AnswerOptionList answers={exercise.answers} selectedIdx={selected}
          phase={phase} correctIdx={exercise.correct} onSelect={handleSelect} />
      </main>
      <div className={styles.footer}>
        {phase !== PHASE.CHECKED ? (
          <button className={clsx(styles.checkBtn)} disabled={phase === PHASE.IDLE} onClick={handleCheck}>
            Check answer
          </button>
        ) : (
          <FeedbackBanner isCorrect={isCorrect} correctAnswer={correctText}
            description={exercise.description} xpReward={xpReward}
            message={feedbackMsg} onContinue={handleContinue} />
        )}
      </div>
    </div>
  )
}
