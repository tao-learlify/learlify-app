import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ListeningExerciseView } from 'components/ui'
import pandaImg from 'assets/img/panda.svg'

// ── Sample exercises ────────────────────────────────────────────────────────────
// Replace audioUrl values with real hosted audio files.
// answers[correct] is the right answer; other entries are distractors.
const LISTENING_EXERCISES = [
  {
    audioUrl: null, // e.g. 'https://cdn.example.com/audio/q1.mp3'
    title: '1. What does the speaker say about the meeting?',
    answers: [
      'A. It was cancelled',
      'B. It has been moved to Monday',
      'C. It will last two hours',
      'D. It starts at 9 AM',
    ],
    correct: 1,
    description: 'The speaker clearly states the meeting was rescheduled to Monday.',
  },
  {
    audioUrl: null,
    title: '2. What is the woman asking for?',
    answers: [
      'A. A refund for her order',
      'B. Directions to the nearest store',
      'C. Help with her account password',
      'D. Information about a product',
    ],
    correct: 2,
    description: 'She mentions she forgot her password and cannot log in.',
  },
  {
    audioUrl: null,
    title: '3. Where does the conversation take place?',
    answers: [
      'A. At an airport',
      'B. In a restaurant',
      'C. At a train station',
      'D. In a hotel lobby',
    ],
    correct: 0,
    description: 'Background announcements and references to boarding gates indicate an airport.',
  },
  {
    audioUrl: null,
    title: '4. What will the man do next?',
    answers: [
      'A. Call his supervisor',
      'B. Send an email',
      'C. Fill out a form',
      'D. Go to the pharmacy',
    ],
    correct: 3,
    description: 'The man says he needs to pick up his prescription on his way home.',
  },
]

const XP_REWARD = 20

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
          Listening complete!
        </h1>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          You answered {total} questions and earned +{xpEarned} XP!
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

// ── ListeningView ───────────────────────────────────────────────────────────────
export default function ListeningView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={LISTENING_EXERCISES.length}
        xpEarned={XP_REWARD * LISTENING_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <ListeningExerciseView
      key={key}
      exercises={LISTENING_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
