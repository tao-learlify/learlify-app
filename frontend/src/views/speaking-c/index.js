import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { SpeakingImageView } from 'components/ui'
import pandaImg from 'assets/img/panda.svg'

// ── Sample exercises ──────────────────────────────────────────────────────────
// Replace `image` values with actual assets (e.g. import img1 from 'assets/img/...')
// Each exercise mirrors an APTIS C2 image description task.
const SPEAKING_C_EXERCISES = [
  {
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
    imageAlt: 'A busy outdoor farmers market with colourful fruit and vegetable stalls, vendors and shoppers',
    title: 'At the market',
    prompt: 'Describe what you see',
    hints: [
      'What are people doing?',
      'What can you see on the stalls?',
      'What is the atmosphere like?',
      'Any other details?',
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    imageAlt: 'A group of people doing outdoor exercise in a park on a sunny day',
    title: 'In the park',
    prompt: 'Describe what you see',
    hints: [
      'What activities are happening?',
      'How many people can you see?',
      'What does the setting look like?',
      'What time of day might it be?',
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    imageAlt: 'A restaurant interior with diners sitting at tables, warm lighting, and waiters serving food',
    title: 'At the restaurant',
    prompt: 'Describe what you see',
    hints: [
      'Who is in the scene?',
      'What are they doing?',
      'Describe the place and mood',
      'Any interesting details?',
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
        background: 'linear-gradient(180deg, #FFF1F2 0%, #FFFFFF 40%)',
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
          filter: 'drop-shadow(0 8px 24px rgba(225,29,72,0.22))',
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
          Speaking session complete!
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', margin: 0 }}>
          You described {total} {total === 1 ? 'image' : 'images'} and earned +{xpEarned} XP!
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: '2.5px solid #FECDD3', background: '#fff', color: '#E11D48',
            fontWeight: 700, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #FECDD3',
          }}
        >
          Restart
        </button>
        <button
          onClick={onExit}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: 'none', background: '#E11D48', color: '#fff',
            fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #BE123C',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── SpeakingCView ─────────────────────────────────────────────────────────────
export default function SpeakingCView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={SPEAKING_C_EXERCISES.length}
        xpEarned={XP_REWARD * SPEAKING_C_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <SpeakingImageView
      key={key}
      exercises={SPEAKING_C_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
