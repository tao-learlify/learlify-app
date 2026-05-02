import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Megaphone, Fire, Question, Gear, Leaf } from '@phosphor-icons/react'
import { VocabularyExerciseView } from 'components/ui'
import pandaImg from 'assets/img/panda.svg'

// ── Vocabulary questions ────────────────────────────────────────────────────────
// icon: ReactNode — passed into WordRow's icon badge (optional, purely decorative)
const VOCABULARY_QUESTIONS = [
  {
    title: '1.Eloquent {x}',
    answers: [
      'A. well-spoken and persuasive',
      'B. easily frightened',
      'C. loud and aggressive',
    ],
    correct: 0,
    icon: <Megaphone weight="fill" size={16} />,
  },
  {
    title: '2.Tenacious {x}',
    answers: [
      'A. shy and withdrawn',
      'B. persistent and determined',
      'C. generous and kind',
    ],
    correct: 1,
    icon: <Fire weight="fill" size={16} />,
  },
  {
    title: '3.Ambiguous {x}',
    answers: [
      'A. clearly understood',
      'B. expensive and rare',
      'C. open to more than one interpretation',
    ],
    correct: 2,
    icon: <Question weight="fill" size={16} />,
  },
  {
    title: '4.Pragmatic {x}',
    answers: [
      'A. dealing with things sensibly and realistically',
      'B. full of imagination',
      'C. quick to argue',
    ],
    correct: 0,
    icon: <Gear weight="fill" size={16} />,
  },
  {
    title: '5.Serene {x}',
    answers: [
      'A. noisy and chaotic',
      'B. calm and peaceful',
      'C. bold and daring',
    ],
    correct: 1,
    icon: <Leaf weight="fill" size={16} />,
  },
]

const XP_REWARD = 15

// ── Done screen ────────────────────────────────────────────────────────────────
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
          Vocabulary complete!
        </h1>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          You matched all {total} words and earned +{xpEarned} XP!
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

// ── VocabularyView ─────────────────────────────────────────────────────────────
export default function VocabularyView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={VOCABULARY_QUESTIONS.length}
        xpEarned={XP_REWARD * VOCABULARY_QUESTIONS.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <VocabularyExerciseView
      key={key}
      questions={VOCABULARY_QUESTIONS}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
