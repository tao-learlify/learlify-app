import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ListeningExerciseView } from 'components/ui'
import pandaImg from 'assets/illustrations/pandas/panda.svg'

import exam01 from 'data/exams/aptis/exam-01.json'
import exam02 from 'data/exams/aptis/exam-02.json'
import exam03 from 'data/exams/aptis/exam-03.json'
import exam04 from 'data/exams/aptis/exam-04.json'
import exam05 from 'data/exams/aptis/exam-05.json'
import exam06 from 'data/exams/aptis/exam-06.json'
import exam07 from 'data/exams/aptis/exam-07.json'
import exam08 from 'data/exams/aptis/exam-08.json'
import exam09 from 'data/exams/aptis/exam-09.json'
import exam10 from 'data/exams/aptis/exam-10.json'

const EXAM_MAP = {
  'exam-01': exam01, 'exam-02': exam02, 'exam-03': exam03, 'exam-04': exam04,
  'exam-05': exam05, 'exam-06': exam06, 'exam-07': exam07, 'exam-08': exam08,
  'exam-09': exam09, 'exam-10': exam10,
}

function getListeningExercises(examData) {
  const schema = examData.schema?.find(s => s.category === 'Listening')
  if (!schema?.exercises) return []
  return schema.exercises
    .map(ex => ({
      ...ex,
      audioUrl: ex.recordingUrl || ex.audioUrl || null,
    }))
}

const XP_REWARD = 20

function DoneScreen({ total, onRestart, onExit }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100dvh', gap: 40,
      padding: '40px 32px', background: '#FFFFFF', textAlign: 'center',
    }}>
      <img src={pandaImg} alt="" aria-hidden="true"
        style={{ width: 200, height: 'auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
          🎉 Listening complete!
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0 }}>
          You answered all {total} listening questions. Great work!
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
        <button onClick={onRestart} style={{
          flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-border-default)', background: '#FFFFFF',
          color: 'var(--color-text-primary)', fontWeight: 700, fontSize: 'var(--text-base)',
          cursor: 'pointer', boxShadow: 'var(--shadow-button)',
        }}>Try again</button>
        <button onClick={onExit} style={{
          flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-lg)',
          border: 'none', background: 'var(--color-brand-primary)', color: '#fff',
          fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
          boxShadow: 'var(--shadow-button-brand)',
        }}>Back to exams</button>
      </div>
    </div>
  )
}

export default function ListeningView() {
  const history = useHistory()
  const location = useLocation()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  const params   = new URLSearchParams(location.search)
  const examId   = params.get('exam') ?? 'exam-01'
  const examData = EXAM_MAP[examId] ?? exam01
  const exercises = getListeningExercises(examData)

  if (done) {
    return <DoneScreen total={exercises.length}
      onRestart={() => { setKey(k => k + 1); setDone(false) }}
      onExit={() => history.push('/exams')} />
  }

  return (
    <ListeningExerciseView key={key} exercises={exercises}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()} />
  )
}
