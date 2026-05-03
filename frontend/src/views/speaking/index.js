import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { SpeakingExerciseView } from 'components/ui'
import pandaImg from 'assets/illustrations/pandas/panda.svg'

// ── Sample exercises ────────────────────────────────────────────────────────────
// reference: URL to a native speaker audio clip.
// Leave reference undefined if no audio is available — the exercise still works.
const SPEAKING_EXERCISES = [
  {
    phrase: 'The meeting has been moved to Monday afternoon.',
    translation: 'La reunión se ha movido al lunes por la tarde.',
    topic: 'Business English',
    description: 'Focus on the contracted "has been" — it should sound like "həz bɪn" at natural speed.',
    reference: undefined,
  },
  {
    phrase: "I'd like to reschedule our appointment, if possible.",
    translation: 'Me gustaría reprogramar nuestra cita, si es posible.',
    topic: 'Formal requests',
    description: 'Stress the word "reschedule" on the second syllable: re-SCHED-ule.',
    reference: undefined,
  },
  {
    phrase: 'Could you speak a little more slowly, please?',
    translation: '¿Podría hablar un poco más despacio, por favor?',
    topic: 'Social English',
    description: 'This is a polite request — use a rising intonation at the end.',
    reference: undefined,
  },
  {
    phrase: "We're looking forward to working with your team.",
    translation: 'Esperamos trabajar con su equipo.',
    topic: 'Professional',
    description: '"Looking forward to" is often reduced to "lookin forwardta" in fast speech.',
    reference: undefined,
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
        background: 'linear-gradient(180deg, #FFF1F2 0%, #FFFFFF 40%)',
        textAlign: 'center',
      }}
    >
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        style={{ width: 200, height: 'auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
          Speaking session done!
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', margin: 0 }}>
          You completed {total} phrases and earned +{xpEarned} XP!
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
            border: 'none', background: '#DB2777', color: '#fff',
            fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #BE185D',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── SpeakingView ────────────────────────────────────────────────────────────────
export default function SpeakingView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={SPEAKING_EXERCISES.length}
        xpEarned={XP_REWARD * SPEAKING_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <SpeakingExerciseView
      key={key}
      exercises={SPEAKING_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
