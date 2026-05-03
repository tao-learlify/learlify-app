import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import aptisSvg from 'assets/illustrations/decorative/aptis.svg'
import b1 from 'assets/illustrations/badges/1.svg'
import b2 from 'assets/illustrations/badges/2.svg'
import b3 from 'assets/illustrations/badges/3.svg'
import b4 from 'assets/illustrations/badges/4.svg'
import b5 from 'assets/illustrations/badges/5.svg'
import b6 from 'assets/illustrations/badges/6.svg'
import b7 from 'assets/illustrations/badges/7.svg'
import b8 from 'assets/illustrations/badges/8.svg'
import b9 from 'assets/illustrations/badges/9.svg'
import b10 from 'assets/illustrations/badges/10.svg'

const BADGES = { 1: b1, 2: b2, 3: b3, 4: b4, 5: b5, 6: b6, 7: b7, 8: b8, 9: b9, 10: b10 }

const TOTAL_EXAMS = 10

const SKILLS = [
  { key: 'grammar', label: 'Grammar & Vocabulary', icon: '📐' },
  { key: 'vocabulary', label: 'Vocabulary', icon: '📚' },
  { key: 'listening', label: 'Listening', icon: '🎧' },
  { key: 'reading', label: 'Reading', icon: '📖' },
  { key: 'speaking', label: 'Speaking', icon: '🎤' },
  { key: 'writing', label: 'Writing', icon: '✏️' },
]

const SKILL_ROUTES = {
  grammar: '/grammar',
  vocabulary: '/vocabulary',
  listening: '/listening',
  reading: '/reading',
  speaking: '/speaking',
  writing: '/writing',
}

export default function ExamSelector() {
  const history = useHistory()
  const [step, setStep] = useState('exam')
  const [selectedExam, setSelectedExam] = useState(null)

  const handleExamSelect = (num) => {
    setSelectedExam(num)
    setStep('skill')
  }

  const handleSkillSelect = (skillKey) => {
    const path = SKILL_ROUTES[skillKey]
    const examId = `exam-${String(selectedExam).padStart(2, '0')}`
    history.push(`${path}?exam=${examId}`)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100dvh',
      background: '#FFFFFF', padding: 32,
    }}>
      {/* Aptis badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: 'var(--color-brand-primary-light)',
        border: '2px solid rgba(88, 204, 2, 0.3)',
        borderRadius: 'var(--radius-xl)', padding: '12px 24px',
        marginBottom: 32,
        boxShadow: '0 4px 0 0 rgba(88, 204, 2, 0.2)',
      }}>
        <img src={aptisSvg} alt="" aria-hidden="true"
          style={{ width: 48, height: 'auto' }} />
        <span style={{
          fontSize: 'var(--text-lg)', fontWeight: 800,
          color: 'var(--color-brand-primary-dark)',
        }}>Aptis Exam Preparation</span>
      </div>

      <h1 style={{
        fontSize: 'var(--text-4xl)', fontWeight: 800,
        color: 'var(--color-text-primary)', margin: '0 0 8px', textAlign: 'center',
      }}>
        {step === 'exam' ? 'Choose your exam' : 'Pick a skill'}
      </h1>
      <p style={{
        fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)',
        margin: '0 0 32px', textAlign: 'center',
      }}>
        {step === 'exam'
          ? 'Select an exam from the 10 available'
          : `Exam ${selectedExam} — what would you like to practise?`}
      </p>

      {step === 'exam' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16, maxWidth: 560, width: '100%',
        }}>
          {Array.from({ length: TOTAL_EXAMS }, (_, i) => i + 1).map(num => (
            <button key={num} onClick={() => handleExamSelect(num)}
              style={{
                aspectRatio: '1', borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-border-default)',
                background: '#FFFFFF', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
                boxShadow: '0 4px 0 0 var(--color-border-default)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-brand-primary)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 0 0 rgba(88,204,2,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border-default)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 0 0 var(--color-border-default)'
              }}
            >
              <img src={BADGES[num]} alt={`Exam ${num}`} aria-hidden="true"
                style={{ width: 32, height: 'auto', marginBottom: 4 }} />
              <span style={{
                fontSize: 'var(--text-2xl)', fontWeight: 800,
                color: 'var(--color-text-primary)',
              }}>{String(num).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      )}

      {step === 'skill' && (
        <>
          <button onClick={() => setStep('exam')} style={{
            background: 'none', border: 'none',
            color: 'var(--color-brand-primary)', fontWeight: 700,
            fontSize: 'var(--text-sm)', cursor: 'pointer',
            marginBottom: 24, padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
          }}>← Back to exam selection</button>
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: 12, maxWidth: 400, width: '100%',
          }}>
            {SKILLS.map(({ key, label, icon }) => (
              <button key={key} onClick={() => handleSkillSelect(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 24px', borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--color-border-default)',
                  background: '#FFFFFF', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                  boxShadow: '0 4px 0 0 var(--color-border-default)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 0 0 rgba(88,204,2,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border-default)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 0 0 var(--color-border-default)'
                }}
              >
                <span style={{ fontSize: 28 }}>{icon}</span>
                <span style={{
                  fontSize: 'var(--text-lg)', fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
