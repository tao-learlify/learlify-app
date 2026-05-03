import React, { useState, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  PlayIcon,
  PauseIcon,
  ArrowsClockwiseIcon,
  SpeakerHighIcon,
  SparkleIcon,
  LightningIcon,
  CheckIcon,
  XCircleIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import pandaImg from 'assets/illustrations/skills/listening.svg'
import { ExerciseHeader } from 'components/ui/GrammarExercise'
import styles from './ListeningExercise.module.scss'

// ── Phase — question lifecycle ─────────────────────────────────────────────────
const PHASE = {
  IDLE:     'idle',     // no answer selected
  SELECTED: 'selected', // answer chosen, awaiting check
  CHECKED:  'checked',  // submitted, feedback visible
}

// ── Player — audio playback state ──────────────────────────────────────────────
const PLAYER = {
  IDLE:     'idle',     // never played
  PLAYING:  'playing',  // actively playing
  PAUSED:   'paused',   // paused mid-play
  FINISHED: 'finished', // reached the end
}

// ── Messages ───────────────────────────────────────────────────────────────────
const CORRECT_MSGS = [
  'Great listening! 🎧',
  'You caught every word!',
  'Well heard! 🌟',
  'Excellent comprehension!',
  'Perfect answer! 🎉',
]

const ERROR_MSGS = [
  'Not quite right',
  'Good try! Listen again',
  'Almost — replay the audio',
  'Close! Give it another listen',
]

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── Helpers ────────────────────────────────────────────────────────────────────
function stripAnswerPrefix(str) { return str.replace(/^[A-Za-z]\.\s*/, '').trim() }
function stripQuestionNumber(str) { return str.replace(/^\s*\d+\.\s*/, '').trim() }

function formatTime(t) {
  if (!t || !isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

// Wave bar stagger delays — deliberately non-uniform for organic feel
const WAVE_DELAYS = [0, 80, 160, 40, 120, 60, 200]

// ── PandaGuide ─────────────────────────────────────────────────────────────────
function PandaGuide({ mood, message }) {
  return (
    <div className={styles.pandaWrapper}>
      {message && (
        <div className={styles.speechBubble} data-mood={mood} key={message}>
          {message}
        </div>
      )}
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
    </div>
  )
}

// ── AudioPlayer ────────────────────────────────────────────────────────────────
// forwardRef exposes a replay() method so the feedback banner can trigger it.
const AudioPlayer = React.forwardRef(function AudioPlayer({ src, onFirstPlay }, ref) {
  const audioEl          = useRef(null)
  const hasPlayedOnceRef = useRef(false)
  const [playerState, setPlayerState] = useState(PLAYER.IDLE)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)

  // Reset completely when audio source changes (new question)
  useEffect(() => {
    const audio = audioEl.current
    if (!audio) return
    audio.load()
    setPlayerState(PLAYER.IDLE)
    setCurrentTime(0)
    setDuration(0)
    hasPlayedOnceRef.current = false
  }, [src])

  // Attach / detach DOM event listeners
  useEffect(() => {
    const audio = audioEl.current
    if (!audio) return

    const onMeta  = ()  => setDuration(audio.duration)
    const onTime  = ()  => setCurrentTime(audio.currentTime)
    const onEnded = ()  => { setPlayerState(PLAYER.FINISHED); setCurrentTime(audio.duration) }
    const onPlay  = ()  => {
      setPlayerState(PLAYER.PLAYING)
      if (!hasPlayedOnceRef.current) {
        hasPlayedOnceRef.current = true
        onFirstPlay?.()
      }
    }
    const onPause = ()  => { if (!audio.ended) setPlayerState(PLAYER.PAUSED) }

    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('timeupdate',     onTime)
    audio.addEventListener('ended',          onEnded)
    audio.addEventListener('play',           onPlay)
    audio.addEventListener('pause',          onPause)

    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('timeupdate',     onTime)
      audio.removeEventListener('ended',          onEnded)
      audio.removeEventListener('play',           onPlay)
      audio.removeEventListener('pause',          onPause)
    }
  }, [])

  // Expose replay() to parent via ref
  React.useImperativeHandle(ref, () => ({
    replay() {
      const audio = audioEl.current
      if (!audio) return
      audio.currentTime = 0
      audio.play()
    },
  }))

  const togglePlay = useCallback(() => {
    const audio = audioEl.current
    if (!audio) return
    if (playerState === PLAYER.PLAYING) {
      audio.pause()
    } else if (playerState === PLAYER.FINISHED) {
      audio.currentTime = 0
      audio.play()
    } else {
      audio.play()
    }
  }, [playerState])

  // Click-to-seek on the progress track
  const handleSeek = useCallback(e => {
    const audio = audioEl.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * duration
  }, [duration])

  const progress   = duration > 0 ? currentTime / duration : 0
  const isPlaying  = playerState === PLAYER.PLAYING
  const isFinished = playerState === PLAYER.FINISHED

  return (
    <div className={styles.playerCard} data-state={playerState} aria-label="Audio player">
      {/* Native audio element — hidden, controlled via JS */}
      <audio ref={audioEl} src={src || undefined} preload="metadata" />

      {/* ── Top row: audio label + animated waveform ────────────── */}
      <div className={styles.playerTop}>
        <span className={styles.audioLabel}>
          <SpeakerHighIcon weight="fill" size={14} aria-hidden="true" />
          Audio
        </span>
        <div
          className={styles.waveform}
          data-playing={String(isPlaying)}
          aria-hidden="true"
        >
          {WAVE_DELAYS.map((delay, i) => (
            <span key={i} className={styles.waveBar} style={{ '--wave-delay': `${delay}ms` }} />
          ))}
        </div>
      </div>

      {/* ── Controls: play button + progress bar ─────────────────── */}
      <div className={styles.playerControls}>
        <button
          className={styles.playBtn}
          onClick={togglePlay}
          aria-label={
            isPlaying  ? 'Pause audio' :
            isFinished ? 'Replay audio' :
                         'Play audio'
          }
        >
          {isPlaying  ? <PauseIcon weight="fill" size={22} /> :
           isFinished ? <ArrowsClockwiseIcon weight="bold" size={18} /> :
                        <PlayIcon weight="fill" size={22} />}
        </button>

        <div className={styles.progressArea}>
          <div
            className={styles.progressTrack}
            onClick={handleSeek}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          >
            <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
            {progress > 0 && (
              <div className={styles.progressDot} style={{ left: `${progress * 100}%` }} />
            )}
          </div>
          <div className={styles.timeRow} aria-hidden="true">
            <span className={styles.timeValue}>{formatTime(currentTime)}</span>
            <span className={styles.timeValue}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* ── State hint ───────────────────────────────────────────── */}
      <p className={styles.playerHint} aria-live="polite">
        {playerState === PLAYER.IDLE     && 'Tap play to hear the audio'}
        {playerState === PLAYER.PLAYING  && 'Playing…'}
        {playerState === PLAYER.PAUSED   && 'Paused — tap to resume'}
        {playerState === PLAYER.FINISHED && 'Done — tap to replay'}
      </p>
    </div>
  )
})

// ── AnswerOption ───────────────────────────────────────────────────────────────
function AnswerOption({ text, letter, isSelected, isChecked, isCorrect, onClick }) {
  let state = 'idle'
  if (isSelected && !isChecked)             state = 'selected'
  if (isChecked  && isCorrect)              state = 'correct'
  if (isChecked  && isSelected && !isCorrect) state = 'incorrect'

  return (
    <button
      className={styles.option}
      data-state={state}
      disabled={isChecked}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={[
        text,
        isChecked && isCorrect                  ? '(correct answer)'        : '',
        isChecked && isSelected && !isCorrect   ? '(your answer, incorrect)' : '',
      ].filter(Boolean).join(' ')}
    >
      <span className={styles.optionLetter} aria-hidden="true">
        {isChecked && isCorrect                  ? <CheckIcon  weight="bold" size={14} /> : null}
        {isChecked && isSelected && !isCorrect   ? <XCircleIcon weight="bold" size={14} /> : null}
        {!isChecked ? letter : null}
      </span>
      <span className={styles.optionText}>{text}</span>
    </button>
  )
}

// ── ListeningFeedbackBanner ────────────────────────────────────────────────────
function ListeningFeedbackBanner({
  isCorrect,
  message,
  xpReward,
  correctAnswer,
  description,
  onContinue,
  onReplayAudio,
}) {
  return (
    <div className={styles.feedback} data-correct={isCorrect} role="status" aria-live="assertive">
      <div className={styles.feedbackBody}>
        <div className={styles.feedbackIcon} data-correct={isCorrect}>
          {isCorrect
            ? <CheckIcon  weight="bold" size={20} aria-hidden="true" />
            : <XCircleIcon weight="bold" size={20} aria-hidden="true" />
          }
        </div>
        <div>
          <p className={styles.feedbackTitle}>{message}</p>
          {isCorrect && (
            <span className={styles.feedbackXp} aria-label={`+${xpReward} XP earned`}>
              <LightningIcon weight="fill" size={12} aria-hidden="true" />
              +{xpReward} XP earned
            </span>
          )}
          {!isCorrect && correctAnswer && (
            <p className={styles.feedbackCorrect}>Correct: {correctAnswer}</p>
          )}
          {!isCorrect && (
            <button className={styles.replayBtn} onClick={onReplayAudio}>
              <ArrowsClockwiseIcon weight="bold" size={12} aria-hidden="true" />
              Listen again
            </button>
          )}
          {description && <p className={styles.feedbackDesc}>{description}</p>}
        </div>
      </div>

      <button
        className={styles.continueBtn}
        data-correct={isCorrect}
        onClick={onContinue}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      >
        Continue
        <ArrowRightIcon weight="bold" size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

// ── ListeningExerciseView ──────────────────────────────────────────────────────
/**
 * Props:
 *   exercises  — [{ audioUrl, title, answers, correct, description }]
 *   xpReward   — XP per correct answer (default 10)
 *   onComplete — () => void  called after last question
 *   onQuit     — () => void  called when × is pressed
 */
export function ListeningExerciseView({
  exercises = [],
  xpReward  = 10,
  onComplete,
  onQuit,
}) {
  const [idx,            setIdx]           = useState(0)
  const [selected,       setSelected]      = useState(null)
  const [phase,          setPhase]         = useState(PHASE.IDLE)
  const [feedbackMsg,    setFeedbackMsg]   = useState('')
  const [hasPlayedOnce,  setHasPlayedOnce] = useState(false)
  const [earlyClickHint, setEarlyClickHint] = useState(false)

  const playerRef      = useRef(null)
  const earlyHintTimer = useRef(null)

  const exercise = exercises[idx]
  const total    = exercises.length

  const isCorrect  = selected === exercise?.correct
  const correctText = exercise
    ? stripAnswerPrefix(exercise.answers[exercise.correct])
    : ''

  const handleFirstPlay = useCallback(() => {
    setHasPlayedOnce(true)
    setEarlyClickHint(false)
    clearTimeout(earlyHintTimer.current)
  }, [])

  const handleSelect = useCallback(answerIdx => {
    if (phase === PHASE.CHECKED) return
    if (!hasPlayedOnce) {
      setEarlyClickHint(true)
      clearTimeout(earlyHintTimer.current)
      earlyHintTimer.current = setTimeout(() => setEarlyClickHint(false), 2500)
      return
    }
    setSelected(answerIdx)
    setPhase(PHASE.SELECTED)
  }, [phase, hasPlayedOnce])

  const handleCheck = useCallback(() => {
    const correct = selected === exercise?.correct
    setFeedbackMsg(correct ? pickRandom(CORRECT_MSGS) : pickRandom(ERROR_MSGS))
    setPhase(PHASE.CHECKED)
  }, [selected, exercise])

  const handleContinue = useCallback(() => {
    if (idx + 1 >= total) {
      onComplete?.()
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setFeedbackMsg('')
      setPhase(PHASE.IDLE)
      setHasPlayedOnce(false)
      setEarlyClickHint(false)
      clearTimeout(earlyHintTimer.current)
    }
  }, [idx, total, onComplete])

  // Triggered by the "Listen again" button in the feedback banner
  const handleReplayAudio = useCallback(() => {
    playerRef.current?.replay()
  }, [])

  if (!exercise) return null

  const pandaMood    = phase === PHASE.CHECKED ? (isCorrect ? 'happy' : 'oops') : 'idle'
  const pandaMessage = phase === PHASE.CHECKED
    ? (isCorrect ? 'Great listening! 🎧' : 'Listen again! 🔄')
    : earlyClickHint ? 'Listen first 👂'
    : null

  const questionText = stripQuestionNumber(exercise.title)

  return (
    <div className={styles.root}>
      <ExerciseHeader current={idx + 1} total={total} onQuit={onQuit} />

      <main className={styles.body}>
        {/* ── Skill label + XP ─────────────────────────────────────── */}
        <div className={styles.topRow}>
          <span className={styles.skillLabel}>
            <SparkleIcon weight="fill" size={12} aria-hidden="true" />
            Listening
          </span>
          <span className={styles.xpBadge} aria-label={`+${xpReward} XP per correct answer`}>
            <LightningIcon weight="fill" size={13} aria-hidden="true" />
            +{xpReward} XP
          </span>
        </div>

        {/* ── Instruction ───────────────────────────────────────────── */}
        <p className={styles.instruction}>
          {hasPlayedOnce ? 'Now choose the best answer' : 'Tap play to begin'}
        </p>

        {/* ── Panda — idle until answered ───────────────────────────── */}
        <PandaGuide mood={pandaMood} message={pandaMessage} />

        {/* ── Audio Player — the primary hero element ───────────────── */}
        {/* key={idx} ensures full remount (and reset) on question change */}
        <AudioPlayer key={idx} ref={playerRef} src={exercise.audioUrl} onFirstPlay={handleFirstPlay} />

        {/* ── Question ──────────────────────────────────────────────── */}
        <p className={styles.question}>{questionText}</p>

        {/* ── Early-click nudge ─────────────────────────────────────── */}
        {earlyClickHint && (
          <div className={styles.earlyHint} role="alert" aria-live="assertive">
            Play the audio first ☝️
          </div>
        )}

        {/* ── Answer options ─────────────────────────────────────────── */}
        <div
          className={styles.options}
          data-locked={String(!hasPlayedOnce && phase !== PHASE.CHECKED)}
          role="group"
          aria-label="Answer choices"
        >
          {exercise.answers.map((raw, i) => (
            <AnswerOption
              key={i}
              text={stripAnswerPrefix(raw)}
              letter={LETTERS[i] ?? String(i + 1)}
              isSelected={selected === i}
              isChecked={phase === PHASE.CHECKED}
              isCorrect={i === exercise.correct}
              onClick={() => handleSelect(i)}
            />
          ))}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        {phase !== PHASE.CHECKED ? (
          <button
            className={styles.checkBtn}
            disabled={phase === PHASE.IDLE}
            onClick={handleCheck}
          >
            Check answer
          </button>
        ) : (
          <ListeningFeedbackBanner
            isCorrect={isCorrect}
            message={feedbackMsg}
            xpReward={xpReward}
            correctAnswer={correctText}
            description={exercise.description}
            onContinue={handleContinue}
            onReplayAudio={handleReplayAudio}
          />
        )}
      </div>
    </div>
  )
}
