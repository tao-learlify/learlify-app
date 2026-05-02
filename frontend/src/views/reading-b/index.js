import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ReadingOpinionView } from 'components/ui'
import pandaImg from 'assets/img/panda.svg'

// ── Sample exercises ──────────────────────────────────────────────────────────
// Each exercise: 4 people give opinions, user matches 7 questions to persons.
// Mirrors APTIS Part B reading — "Which person says each of the following?"
const READING_B_EXERCISES = [
  {
    title: 'Remote working',
    instruction: 'Which person (A, B, C or D) expresses each of the following opinions about remote working?',
    people: [
      {
        id: 'A',
        name: 'Sofia',
        opinion:
          'I genuinely love working from home. My productivity has skyrocketed since I stopped commuting — I get two extra hours each day to focus on deep work. The key for me was setting up a dedicated office space and sticking to the same schedule I had in the office. Some of my colleagues struggle with isolation, but I find the quiet incredibly helpful.',
      },
      {
        id: 'B',
        name: 'Marcus',
        opinion:
          'Remote work sounds appealing, but it has created serious problems in my team. Junior staff miss out on informal learning — those hallway conversations where you pick things up from experienced colleagues. I\'ve also noticed that collaboration suffers badly. We try to compensate with more video calls, but honestly they feel draining compared to spontaneous in-person discussions.',
      },
      {
        id: 'C',
        name: 'Yuki',
        opinion:
          'I think the ideal is a genuine hybrid model — not just one or two days from home, but a thoughtful split based on the type of work. Focused individual tasks are perfect for home; brainstorming, mentoring and team building work far better face-to-face. Companies that force a one-size-fits-all policy are making a mistake in either direction.',
      },
      {
        id: 'D',
        name: 'Rafael',
        opinion:
          'The technology has finally caught up with the concept. The real challenge now is cultural. Many managers still measure performance by visibility rather than results. Until organisations genuinely trust their employees and judge them on outputs, remote work will always feel like a second-class arrangement — even when the work itself is excellent.',
      },
    ],
    questions: [
      {
        id: 'rw1q1',
        text: 'Having a fixed routine helped this person adapt successfully to working from home.',
        correct: 'A',
      },
      {
        id: 'rw1q2',
        text: 'This person believes management attitudes need to change before remote work can truly succeed.',
        correct: 'D',
      },
      {
        id: 'rw1q3',
        text: 'This person thinks new employees are particularly disadvantaged by remote arrangements.',
        correct: 'B',
      },
      {
        id: 'rw1q4',
        text: 'This person argues that a single policy cannot suit all types of work.',
        correct: 'C',
      },
      {
        id: 'rw1q5',
        text: 'This person finds online meetings tiring and prefers face-to-face interaction.',
        correct: 'B',
      },
      {
        id: 'rw1q6',
        text: 'This person values the extra time gained by not travelling to work.',
        correct: 'A',
      },
      {
        id: 'rw1q7',
        text: 'This person thinks judging employees by what they achieve is better than judging them by how often they are seen.',
        correct: 'D',
      },
    ],
  },
  {
    title: 'Social media and young people',
    instruction: 'Which person (A, B, C or D) expresses each of the following opinions about social media use among young people?',
    people: [
      {
        id: 'A',
        name: 'Priya',
        opinion:
          'I work in a secondary school and I see the impact every day. Constant comparison with curated highlight reels is genuinely damaging to self-esteem, especially in teenage girls. Sleep deprivation from late-night scrolling is another major concern. I\'m not anti-technology — but I think schools and parents urgently need to establish clear boundaries around screen time.',
      },
      {
        id: 'B',
        name: 'James',
        opinion:
          'People forget how much positive community-building happens on these platforms. Young people with niche interests, health conditions or minority identities can find their people online in a way that simply wasn\'t possible before. I won\'t dismiss the risks, but a total moral panic is unhelpful. The platforms themselves need to be held accountable through proper regulation, not individual users.',
      },
      {
        id: 'C',
        name: 'Leila',
        opinion:
          'Digital literacy is the missing piece. We teach young people road safety and financial literacy — why not critical thinking about algorithms, advertising and online identity? If children understood how attention is monetised and how content is personalised to maximise engagement, they\'d be far better equipped to use these tools responsibly.',
      },
      {
        id: 'D',
        name: 'Tom',
        opinion:
          'The research is more mixed than the headlines suggest. For every study showing harm, there\'s another showing benefits — connection, creative expression, access to information. The effect seems to depend heavily on how platforms are used. Passive scrolling correlates with negative outcomes; active creation and communication show neutral or positive effects. Context matters enormously.',
      },
    ],
    questions: [
      {
        id: 'rw2q1',
        text: 'This person believes the effect of social media depends on the way it is used, not just the fact that it is used.',
        correct: 'D',
      },
      {
        id: 'rw2q2',
        text: 'This person thinks young people should be taught how social media platforms make money.',
        correct: 'C',
      },
      {
        id: 'rw2q3',
        text: 'This person is concerned about the effect of social media on how teenagers feel about themselves.',
        correct: 'A',
      },
      {
        id: 'rw2q4',
        text: 'This person argues that social media companies should face greater legal restrictions.',
        correct: 'B',
      },
      {
        id: 'rw2q5',
        text: 'This person highlights that social media can help isolated individuals find a sense of belonging.',
        correct: 'B',
      },
      {
        id: 'rw2q6',
        text: 'This person points out that not getting enough sleep is a problem linked to social media use.',
        correct: 'A',
      },
      {
        id: 'rw2q7',
        text: 'This person suggests that simply looking at content without interacting is more harmful than creating it.',
        correct: 'D',
      },
    ],
  },
]

const XP_REWARD = 25

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
        background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 40%)',
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
          filter: 'drop-shadow(0 8px 24px rgba(14,165,233,0.22))',
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
          Reading session complete!
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
            border: '2.5px solid #BAE6FD', background: '#fff', color: '#0369A1',
            fontWeight: 700, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #BAE6FD',
          }}
        >
          Restart
        </button>
        <button
          onClick={onExit}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: 'none', background: '#0EA5E9', color: '#fff',
            fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #0284C7',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── ReadingBView ──────────────────────────────────────────────────────────────
export default function ReadingBView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={READING_B_EXERCISES.length}
        xpEarned={XP_REWARD * READING_B_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <ReadingOpinionView
      key={key}
      exercises={READING_B_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
