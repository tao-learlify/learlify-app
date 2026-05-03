import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ReadingExerciseView } from 'components/ui'
import pandaImg from 'assets/illustrations/pandas/panda.svg'

// ── Sample exercises ────────────────────────────────────────────────────────────
// Each exercise has items (shuffled display order) and correct (correct id order).
// items order is intentionally scrambled so the exercise is non-trivial.
const READING_EXERCISES = [
  {
    title: 'How to make a cup of tea',
    items: [
      { id: 'c', text: 'Pour the boiling water into the cup' },
      { id: 'a', text: 'Fill the kettle with fresh water' },
      { id: 'd', text: 'Add the tea bag and let it steep for 3 minutes' },
      { id: 'b', text: 'Boil the water' },
      { id: 'e', text: 'Remove the tea bag and enjoy' },
    ],
    correct: ['a', 'b', 'c', 'd', 'e'],
    description: 'Always use fresh water — reboiled water loses oxygen and makes tea taste flat.',
  },
  {
    title: 'Booking a flight online',
    items: [
      { id: 'b', text: 'Search for available flights on your chosen dates' },
      { id: 'd', text: 'Enter passenger details and payment information' },
      { id: 'a', text: 'Open the airline or travel booking website' },
      { id: 'e', text: 'Download or save your boarding pass' },
      { id: 'c', text: 'Select your preferred flight and seat' },
    ],
    correct: ['a', 'b', 'c', 'd', 'e'],
    description: 'Always double-check passenger names — they must match your passport exactly.',
  },
  {
    title: 'Sending a formal email',
    items: [
      { id: 'c', text: 'Write a clear and concise body' },
      { id: 'a', text: 'Open your email client' },
      { id: 'd', text: 'Add a professional closing and your signature' },
      { id: 'b', text: 'Enter the recipient\'s address and a subject line' },
      { id: 'e', text: 'Proofread, then click Send' },
    ],
    correct: ['a', 'b', 'c', 'd', 'e'],
    description: 'A strong subject line increases the chance your email gets read promptly.',
  },
]

const XP_REWARD = 15

// ── Done screen ─────────────────────────────────────────────────────────────────
function DoneScreen({ total, xpEarned, onRestart, onExit }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: 40,
        padding: '40px 32px',
        background: 'var(--color-bg-primary)',
        textAlign: 'center',
      }}
    >
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
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Reading complete!
        </h1>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          You sequenced {total} exercises and earned +{xpEarned} XP!
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
            background: '#059669',
            color: '#fff',
            fontWeight: 800,
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            boxShadow: '0 4px 0 0 #047857',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── ReadingView ─────────────────────────────────────────────────────────────────
export default function ReadingView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={READING_EXERCISES.length}
        xpEarned={XP_REWARD * READING_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <ReadingExerciseView
      key={key}
      exercises={READING_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
