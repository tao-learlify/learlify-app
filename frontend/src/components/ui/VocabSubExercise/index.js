import React, { useState, useCallback, useMemo, useEffect } from 'react'
import clsx from 'clsx'
import { Check, XCircle, ArrowRight, Lightning, Sparkle } from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda.svg'

const PHASE = { IDLE: 'idle', SELECTED: 'selected', CHECKED: 'checked' }
const LETTERS = ['A', 'B', 'C', 'D', 'E']

const CORRECT_MSGS = ['Nice one!', 'Great job!', 'Well done!', 'You got it!', "That's correct!"]
const ERROR_MSGS = ['Almost there!', 'Not quite right', 'Good try!', 'Close one!', "Let's try again"]

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function stripAnswerPrefix(str) { return (str || '').replace(/^[A-Za-z]\.\s*/, '').trim() }
function stripQuestionNumber(str) { return (str || '').replace(/^\s*\d+\.\s*/, '').trim() }
function parseSentence(title) {
  const clean = stripQuestionNumber(title)
  const [before, after = ''] = clean.split('{x}')
  return { before, after }
}

function GapSlot({ text, phase, isCorrect }) {
  let state = 'empty'
  if (text && phase === PHASE.SELECTED) state = 'filled'
  if (text && phase === PHASE.CHECKED) state = isCorrect ? 'correct' : 'incorrect'
  return (
    <span style={{
      display: 'inline-block', minWidth: 60, padding: '2px 6px', margin: '0 2px',
      borderRadius: 6, textAlign: 'center', fontWeight: 700, fontSize: '0.9em',
      background: state === 'correct' ? '#e6f7e6' : state === 'incorrect' ? '#fde8e8' : state === 'filled' ? '#e8f0fe' : '#f0f0f0',
      color: state === 'correct' ? '#16a34a' : state === 'incorrect' ? '#dc2626' : state === 'filled' ? '#2563eb' : '#9ca3af',
      border: `2px solid ${state === 'correct' ? '#16a34a' : state === 'incorrect' ? '#dc2626' : state === 'filled' ? '#2563eb' : '#d1d5db'}`,
    }} aria-label={text ? `Selected: ${text}` : 'blank'}>
      {text ?? '\u00A0\u00A0\u00A0\u00A0'}
    </span>
  )
}

function SentenceWithGap({ title, selectedText, phase, isCorrect }) {
  const { before, after } = useMemo(() => parseSentence(title), [title])
  return (
    <p style={{ margin: 0, lineHeight: 1.6 }} aria-label={stripQuestionNumber(title).replace('{x}', selectedText ?? 'blank')}>
      {before}<GapSlot text={selectedText} phase={phase} isCorrect={isCorrect} />{after}
    </p>
  )
}

function AnswerOption({ text, letter, isSelected, isChecked, isCorrect, onClick }) {
  let state = 'idle'
  if (isSelected && !isChecked) state = 'selected'
  if (isChecked && isCorrect) state = 'correct'
  if (isChecked && isSelected && !isCorrect) state = 'incorrect'
  return (
    <button onClick={onClick} disabled={isChecked} aria-pressed={isSelected}
      style={{
        flex: 1, padding: '8px 12px', borderRadius: 10, border: '2px solid',
        borderColor: state === 'correct' ? '#16a34a' : state === 'incorrect' ? '#dc2626' : state === 'selected' ? '#3b82f6' : '#d1d5db',
        background: state === 'correct' ? '#f0fdf4' : state === 'incorrect' ? '#fef2f2' : state === 'selected' ? '#eff6ff' : '#fff',
        color: '#1f2937', fontWeight: 600, fontSize: '0.9em', cursor: isChecked ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
      }}>
      <span style={{ fontWeight: 800, fontSize: '0.8em', opacity: 0.6, minWidth: 16 }}>
        {isChecked && isCorrect ? '✓' : isChecked && isSelected && !isCorrect ? '✗' : letter}
      </span>
      {text}
    </button>
  )
}

export function VocabSubExercise({ exercise, xpReward = 10, onContinue, onAnswer }) {
  const questions = exercise.questions || []
  const qCount = questions.length
  const [selections, setSelections] = useState(() => new Array(qCount).fill(null))
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [streak, setStreak] = useState(0)

  // Reset on exercise change
  useEffect(() => {
    setSelections(new Array(qCount).fill(null))
    setPhase(PHASE.IDLE)
    setFeedbackMsg('')
  }, [exercise])

  const allSelected = selections.every(s => s != null)
  const correctCount = phase === PHASE.CHECKED
    ? questions.filter((q, i) => selections[i] === q.correct).length : 0
  const allCorrect = correctCount === qCount

  const pandaMood = phase === PHASE.CHECKED ? (allCorrect ? 'happy' : 'oops') : 'idle'

  const handleSelect = (qIdx, optIdx) => {
    if (phase === PHASE.CHECKED) return
    setSelections(prev => { const n = [...prev]; n[qIdx] = optIdx; return n })
    setPhase(PHASE.SELECTED)
  }

  const handleCheck = () => {
    const correct = questions.filter((q, i) => selections[i] === q.correct).length
    const allRight = correct === qCount
    setStreak(allRight ? streak + 1 : 0)
    setFeedbackMsg(allRight ? pickRandom(CORRECT_MSGS) : pickRandom(ERROR_MSGS))
    setPhase(PHASE.CHECKED)
  }

  const handleContinue = () => {
    onAnswer?.()
    onContinue()
  }

  return (
    <main style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkle weight="fill" size={12} />
        <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#6b7280' }}>
          {exercise.label ?? 'Exercise'}
        </span>
      </div>

      {exercise.description && (
        <p style={{ fontSize: 14, color: '#4b5563', margin: 0, padding: 12, background: '#f9fafb', borderRadius: 8, borderLeft: '3px solid #3b82f6', lineHeight: 1.5 }}>
          {exercise.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ padding: '4px 10px', borderRadius: 8, background: '#f0fdf4', color: '#16a34a', fontWeight: 800, fontSize: 13 }}>
          +{xpReward} XP
        </span>
        <span style={{ fontSize: 14, color: '#6b7280' }}>Pick the best answer for each item</span>
      </div>

      {pandaMood !== 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: pandaMood === 'happy' ? '#f0fdf4' : '#fef2f2',
            color: pandaMood === 'happy' ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: 14 }}>
            {pandaMood === 'happy' ? 'Great work! 🎉' : 'Keep going! 💪'}
          </div>
          <img src={pandaImg} alt="" style={{ width: 80, height: 'auto', opacity: 0.9 }} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {questions.map((q, qIdx) => (
          <div key={qIdx} style={{ padding: 12, borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SentenceWithGap title={q.title}
              selectedText={selections[qIdx] != null ? stripAnswerPrefix(q.answers[selections[qIdx]]) : null}
              phase={phase} isCorrect={selections[qIdx] === q.correct} />
            <div style={{ display: 'flex', gap: 8 }}>
              {(q.answers || []).map((raw, optIdx) => (
                <AnswerOption key={optIdx} text={stripAnswerPrefix(raw)}
                  letter={LETTERS[optIdx] ?? String(optIdx + 1)}
                  isSelected={selections[qIdx] === optIdx}
                  isChecked={phase === PHASE.CHECKED}
                  isCorrect={q.correct === optIdx}
                  onClick={() => handleSelect(qIdx, optIdx)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        {phase !== PHASE.CHECKED ? (
          <>
            {!allSelected && phase === PHASE.SELECTED && (
              <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 8 }}>
                {selections.filter(s => s != null).length} of {qCount} answered
              </p>
            )}
            <button disabled={!allSelected} onClick={handleCheck}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: allSelected ? '#16a34a' : '#d1d5db',
                color: '#fff', fontWeight: 800, fontSize: 16, cursor: allSelected ? 'pointer' : 'not-allowed',
                boxShadow: allSelected ? '0 4px 0 0 #15803d' : 'none' }}>
              Check answers
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} role="status">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: allCorrect ? '#f0fdf4' : '#fef2f2', color: allCorrect ? '#16a34a' : '#dc2626', fontSize: 20 }}>
                {allCorrect ? '✓' : '✗'}
              </div>
              <div>
                <p style={{ fontWeight: 700, margin: 0, fontSize: 16 }}>{feedbackMsg}</p>
                {allCorrect && <p style={{ margin: 0, fontSize: 13, color: '#16a34a' }}>+{xpReward * correctCount} XP earned</p>}
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{correctCount}/{qCount} correct</p>
              </div>
            </div>
            <button onClick={handleContinue} autoFocus
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: allCorrect ? '#16a34a' : '#dc2626',
                color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: allCorrect ? '0 4px 0 0 #15803d' : '0 4px 0 0 #b91c1c' }}>
              Continue <ArrowRight weight="bold" size={18} />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
