import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { WritingExerciseView } from 'components/ui'
import pandaImg from 'assets/img/panda.svg'

// ── Sample exercises ──────────────────────────────────────────────────────────
// Each exercise has a shared context + two tasks (informal + formal).
// The context mirrors APTIS Part C writing tasks.
const WRITING_EXERCISES = [
  {
    context: {
      subject: 'Holiday complaint',
      scenario:
        'You recently stayed at the Grand Bay Hotel in Barcelona. You were disappointed with your stay and want to let your friend Sarah know, and also write to the hotel manager.',
      notes: [
        'Your room was noisy and had no sea view as promised',
        'The outdoor pool was closed for repairs without prior notice',
        'Staff were unhelpful when you raised your concerns',
      ],
    },
    tasks: [
      {
        label: 'Task 1',
        type: 'Informal Email',
        instruction:
          'Write an email to your friend Sarah telling her about your disappointing holiday experience.',
        minWords: 40,
        targetWords: 50,
        maxWords: 75,
        placeholder: 'Hey Sarah,\n\nJust got back from Barcelona — what a nightmare! You\'ll never believe what happened...',
        hints: [
          'Use casual language and contractions (I\'m, it\'s, can\'t)',
          'Express your feelings — frustrated, annoyed, let down…',
        ],
      },
      {
        label: 'Task 2',
        type: 'Formal Email',
        instruction:
          'Write a formal complaint email to the hotel manager, explaining the problems and requesting a partial refund.',
        minWords: 120,
        targetWords: 140,
        maxWords: 165,
        placeholder: 'Dear Hotel Manager,\n\nI am writing to formally express my dissatisfaction regarding my recent stay...',
        hints: [
          'Open with "Dear [Title]" and close with "Yours faithfully"',
          'State each issue clearly — avoid emotional language',
        ],
      },
    ],
  },
  {
    context: {
      subject: 'Community centre closure',
      scenario:
        'The local community centre in your town is going to be closed permanently due to budget cuts. You want to write to a friend who used the centre, and also to the town council.',
      notes: [
        'The centre hosts weekly sports clubs and language classes',
        'Many elderly residents rely on it for social activities',
        'A petition with 800 signatures has already been submitted',
      ],
    },
    tasks: [
      {
        label: 'Task 1',
        type: 'Informal Email',
        instruction:
          'Write an email to your friend Tom, who used to attend events at the centre, sharing the news and your thoughts.',
        minWords: 40,
        targetWords: 50,
        maxWords: 75,
        placeholder: 'Hi Tom,\n\nHave you heard the news about the community centre? I can\'t believe they\'re...',
        hints: [
          'Keep it conversational — write as you would speak',
          'Ask for Tom\'s opinion and suggest what to do next',
        ],
      },
      {
        label: 'Task 2',
        type: 'Formal Email',
        instruction:
          'Write a formal email to the town council arguing against the closure and proposing an alternative solution.',
        minWords: 120,
        targetWords: 140,
        maxWords: 165,
        placeholder: 'Dear Members of the Town Council,\n\nI am writing on behalf of the local community to strongly object to...',
        hints: [
          'Structure your argument: problem → impact → solution',
          'Use formal phrases: "I would like to draw your attention to…"',
        ],
      },
    ],
  },
]

const XP_REWARD = 30

// ── Done screen ───────────────────────────────────────────────────────────────
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
        background: 'linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 40%)',
        textAlign: 'center',
      }}
    >
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        style={{
          width: 160,
          height: 'auto',
          filter: 'drop-shadow(0 8px 24px rgba(79,70,229,0.20))',
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
          Writing session complete!
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', margin: 0 }}>
          You completed {total} {total === 1 ? 'exercise' : 'exercises'} and earned +{xpEarned} XP!
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: '2.5px solid #E2E8F0', background: '#fff', color: '#1E293B',
            fontWeight: 700, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #E2E8F0',
          }}
        >
          Restart
        </button>
        <button
          onClick={onExit}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: 'none', background: '#4F46E5', color: '#fff',
            fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #3730A3',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── WritingView ───────────────────────────────────────────────────────────────
export default function WritingView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={WRITING_EXERCISES.length}
        xpEarned={XP_REWARD * WRITING_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <WritingExerciseView
      key={key}
      exercises={WRITING_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
