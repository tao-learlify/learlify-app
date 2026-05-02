/**
 * SpeakingBlockWrapper
 *
 * Premium in-course speaking exercise shell.
 *
 * State model (per question):
 *   idle → requesting (getUserMedia) → recording → recorded → (submit)
 *
 * Design language matches ListeningSelectExercise:
 *  • Custom AudioPlayerCard for question audio prompts (no native <audio>)
 *  • Custom playback review for captured recording (same AudioPlayerCard)
 *  • Animated pulse rings + waveform bars + countdown timer while recording
 *  • Graceful ImagePromptCard with error fallback for image prompts
 *  • Full AnimatePresence state transitions
 *
 * Architecture:
 *  • SpeakingBlockWrapper: question navigation, recording registry, submit
 *  • SpeakingRecorder: self-contained recorder with 4-phase state machine
 *  • ImagePromptCard: image display with error fallback
 *  • ReviewModeBadge: shows human/AI/hybrid review type
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microphone,
  ArrowRight,
  CheckCircle,
  Image as ImageIcon,
  Robot,
  UserCircle,
  UsersThree,
} from '@phosphor-icons/react';
import { AudioPlayerCard } from '../ui/AudioPlayerCard';
import type {
  SpeakingOpenExercise,
  SpeakingImageExercise,
} from '../../../../schemas/course/exercises';
import type { ExerciseInteraction } from '../../../../schemas/course/exercises';
import type { ExerciseReview } from '../../../../schemas/course/review';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface RecordingEntry {
  blob: Blob;
  url: string;
}

interface SpeakingBlockWrapperProps {
  exercise: SpeakingOpenExercise | SpeakingImageExercise;
  interaction: ExerciseInteraction;
  review?: ExerciseReview;
  accent: string;
  onComplete: (xpEarned: number) => void;
}

// ─────────────────────────────────────────────────────────────
// ImagePromptCard — graceful image display with error fallback
// ─────────────────────────────────────────────────────────────

interface ImagePromptCardProps {
  src: string;
  alt: string;
}

function ImagePromptCard({ src, alt }: ImagePromptCardProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3.5 tw:rounded-xl tw:border"
        style={{
          borderColor: 'var(--color-border-default)',
          backgroundColor: 'var(--color-bg-muted)',
        }}
      >
        <ImageIcon
          size={20}
          weight="regular"
          style={{ color: 'var(--color-text-disabled)', flexShrink: 0 }}
        />
        <p className="tw:text-sm tw:text-text-secondary tw:leading-snug">{alt}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="tw:rounded-xl tw:overflow-hidden tw:border"
      style={{ borderColor: 'var(--color-border-default)' }}
    >
      <img
        src={src}
        alt={alt}
        className="tw:w-full tw:object-cover tw:block"
        style={{ maxHeight: 240 }}
        onError={() => setFailed(true)}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// ReviewModeBadge
// ─────────────────────────────────────────────────────────────

function ReviewModeBadge({ review }: { review: ExerciseReview }) {
  if (review.mode === 'auto' || !review.mode) return null;

  const config = (
    review.mode === 'human'  ? { icon: <UserCircle size={13} weight="fill" />,  label: 'Teacher review',      bg: '#eff6ff', color: '#1d4ed8' } :
    review.mode === 'ai'     ? { icon: <Robot      size={13} weight="fill" />,  label: 'AI feedback',         bg: '#f5f3ff', color: '#7c3aed' } :
    review.mode === 'hybrid' ? { icon: <UsersThree size={13} weight="fill" />,  label: 'AI + Teacher review', bg: '#f0fdf4', color: '#15803d' } :
    null
  );

  if (!config) return null;

  return (
    <div
      className="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-2.5 tw:py-1 tw:rounded-pill tw:text-xs tw:font-semibold"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SpeakingBlockWrapper
// ─────────────────────────────────────────────────────────────

export function SpeakingBlockWrapper({
  exercise,
  interaction,
  review,
  accent,
  onComplete,
}: SpeakingBlockWrapperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings]     = useState<Record<number, RecordingEntry>>({});
  const [submitted, setSubmitted]       = useState(false);

  // Revoke all object URLs on unmount
  useEffect(() => {
    const captured = recordings;
    return () => {
      Object.values(captured).forEach(r => URL.revokeObjectURL(r.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const questions = exercise.questions;
  const question  = questions[currentIndex];
  const isLast    = currentIndex === questions.length - 1;
  const hasAll    = Object.keys(recordings).length === questions.length;

  const handleRecordingCaptured = useCallback(
    (blob: Blob, url: string) => {
      setRecordings(prev => {
        if (prev[currentIndex]) URL.revokeObjectURL(prev[currentIndex].url);
        return { ...prev, [currentIndex]: { blob, url } };
      });
    },
    [currentIndex],
  );

  const handleNext = () => {
    if (!isLast) setCurrentIndex(i => i + 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(interaction.xp);
  };

  // ── Submitted state ──
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="tw:flex tw:flex-col tw:items-center tw:gap-4 tw:py-10 tw:text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="tw:w-16 tw:h-16 tw:rounded-full tw:flex tw:items-center tw:justify-center"
          style={{ backgroundColor: 'var(--color-success-bg)' }}
        >
          <CheckCircle size={36} weight="fill" style={{ color: 'var(--color-success)' }} />
        </motion.div>
        <div className="tw:space-y-1.5">
          <p className="tw:font-semibold tw:text-text-primary tw:text-base">
            Recording{questions.length > 1 ? 's' : ''} submitted!
          </p>
          {review && review.mode !== 'auto' && (
            <p className="tw:text-sm tw:text-text-secondary">
              {review.mode === 'human'  && 'A teacher will review your recording.'}
              {review.mode === 'ai'     && 'AI feedback will be ready shortly.'}
              {review.mode === 'hybrid' && 'Your recording will be reviewed by AI then a teacher.'}
            </p>
          )}
        </div>
        {review && <ReviewModeBadge review={review} />}
      </motion.div>
    );
  }

  return (
    <div className="tw:space-y-5">

      {/* ── Step indicator (multi-question) ── */}
      {questions.length > 1 && (
        <div className="tw:flex tw:items-center tw:gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="tw:h-1.5 tw:rounded-pill tw:transition-all tw:duration-300"
              style={{
                flex: 1,
                backgroundColor:
                  i < currentIndex ? accent
                  : i === currentIndex ? `${accent}70`
                  : 'var(--color-border-default)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Question header (animates on question change) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="tw:space-y-1.5"
        >
          {questions.length > 1 && (
            <p className="tw:text-xs tw:font-medium tw:text-text-secondary">
              Question {currentIndex + 1} of {questions.length}
            </p>
          )}
          <p className="tw:text-base tw:font-medium tw:text-text-primary tw:leading-relaxed">
            {question.prompt}
          </p>
          {question.subtitle && (
            <p className="tw:text-sm tw:text-text-secondary">{question.subtitle}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Single image prompt ── */}
      {question.image && (
        <ImagePromptCard src={question.image.src} alt={question.image.alt} />
      )}

      {/* ── Multiple image prompts (picture gallery) ── */}
      {question.images && question.images.length > 0 && (
        <div className="tw:grid tw:grid-cols-2 tw:gap-2">
          {question.images.map((img, i) => (
            <ImagePromptCard key={i} src={img.src} alt={img.alt} />
          ))}
        </div>
      )}

      {/* ── Question audio prompt (premium player — no native <audio>) ── */}
      {question.audio && (
        <AudioPlayerCard
          key={`prompt-audio-${currentIndex}`}
          src={question.audio.src}
          accent={accent}
          label="Audio prompt"
        />
      )}

      {/* ── Recording interface ── */}
      <SpeakingRecorder
        key={currentIndex}
        accent={accent}
        maxDurationSec={exercise.recordingTimeSec}
        capturedUrl={recordings[currentIndex]?.url ?? null}
        onCapture={handleRecordingCaptured}
      />

      {/* ── Review badge + navigation ── */}
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
        <div>
          {review && <ReviewModeBadge review={review} />}
        </div>

        {!isLast ? (
          <motion.button
            type="button"
            disabled={!recordings[currentIndex]}
            whileTap={recordings[currentIndex] ? { scale: 0.96 } : {}}
            className="tw:flex tw:items-center tw:gap-1.5 tw:px-5 tw:py-2.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: `0 4px 0 0 ${accent}80` }}
            onClick={handleNext}
          >
            Next question
            <ArrowRight size={14} weight="bold" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            disabled={!hasAll}
            whileTap={hasAll ? { scale: 0.96 } : {}}
            className="tw:flex tw:items-center tw:gap-1.5 tw:px-5 tw:py-2.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: `0 4px 0 0 ${accent}80` }}
            onClick={handleSubmit}
          >
            Submit recording{questions.length > 1 ? 's' : ''}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SpeakingRecorder
// ─────────────────────────────────────────────────────────────
// 4-phase state machine:
//   idle       → no recording; big mic button, "Tap the mic to start"
//   requesting → awaiting getUserMedia; spinner on button
//   recording  → active; pulse rings + animated waveform + countdown
//   recorded   → done; AudioPlayerCard review + re-record option
//
// Keyed by `currentIndex` in parent so it fully resets per question.
// ─────────────────────────────────────────────────────────────

type RecorderPhase = 'idle' | 'requesting' | 'recording' | 'recorded';

interface SpeakingRecorderProps {
  accent: string;
  maxDurationSec: number;
  /** Object URL of already-captured blob, or null if question is fresh */
  capturedUrl: string | null;
  onCapture: (blob: Blob, url: string) => void;
}

// 9 bars — wider visual rhythm than 7
const WAVE_BARS = [0.5, 0.8, 0.6, 1, 0.65, 0.9, 0.55, 0.75, 0.45];

function SpeakingRecorder({
  accent,
  maxDurationSec,
  capturedUrl,
  onCapture,
}: SpeakingRecorderProps) {
  const [phase, setPhase]                 = useState<RecorderPhase>(capturedUrl ? 'recorded' : 'idle');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [timeLeft, setTimeLeft]           = useState(maxDurationSec);
  const timerRef                          = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown while recording
  useEffect(() => {
    if (phase !== 'recording') {
      if (timerRef.current !== null) clearInterval(timerRef.current);
      if (phase === 'idle') setTimeLeft(maxDurationSec);
      return;
    }
    setTimeLeft(maxDurationSec);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current !== null) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [phase, maxDurationSec]);

  const startRecording = async () => {
    setError(null);
    setPhase('requesting');
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        onCapture(blob, url);
        setPhase('recorded');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setPhase('recording');

      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, maxDurationSec * 1000);
    } catch {
      setError('Microphone access denied. Please allow microphone access and try again.');
      setPhase('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      // phase → 'recorded' inside recorder.onstop
    }
  };

  const handleReRecord = () => {
    setPhase('idle');
    setTimeLeft(maxDurationSec);
    setError(null);
  };

  // ── Recorded phase: show playback review ──────────────────
  if (phase === 'recorded' && capturedUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="tw:space-y-3"
      >
        <AudioPlayerCard
          src={capturedUrl}
          accent={accent}
          label="Your recording"
          headerIcon={
            <Microphone size={14} weight="fill" style={{ color: accent }} />
          }
        />
        <div className="tw:flex tw:justify-center">
          <button
            type="button"
            className="tw:flex tw:items-center tw:gap-1.5 tw:px-4 tw:py-2 tw:rounded-pill tw:text-xs tw:font-semibold tw:border tw:cursor-pointer tw:transition-opacity tw:hover:opacity-70"
            style={{
              color: 'var(--color-text-secondary)',
              borderColor: 'var(--color-border-default)',
              backgroundColor: 'transparent',
            }}
            onClick={handleReRecord}
          >
            <Microphone size={12} />
            Re-record
          </button>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tw:text-xs tw:text-center tw:px-4 tw:py-2.5 tw:rounded-xl"
              style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Idle / Requesting / Recording phases ──────────────────
  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-5 tw:py-4">

      {/* Record button with animated rings */}
      <div className="tw:relative tw:flex tw:items-center tw:justify-center">

        {/* Outer slow pulse — recording only */}
        <AnimatePresence>
          {phase === 'recording' && (
            <motion.span
              key="ring-outer"
              className="tw:absolute tw:w-24 tw:h-24 tw:rounded-full"
              style={{ backgroundColor: 'var(--color-danger)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.15, 0, 0.15], scale: [0.8, 1.35, 0.8] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Inner border ring — recording only */}
        <AnimatePresence>
          {phase === 'recording' && (
            <motion.span
              key="ring-inner"
              className="tw:absolute tw:w-18 tw:h-18 tw:rounded-full tw:border-2"
              style={{ borderColor: 'var(--color-danger)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 0.1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {/* Main record button */}
        <motion.button
          type="button"
          className="tw:relative tw:w-14 tw:h-14 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:border-0 tw:cursor-pointer"
          whileTap={phase !== 'requesting' ? { scale: 0.9 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={
            phase === 'recording'
              ? { backgroundColor: 'var(--color-danger)', boxShadow: '0 4px 0 0 rgba(220,38,38,0.4)' }
              : { backgroundColor: accent, boxShadow: `0 4px 0 0 ${accent}80` }
          }
          onClick={phase === 'recording' ? stopRecording : phase === 'idle' ? startRecording : undefined}
          disabled={phase === 'requesting'}
          aria-label={phase === 'recording' ? 'Stop recording' : 'Start recording'}
          aria-pressed={phase === 'recording'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'requesting' ? (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="tw:w-5 tw:h-5 tw:rounded-full tw:border-2 tw:border-white tw:border-t-transparent tw:animate-spin tw:block"
              />
            ) : phase === 'recording' ? (
              <motion.div
                key="stop"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="tw:w-4 tw:h-4 tw:rounded-sm tw:bg-white"
              />
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Microphone size={22} weight="fill" color="white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Waveform + countdown — recording phase only */}
      <div className="tw:h-14 tw:flex tw:items-center tw:justify-center">
        <AnimatePresence mode="wait">
          {phase === 'recording' && (
            <motion.div
              key="wave"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="tw:flex tw:flex-col tw:items-center tw:gap-2.5"
            >
              <div
                className="tw:flex tw:items-end tw:gap-0.75"
                style={{ height: 28 }}
                aria-hidden="true"
              >
                {WAVE_BARS.map((h, i) => (
                  <motion.div
                    key={i}
                    className="tw:w-1.5 tw:rounded-pill"
                    style={{
                      height: 28,
                      backgroundColor: 'var(--color-danger)',
                      originY: 1,
                    }}
                    initial={{ scaleY: h * 0.3 }}
                    animate={{ scaleY: [h * 0.3, h, h * 0.25, h * 0.85, h * 0.3] }}
                    transition={{
                      duration: 0.8 + i * 0.07,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.09,
                    }}
                  />
                ))}
              </div>
              <span
                className="tw:text-sm tw:font-bold tw:tabular-nums tw:leading-none"
                style={{ color: 'var(--color-danger)' }}
              >
                {timeLeft}s
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status text — animates on phase change */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="tw:text-sm tw:text-text-secondary tw:text-center"
        >
          {phase === 'idle'       && 'Tap the mic to start speaking'}
          {phase === 'requesting' && 'Requesting microphone access…'}
          {phase === 'recording'  && 'Tap the button to stop'}
        </motion.p>
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="tw:text-xs tw:text-center tw:px-4 tw:py-2.5 tw:rounded-xl tw:w-full"
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
