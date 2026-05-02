import React, { useState, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
} from '@phosphor-icons/react'
import styles from './SpeakingReviewZone.module.scss'

const CRITERIA = ['Pronunciation', 'Fluency', 'Rhythm', 'Natural Delivery', 'Clarity']

// ── RecordedPlayer ────────────────────────────────────────────────────────────
// Shared play/pause toggle — used in both Speaking and Speaking-C review states.
function RecordedPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else         { a.play();  setPlaying(true)  }
  }, [playing])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onEnded = () => setPlaying(false)
    a.addEventListener('ended', onEnded)
    return () => a.removeEventListener('ended', onEnded)
  }, [])

  return (
    <button
      className={styles.replayBtn}
      onClick={toggle}
      aria-label={playing ? 'Pause your recording' : 'Play your recording'}
    >
      <audio ref={audioRef} src={src} />
      {playing
        ? <PauseIcon weight="fill" size={14} aria-hidden="true" />
        : <PlayIcon  weight="fill" size={14} aria-hidden="true" />
      }
      {playing ? 'Pause' : 'Replay yours'}
    </button>
  )
}

// ── SpeakingReviewZone ────────────────────────────────────────────────────────
/**
 * Shared post-recording review UI used by both SpeakingExercise and SpeakingImageView.
 *
 * Props:
 *   recordingUrl — string | null  — blob URL for playback (optional)
 */
export function SpeakingReviewZone({ recordingUrl }) {
  return (
    <div className={styles.reviewZone}>

      {/* "Response submitted" pill */}
      <div className={styles.submittedBadge}>
        <CheckCircleIcon weight="fill" size={18} aria-hidden="true" />
        Response submitted
      </div>

      {/* 3-step progress stepper */}
      <div className={styles.stepper} role="list" aria-label="Review progress">
        <div className={styles.step} role="listitem">
          <div className={styles.stepDot} data-done="true">
            <CheckCircleIcon weight="fill" size={13} aria-hidden="true" />
          </div>
          <span className={clsx(styles.stepLabel, styles.stepLabelDone)}>Submitted</span>
        </div>

        <div className={styles.stepLine} aria-hidden="true" />

        <div className={styles.step} role="listitem">
          <div className={styles.stepDot} data-active="true">
            <span className={styles.stepPulse} aria-hidden="true" />
          </div>
          <span className={clsx(styles.stepLabel, styles.stepLabelActive)}>Under Review</span>
        </div>

        <div className={styles.stepLine} aria-hidden="true" />

        <div className={styles.step} role="listitem">
          <div className={styles.stepDot} />
          <span className={styles.stepLabel}>Feedback Ready</span>
        </div>
      </div>

      {/* Instructor message */}
      <div className={styles.reviewMsg}>
        <p className={styles.reviewMsgTitle}>An instructor will review your response</p>
        <p className={styles.reviewMsgSub}>
          You'll receive personalized feedback on your pronunciation, rhythm, and delivery.
          Keep practicing in the meantime!
        </p>
      </div>

      {/* Criteria chips */}
      <div className={styles.criteriaBlock}>
        <p className={styles.criteriaTitle}>Being evaluated</p>
        <ul className={styles.criteriaList}>
          {CRITERIA.map(c => (
            <li key={c} className={styles.criteriaItem}>
              <CheckCircleIcon weight="fill" size={13} aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Replay recording */}
      {recordingUrl && <RecordedPlayer src={recordingUrl} />}

    </div>
  )
}
