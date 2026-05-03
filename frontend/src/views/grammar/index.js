import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { GrammarExerciseView } from 'components/ui'
import pandaImg from 'assets/illustrations/pandas/panda.svg'

// ── Load real exam data ────────────────────────────────────────────────────────
// Falls back through exam-01 → exam-02 as needed.
// ?exam=exam-02 in the URL picks a specific file.
import exam01 from 'data/exams/aptis/exam-01.json'
import exam02 from 'data/exams/aptis/exam-02.json'

const EXAM_MAP = {
  'exam-01': exam01,
  'exam-02': exam02,
}

function getGrammarExercises(examData) {
  const grammarSchema = examData.schema?.find(
    s => s.category === 'Grammar & Vocabulary'
  )
  return grammarSchema?.exercises ?? []
}

// ── Done screen ────────────────────────────────────────────────────────────────
function DoneScreen({ total, onRestart, onExit }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      gap: 40,
      padding: '40px 32px',
      background: 'var(--color-bg-primary)',
      textAlign: 'center',
    }}>
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        style={{
          width: 200,
          height: 'auto',
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          Section complete!
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-muted)',
          margin: 0,
        }}>
          You answered all {total} grammar questions.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: 'var(--radius-xl)',
            border: '2.5px solid var(--color-border-default)',
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontWeight: 700,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            boxShadow: '0 4px 0 0 var(--color-border-default)',
          }}
        >
          Restart
        </button>
        <button
          onClick={onExit}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: 'var(--radius-xl)',
            border: 'none',
            background: 'var(--color-brand-primary)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            boxShadow: '0 4px 0 0 var(--color-brand-primary-dark)',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── GrammarView ────────────────────────────────────────────────────────────────
export default function GrammarView() {
  const history  = useHistory()
  const location = useLocation()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0) // bump to reset the exercise

  // ?exam=exam-02 to switch exam from the URL
  const params  = new URLSearchParams(location.search)
  const examId  = params.get('exam') ?? 'exam-01'
  const examData = EXAM_MAP[examId] ?? exam01

  const exercises = getGrammarExercises(examData)

  if (done) {
    return (
      <DoneScreen
        total={exercises.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <GrammarExerciseView
      key={key}
      exercises={exercises}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
