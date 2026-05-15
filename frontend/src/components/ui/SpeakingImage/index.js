import React, { useState, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  CheckCircle,
  ArrowRight,
  Lightning,
  Microphone,
  StopCircle,
  ArrowsClockwise
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda-speaking.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import { SpeakingReviewZone } from '../SpeakingReviewZone'
import styles from './SpeakingImage.module.scss'

// ── Constants ──────────────────────────────────────────────────────────────────
const PHASE = { IDLE: 'idle', RECORDING: 'recording', REVIEW: 'review' }

const MAX_SECONDS = 90
const WAVEFORM_BARS = 28
const TIMER_RADIUS = 34 // SVG ring radius
const TIMER_CIRC = 2 * Math.PI * TIMER_RADIUS // full circumference

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// ── PandaGuide ─────────────────────────────────────────────────────────────────
// Mirrors the centered layout of SpeakingExercise.
function PandaGuide({ mood, message, pointing = false }) {
  return (
    <div className={styles.pandaWrapper}>
      {message && (
        <div
          className={styles.speechBubble}
          data-mood={mood}
          key={message}
          role="status"
        >
          {message}
        </div>
      )}
      <div className={styles.pandaGlow} data-mood={mood} aria-hidden="true" />
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        className={clsx(styles.pandaDecor, {
          [styles.pandaIdle]: mood === 'idle',
          [styles.pandaHappy]: mood === 'happy'
        })}
      />
      {pointing && (
        <div className={styles.pandaArrow} aria-hidden="true">
          <span />
          <span />
        </div>
      )}
    </div>
  )
}

// ── SpeakingImageView ──────────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{
 *     image:    string  — URL or import path
 *     imageAlt: string  — a11y description of the image
 *     title:    string
 *     prompt?:  string  — overlay text on image (default: 'Describe what you see')
 *     hints?:   string[]
 *   }]
 *   xpReward   — number  (default 25)
 *   onComplete — () => void
 *   onQuit     — () => void
 */
export function SpeakingImageView({
  exercises = [],
  xpReward = 25,
  onComplete,
  onQuit
}) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [seconds, setSeconds] = useState(0)
  const [recordingUrl, setRecordingUrl] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const analyserRef = useRef(null) // Web Audio AnalyserNode
  const barRefs = useRef([]) // DOM refs for live waveform bars
  const animFrameRef = useRef(null) // rAF handle

  const exercise = exercises[idx]
  const total = exercises.length

  // Timer ring fills clockwise as elapsed seconds grow toward MAX_SECONDS
  const timerOffset = TIMER_CIRC * (1 - seconds / MAX_SECONDS)

  useEffect(() => {
    setPhase(PHASE.IDLE)
    setSeconds(0)
    setRecordingUrl(null)
  }, [idx])

  useEffect(
    () => () => {
      clearInterval(timerRef.current)
      cancelAnimationFrame(animFrameRef.current)
    },
    []
  )

  // ── Live waveform ──────────────────────────────────────────────────────────
  const drawWave = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)
    const step = Math.floor(data.length / WAVEFORM_BARS)
    barRefs.current.forEach((bar, i) => {
      if (!bar) return
      const value = data[i * step] / 255 // 0 → 1
      bar.style.height = `${Math.max(6, value * 100)}%`
    })
    animFrameRef.current = requestAnimationFrame(drawWave)
  }, [])

  // ── Recording handlers ─────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current)
    cancelAnimationFrame(animFrameRef.current)
    analyserRef.current = null
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setPhase(PHASE.REVIEW)
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      // Wire up AnalyserNode — graceful fallback if AudioContext unavailable
      try {
        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 64
        source.connect(analyser)
        analyserRef.current = analyser
        drawWave()
      } catch (_) {
        /* waveform bars bgncstay flat — no crash */
      }

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordingUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start()
      setPhase(PHASE.RECORDING)
      setSeconds(0)

      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s >= MAX_SECONDS - 1) {
            stopRecording()
            return s
          }
          return s + 1
        })
      }, 1000)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }, [stopRecording, drawWave])

  const handleRetry = useCallback(() => {
    setRecordingUrl(null)
    setSeconds(0)
    setPhase(PHASE.IDLE)
  }, [])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) onComplete?.()
    else setIdx(i => i + 1)
  }, [idx, total, onComplete])

  if (!exercise) return null

  const hints = exercise.hints ?? [
    'What actions are happening?',
    'Where is this?',
    'Who can you see?',
    'What details stand out?'
  ]

  const pandaMood = phase === PHASE.REVIEW ? 'happy' : 'idle'
  const pandaMessage =
    phase === PHASE.RECORDING
      ? "I'm listening… keep going! 🎙️"
      : phase === PHASE.REVIEW
        ? 'Nicely done! 🌟'
        : 'Describe everything you see — people, place and details! 🖼️'

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>
        {/* ── Top row ──────────────────────────────────────────────────────── */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <Microphone weight="fill" size={12} aria-hidden="true" />
            Speaking
          </span>
          <span className={styles.xpBadge}>
            <Lightning weight="fill" size={13} aria-hidden="true" />+
            {xpReward} XP
          </span>
        </div>

        {/* ── Panda — hidden during recording so focus stays on the panel ── */}
        {phase !== PHASE.RECORDING && (
          <PandaGuide
            mood={pandaMood}
            message={pandaMessage}
            pointing={phase === PHASE.IDLE}
          />
        )}

        <div className={styles.imageSection}>
          {/* ── Image — always visible, stays clean during recording ──────── */}
          <div
            className={clsx(styles.imageWrap, {
              [styles.imageWrap_recording]: phase === PHASE.RECORDING,
              [styles.imageWrap_done]: phase === PHASE.REVIEW
            })}
          >
            <img
              src={exercise.image}
              alt={exercise.imageAlt}
              className={styles.image}
              draggable={false}
              loading="eager"
            />

            {/* Done badge — bottom left of image */}
            {phase === PHASE.REVIEW && (
              <div className={styles.doneBadge}>
                <CheckCircle weight="fill" size={13} aria-hidden="true" />
                {formatTime(seconds)} recorded
              </div>
            )}

            {/* Idle prompt — subtle frosted text at image bottom */}
            {phase === PHASE.IDLE && (
              <div className={styles.idleOverlay}>
                <p className={styles.idlePrompt}>
                  {exercise.prompt ?? 'Describe what you see'}
                </p>
              </div>
            )}
          </div>

          {/* ── Recording card — morphs per phase ────────────────────────── */}
          {/* IDLE: mic hero */}
          {phase === PHASE.IDLE && (
            <div className={styles.recordingCard} data-phase="idle">
              <div className={styles.idleZone}>
                <div className={styles.micHeroWrap}>
                  <span
                    className={styles.pulseRing}
                    style={{ '--ring-delay': '0ms' }}
                    aria-hidden="true"
                  />
                  <span
                    className={styles.pulseRing}
                    style={{ '--ring-delay': '700ms' }}
                    aria-hidden="true"
                  />
                  <span
                    className={styles.pulseRing}
                    style={{ '--ring-delay': '1400ms' }}
                    aria-hidden="true"
                  />
                  <button
                    className={styles.micHeroBtn}
                    onClick={startRecording}
                    aria-label="Tap to start recording your description"
                  >
                    <Microphone
                      weight="fill"
                      size={34}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <p className={styles.micLabel}>Tap to speak</p>
              </div>
            </div>
          )}

          {/* RECORDING: REC + waveform + timer ring + stop */}
          {phase === PHASE.RECORDING && (
            <div className={styles.recordingCard} data-phase="recording">
              <div className={styles.recZone}>
                {/* Row 1 — REC pill + elapsed time */}
                <div className={styles.recTopRow}>
                  <div className={styles.recIndicator} aria-hidden="true">
                    <span className={styles.recDot} />
                    <span className={styles.recLabel}>REC</span>
                  </div>
                  <span
                    className={styles.timeLeft}
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={`Recording time: ${formatTime(seconds)}`}
                  >
                    {formatTime(seconds)}
                  </span>
                </div>

                {/* Row 2 — live waveform bars (AnalyserNode-driven) */}
                <div className={styles.waveformBars} aria-hidden="true">
                  {Array.from({ length: WAVEFORM_BARS }, (_, i) => (
                    <span
                      key={i}
                      className={styles.recBar}
                      ref={el => {
                        barRefs.current[i] = el
                      }}
                    />
                  ))}
                </div>

                {/* Row 3 — SVG progress ring wrapping stop button */}
                <div className={styles.timerWrap}>
                  <svg
                    className={styles.timerSvg}
                    viewBox="0 0 88 88"
                    width="88"
                    height="88"
                    aria-hidden="true"
                  >
                    {/* Track */}
                    <circle
                      cx="44"
                      cy="44"
                      r={TIMER_RADIUS}
                      stroke="#FCE7F3"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Progress — fills as seconds increase */}
                    <circle
                      cx="44"
                      cy="44"
                      r={TIMER_RADIUS}
                      stroke="#FB7185"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={TIMER_CIRC}
                      strokeDashoffset={timerOffset}
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '44px 44px',
                        transition: 'stroke-dashoffset 0.9s linear'
                      }}
                    />
                  </svg>
                  <button
                    className={styles.stopBtnCard}
                    onClick={stopRecording}
                    aria-label="Stop recording"
                  >
                    <StopCircle
                      weight="fill"
                      size={26}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Hint chips — IDLE only ────────────────────────────────────── */}
          {phase === PHASE.IDLE && (
            <div
              className={styles.hintRow}
              role="list"
              aria-label="Description tips"
            >
              {hints.map(hint => (
                <span key={hint} className={styles.hintChip} role="listitem">
                  {hint}
                </span>
              ))}
            </div>
          )}

          {/* ── REVIEW: shared review zone + actions ─────────────────────── */}
          {phase === PHASE.REVIEW && (
            <SpeakingReviewZone recordingUrl={recordingUrl} />
          )}

          {phase === PHASE.REVIEW && (
            <div className={styles.doneActions}>
              <button className={styles.retryBtn} onClick={handleRetry}>
                <ArrowsClockwise
                  weight="bold"
                  size={16}
                  aria-hidden="true"
                />
                Try again
              </button>
              <button
                className={styles.continueBtn}
                onClick={handleContinue}
                autoFocus
              >
                Continue
                <ArrowRight weight="bold" size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
