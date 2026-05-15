import React, { useState, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  Microphone,
  StopCircle,
  ArrowsClockwise,
  ArrowRight,
  Lightning,
  Sparkle,
  Pause,
  SpeakerHigh,
  Warning,
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/pandas/panda-speaking.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import { SpeakingReviewZone } from '../SpeakingReviewZone'
import { VocabSubExercise } from 'components/ui/VocabSubExercise'
import styles from './SpeakingExercise.module.scss'

// ── Phase state machine ────────────────────────────────────────────────────────
//  LISTEN → (tap Start) → COUNTDOWN → (auto) → RECORDING → (stop/auto) →
//  PROCESSING → (1.5s) → REVIEW → (retry → LISTEN | continue → next)
const PHASE = {
  LISTEN:     'listen',
  COUNTDOWN:  'countdown',
  RECORDING:  'recording',
  PROCESSING: 'processing',
  REVIEW:     'review',
}

const MAX_DURATION   = 10              // seconds
const COUNTDOWN_FROM = 3
const WAVEFORM_BARS  = 28
const TIMER_RADIUS   = 36
const TIMER_CIRC     = 2 * Math.PI * TIMER_RADIUS

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(s) { return `0:${String(s).padStart(2, '0')}` }


// ── PandaGuide ─────────────────────────────────────────────────────────────────
function PandaGuide({ mood, message, pointing = false }) {
  return (
    <div className={styles.pandaWrapper}>
      {message && (
        <div className={styles.speechBubble} data-mood={mood} key={message} role="status">
          {message}
        </div>
      )}
      {/* Radial glow ring behind panda — mood-tinted */}
      <div className={styles.pandaGlow} data-mood={mood} aria-hidden="true" />
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        className={clsx(styles.pandaDecor, {
          [styles.pandaIdle]:  mood === 'idle',
          [styles.pandaHappy]: mood === 'happy',
          [styles.pandaOops]:  mood === 'oops',
        })}
      />
      {/* Downward chevrons — only in LISTEN phase, guides eye toward the mic */}
      {pointing && (
        <div className={styles.pandaArrow} aria-hidden="true">
          <span />
          <span />
        </div>
      )}
    </div>
  )
}


// ── SpeakingExerciseView ───────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{ phrase, reference?, topic?, translation?, description? }]
 *   xpReward   — XP per question (default 20)
 *   onComplete — () => void
 *   onQuit     — () => void
 */
export function SpeakingExerciseView({
  exercises = [],
  xpReward  = 20,
  onComplete,
  onQuit,
}) {
  const [idx,          setIdx]          = useState(0)
  const [phase,        setPhase]        = useState(PHASE.LISTEN)
  const [hasListened,  setHasListened]  = useState(false)
  const [refPlaying,   setRefPlaying]   = useState(false)
  const [countdown,    setCountdown]    = useState(COUNTDOWN_FROM)
  const [timeLeft,     setTimeLeft]     = useState(MAX_DURATION)
  const [micError,     setMicError]     = useState(null)   // null | 'denied' | 'unsupported'
  const [recordingUrl, setRecordingUrl] = useState(null)

  const exercise = exercises[idx]
  const total    = exercises.length
  const isVocab  = exercise?.questions?.length > 0
  const isValid  = exercise && (isVocab || (exercise.prompt || exercise.audioUrl))

  // ── Refs ─────────────────────────────────────────────────────────────────────
  const recorderRef    = useRef(null)
  const streamRef      = useRef(null)
  const audioCtxRef    = useRef(null)
  const analyserRef    = useRef(null)
  const rafRef         = useRef(null)
  const barRefs        = useRef([])
  const chunksRef      = useRef([])
  const timerRef       = useRef(null)
  const prevUrlRef     = useRef(null)
  const refAudioRef    = useRef(null)   // reference audio element

  // ── Global cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      audioCtxRef.current?.close()
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current)
    }
  }, [])

  // ── Reset on question change ──────────────────────────────────────────────────
  useEffect(() => {
    setPhase(PHASE.LISTEN)
    setHasListened(!exercise?.reference)   // skip listen step if no reference audio
    setRefPlaying(false)
    setCountdown(COUNTDOWN_FROM)
    setTimeLeft(MAX_DURATION)
    setMicError(null)
    cancelAnimationFrame(rafRef.current)
    clearTimeout(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close()
    barRefs.current.forEach(b => { if (b) b.style.height = '' })
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current)
      prevUrlRef.current = null
    }
    setRecordingUrl(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  // ── Waveform animation (driven by AnalyserNode) ───────────────────────────────
  const stopWaveform = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    barRefs.current.forEach(b => { if (b) b.style.height = '' })
  }, [])

  const startWaveform = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const bars = barRefs.current.filter(Boolean)
    const frame = () => {
      analyser.getByteFrequencyData(data)
      bars.forEach((bar, i) => {
        const bin   = Math.floor((i / bars.length) * data.length)
        const value = Math.max(0.07, data[bin] / 255)
        bar.style.height = `${value * 100}%`
      })
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
  }, [])

  // ── Stop stream + audio context ───────────────────────────────────────────────
  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current  = null
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    analyserRef.current = null
    recorderRef.current = null
  }, [])

  // ── Reference audio toggle ───────────────────────────────────────────────────
  const toggleReference = useCallback(() => {
    const a = refAudioRef.current
    if (!a) { setHasListened(true); return }
    if (refPlaying) {
      a.pause(); setRefPlaying(false)
    } else {
      a.play(); setRefPlaying(true); setHasListened(true)
    }
  }, [refPlaying])

  // ── Core recording flow ──────────────────────────────────────────────────────
  const beginRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('unsupported'); setPhase(PHASE.LISTEN); return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Wire up Web Audio analyser for live waveform
      const ctx      = new AudioContext()
      const source   = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize            = 64
      analyser.smoothingTimeConstant = 0.75
      source.connect(analyser)
      audioCtxRef.current = ctx
      analyserRef.current = analyser

      // MediaRecorder
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url  = URL.createObjectURL(blob)
        prevUrlRef.current = url
        setRecordingUrl(url)
        stopWaveform()
        releaseStream()
        setPhase(PHASE.PROCESSING)
        timerRef.current = setTimeout(() => setPhase(PHASE.REVIEW), 1500)
      }
      recorder.start()
      recorderRef.current = recorder

      setPhase(PHASE.RECORDING)
      setTimeLeft(MAX_DURATION)
      startWaveform()
    } catch (err) {
      const denied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
      setMicError(denied ? 'denied' : 'unsupported')
      setPhase(PHASE.LISTEN)
    }
  }, [startWaveform, stopWaveform, releaseStream])

  const startCountdown = useCallback(() => {
    setPhase(PHASE.COUNTDOWN)
    setCountdown(COUNTDOWN_FROM)
    let count = COUNTDOWN_FROM
    const tick = () => {
      count -= 1
      setCountdown(count)
      if (count > 0) {
        timerRef.current = setTimeout(tick, 1000)
      } else {
        timerRef.current = setTimeout(beginRecording, 600)
      }
    }
    timerRef.current = setTimeout(tick, 1000)
  }, [beginRecording])

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
  }, [])

  // ── Recording countdown timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.RECORDING) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          recorderRef.current?.stop()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  // ── Navigation ────────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setPhase(PHASE.LISTEN)
    setHasListened(!exercise?.reference)
    setRefPlaying(false)
    setRecordingUrl(null)
    setCountdown(COUNTDOWN_FROM)
    setTimeLeft(MAX_DURATION)
    setMicError(null)
  }, [exercise])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) onComplete?.()
    else setIdx(i => i + 1)
  }, [idx, total, onComplete])

  if (!exercise) return null
  if (!isValid) return null

  if (isVocab) {
    return (
      <div className={styles.root}>
        <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />
        <VocabSubExercise exercise={exercise} xpReward={xpReward}
          onContinue={() => {
            if (idx + 1 >= total) onComplete?.()
            else setIdx(i => i + 1)
          }} />
      </div>
    )
  }

  // ── Derived UI values ─────────────────────────────────────────────────────────
  const pandaMood    = phase === PHASE.REVIEW ? 'happy' : 'idle'
  const pandaMessage =
    phase === PHASE.LISTEN      ? (hasListened ? 'Now tap the mic! 🎤' : exercise?.reference ? 'Listen first, then speak 👂' : 'Tap the mic to begin 🎤')
    : phase === PHASE.COUNTDOWN ? 'Get ready…'
    : phase === PHASE.RECORDING ? null
    : phase === PHASE.PROCESSING? 'Analyzing your speech…'
    : /* REVIEW */                'Nicely done! 🌟'

  const instruction =
    phase === PHASE.LISTEN      ? 'Tap the mic and repeat the phrase'
    : phase === PHASE.COUNTDOWN ? 'Get ready to speak…'
    : phase === PHASE.RECORDING ? 'Speak clearly — I can hear you'
    : phase === PHASE.PROCESSING? 'Reviewing your pronunciation…'
    : /* REVIEW */                'Your response is under review'

  const timerOffset  = TIMER_CIRC * (1 - timeLeft / MAX_DURATION)

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>
        {/* ── Skill badge + XP ──────────────────────────────────────── */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <Sparkle weight="fill" size={12} aria-hidden="true" />
            Speaking
          </span>
          <span className={styles.xpBadge}>
            <Lightning weight="fill" size={13} aria-hidden="true" />
            +{xpReward} XP
          </span>
        </div>

        {/* ── Dynamic instruction ───────────────────────────────────── */}
        <p className={styles.instruction} key={instruction}>{instruction}</p>

        {/* ── Panda — hidden during recording to keep focus on mic ─── */}
        {phase !== PHASE.RECORDING && (
          <PandaGuide
            mood={pandaMood}
            message={pandaMessage}
            pointing={phase === PHASE.LISTEN}
          />
        )}

        {/* ── Phrase card — always visible ──────────────────────────── */}
        <div className={styles.phraseCard}>
          {exercise.topic && (
            <span className={styles.topicBadge}>{exercise.topic}</span>
          )}
          <p className={styles.phrase}>"{exercise.phrase}"</p>
          {exercise.translation && (
            <p className={styles.translation}>{exercise.translation}</p>
          )}
        </div>

        {/* ── Main interaction card — morphs per phase ─────────────── */}
        <div className={styles.card} data-phase={phase}>

          {/* ─── LISTEN: mic hero + idle waveform ──────────────────── */}
          {phase === PHASE.LISTEN && (
            <div className={styles.listenZone}>

              {/* Compact reference player — secondary, only if audio exists */}
              {exercise.reference && (
                <>
                  <audio
                    ref={refAudioRef}
                    src={exercise.reference}
                    onEnded={() => { setRefPlaying(false); setHasListened(true) }}
                    onPause={() => setRefPlaying(false)}
                  />
                  <button
                    className={styles.nativeBtn}
                    onClick={toggleReference}
                    aria-label={refPlaying ? 'Pause native speaker' : 'Play native speaker example'}
                  >
                    <span className={styles.nativeBtnIcon}>
                      {refPlaying
                        ? <Pause      weight="fill" size={18} aria-hidden="true" />
                        : <SpeakerHigh weight="fill" size={18} aria-hidden="true" />
                      }
                    </span>
                    <span className={styles.nativeBtnText}>
                      <strong>{refPlaying ? 'Playing…' : 'Hear native speaker'}</strong>
                      <small>{hasListened ? 'Listen again' : 'Tap to play first'}</small>
                    </span>
                  </button>
                </>
              )}

              {/* Idle decorative waveform — signals "audio zone" */}
              <div className={styles.idleWave} aria-hidden="true">
                {Array.from({ length: 20 }, (_, i) => (
                  <span key={i} className={styles.idleBar} style={{ '--bar-idx': i }} />
                ))}
              </div>

              {/* Hero mic button — the PRIMARY interaction trigger */}
              <div className={styles.micHeroWrap}>
                <span className={styles.pulseRing} style={{ '--ring-delay': '0ms' }}    aria-hidden="true" />
                <span className={styles.pulseRing} style={{ '--ring-delay': '700ms' }}  aria-hidden="true" />
                <span className={styles.pulseRing} style={{ '--ring-delay': '1400ms' }} aria-hidden="true" />
                <button
                  className={styles.micHeroBtn}
                  onClick={startCountdown}
                  disabled={!!micError}
                  aria-label="Start speaking — tap to record"
                >
                  <Microphone weight="fill" size={36} aria-hidden="true" />
                </button>
              </div>

              {/* Microcopy */}
              <div className={styles.micCopyWrap}>
                <p className={styles.micCopy}>Say it out loud 🎤</p>
                <p className={styles.micSub}>Repeat the sentence clearly</p>
              </div>

              {micError && (
                <div className={styles.micError} role="alert">
                  <Warning weight="fill" size={16} aria-hidden="true" />
                  {micError === 'denied'
                    ? 'Microphone access denied. Allow mic access and try again.'
                    : 'Microphone is not supported in this browser.'}
                </div>
              )}
            </div>
          )}

          {/* ─── COUNTDOWN: 3-2-1-GO! ──────────────────────────────── */}
          {phase === PHASE.COUNTDOWN && (
            <div className={styles.countdownZone} aria-live="assertive" aria-atomic="true">
              <span className={styles.countdownNum} key={countdown}>
                {countdown === 0 ? 'GO!' : countdown}
              </span>
              <p className={styles.countdownSub}>
                {countdown === 0 ? 'Start speaking now!' : 'Starting in…'}
              </p>
            </div>
          )}

          {/* ─── RECORDING: waveform + timer ring + stop ────────────── */}
          {phase === PHASE.RECORDING && (
            <div className={styles.recordingZone}>
              {/* Pulsing recording indicator */}
              <div className={styles.recIndicator} aria-hidden="true">
                <span className={styles.recDot} />
                <span className={styles.recLabel}>REC</span>
              </div>

              {/* Timer ring wrapping stop button */}
              <div className={styles.timerWrap}>
                <svg
                  className={styles.timerSvg}
                  viewBox="0 0 88 88"
                  width="88"
                  height="88"
                  aria-hidden="true"
                >
                  <circle cx="44" cy="44" r={TIMER_RADIUS} stroke="#F1F5F9" strokeWidth="4" fill="none" />
                  <circle
                    cx="44" cy="44" r={TIMER_RADIUS}
                    stroke="#FB7185"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={TIMER_CIRC}
                    strokeDashoffset={timerOffset}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '44px 44px',
                      transition: 'stroke-dashoffset 0.9s linear',
                    }}
                  />
                </svg>
                <button
                  className={styles.stopBtn}
                  onClick={stopRecording}
                  aria-label="Stop recording"
                >
                  <StopCircle weight="fill" size={28} aria-hidden="true" />
                </button>
              </div>

              {/* Time remaining */}
              <span className={styles.timeLeft} aria-live="polite" aria-atomic="true">
                {fmt(timeLeft)}
              </span>

              {/* Live waveform — heights driven by AnalyserNode */}
              <div className={styles.waveformBars} aria-hidden="true">
                {Array.from({ length: WAVEFORM_BARS }, (_, i) => (
                  <span
                    key={i}
                    className={styles.waveBar}
                    ref={el => { barRefs.current[i] = el }}
                    style={{ '--bar-idx': i }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── PROCESSING: animated analysis bars ─────────────────── */}
          {phase === PHASE.PROCESSING && (
            <div className={styles.processingZone} role="status" aria-live="polite">
              <div className={styles.processingBars} aria-hidden="true">
                {Array.from({ length: WAVEFORM_BARS }, (_, i) => (
                  <span key={i} className={styles.procBar} style={{ '--bar-idx': i }} />
                ))}
              </div>
              <p className={styles.processingLabel}>Analyzing your pronunciation…</p>
            </div>
          )}

          {/* ─── REVIEW: shared human-review workflow ────────────────── */}
          {phase === PHASE.REVIEW && (
            <SpeakingReviewZone recordingUrl={recordingUrl} />
          )}

        </div>{/* /card */}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        {phase === PHASE.REVIEW && (
          <div className={styles.reviewActions}>
            <button className={styles.retryBtn} onClick={handleRetry}>
              <ArrowsClockwise weight="bold" size={16} aria-hidden="true" />
              Try again
            </button>
            <button className={styles.continueBtn} onClick={handleContinue}>
              Continue
              <ArrowRight weight="bold" size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
