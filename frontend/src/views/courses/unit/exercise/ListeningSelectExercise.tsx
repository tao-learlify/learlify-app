/**
 * ListeningSelectExercise
 *
 * UX flow (enforced by state machine):
 *  1. IDLE      → Audio player prominent. Options locked. "Play to begin" cue.
 *  2. LOADING   → Audio buffering. Player shows spinner.
 *  3. PLAYING   → Progress bar animates. Options still locked. Pulse ring on button.
 *  4. PLAYED    → Options unlock with a smooth fade-in. User selects answers.
 *  5. SUBMITTED → Per-option correct/wrong feedback. Transcript toggle revealed.
 *  6. COMPLETE  → XP awarded via onComplete. Block marked done.
 *
 * Audio state is managed by useListeningAudio (local hook).
 * Answer state is managed by the main component.
 * The two concerns are kept strictly separate.
 */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ArrowCounterClockwise,
  Headphones,
  CheckCircle,
  XCircle,
  Article,
  CaretRight,
} from '@phosphor-icons/react';
import type {
  ListeningSelectExercise as ListeningSelectExerciseType,
  ExerciseInteraction,
  ExerciseQuestion,
  AnswerOption,
} from '../../../../schemas/course/exercises';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// useListeningAudio — audio state machine
// ─────────────────────────────────────────────────────────────

type AudioPhase = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

interface AudioState {
  phase: AudioPhase;
  currentTime: number;
  duration: number;
  hasPlayedOnce: boolean;
  errorMessage: string | null;
}

type AudioAction =
  | { type: 'LOAD_START' }
  | { type: 'CAN_PLAY'; duration: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TIME_UPDATE'; currentTime: number }
  | { type: 'ENDED' }
  | { type: 'ERROR'; message: string };

const audioInitial: AudioState = {
  phase: 'idle',
  currentTime: 0,
  duration: 0,
  hasPlayedOnce: false,
  errorMessage: null,
};

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, phase: 'loading', errorMessage: null };
    case 'CAN_PLAY':
      return {
        ...state,
        phase: state.phase === 'loading' ? 'idle' : state.phase,
        duration: action.duration,
      };
    case 'PLAY':
      return { ...state, phase: 'playing', hasPlayedOnce: true };
    case 'PAUSE':
      return { ...state, phase: state.phase === 'ended' ? 'ended' : 'paused' };
    case 'TIME_UPDATE':
      return { ...state, currentTime: action.currentTime };
    case 'ENDED':
      return { ...state, phase: 'ended', currentTime: state.duration };
    case 'ERROR':
      return { ...state, phase: 'error', errorMessage: action.message };
    default:
      return state;
  }
}

function useListeningAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, dispatch] = useReducer(audioReducer, audioInitial);

  // Build the <audio> element once
  useEffect(() => {
    const el = new Audio(src);
    audioRef.current = el;

    const onLoadStart = () => dispatch({ type: 'LOAD_START' });
    const onCanPlay  = () => dispatch({ type: 'CAN_PLAY', duration: el.duration || 0 });
    const onPlay     = () => dispatch({ type: 'PLAY' });
    const onPause    = () => dispatch({ type: 'PAUSE' });
    const onTimeUpdate = () => dispatch({ type: 'TIME_UPDATE', currentTime: el.currentTime });
    const onEnded    = () => dispatch({ type: 'ENDED' });
    const onError    = () => dispatch({ type: 'ERROR', message: 'Could not load audio.' });

    el.addEventListener('loadstart',   onLoadStart);
    el.addEventListener('canplaythrough', onCanPlay);
    el.addEventListener('play',        onPlay);
    el.addEventListener('pause',       onPause);
    el.addEventListener('timeupdate',  onTimeUpdate);
    el.addEventListener('ended',       onEnded);
    el.addEventListener('error',       onError);

    el.preload = 'metadata';
    el.load();

    return () => {
      el.pause();
      el.removeEventListener('loadstart',       onLoadStart);
      el.removeEventListener('canplaythrough',   onCanPlay);
      el.removeEventListener('play',             onPlay);
      el.removeEventListener('pause',            onPause);
      el.removeEventListener('timeupdate',       onTimeUpdate);
      el.removeEventListener('ended',            onEnded);
      el.removeEventListener('error',            onError);
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {
      dispatch({ type: 'ERROR', message: 'Playback failed.' });
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((ratio: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
  }, []);

  const replay = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      dispatch({ type: 'ERROR', message: 'Playback failed.' });
    });
  }, []);

  return { state, play, pause, seek, replay };
}

// ─────────────────────────────────────────────────────────────
// AudioPlayerCard
// ─────────────────────────────────────────────────────────────

interface AudioPlayerCardProps {
  audio: { src: string; duration?: number; transcript?: string };
  accent: string;
  submitted: boolean;
  onFirstPlay: () => void;
  // Passed down from useListeningAudio
  audioState: AudioState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (ratio: number) => void;
  onReplay: () => void;
}

function AudioPlayerCard({
  accent,
  submitted,
  audioState,
  onPlay,
  onPause,
  onSeek,
  onReplay,
}: AudioPlayerCardProps) {
  const { phase, currentTime, duration, hasPlayedOnce } = audioState;
  const isPlaying  = phase === 'playing';
  const isLoading  = phase === 'loading';
  const isError    = phase === 'error';
  const hasEnded   = phase === 'ended';

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  // Click-to-seek on progress bar
  const progressBarRef = useRef<HTMLDivElement>(null);
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !hasPlayedOnce) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio);
  };

  const togglePlay = () => {
    if (isPlaying) onPause();
    else onPlay();
  };

  // Keyboard: Space/Enter on the button is handled natively.
  // Progress bar keyboard seek: left/right arrows
  const handleProgressKey = (e: React.KeyboardEvent) => {
    if (!hasPlayedOnce) return;
    if (e.key === 'ArrowRight') onSeek(Math.min(1, progressRatio + 0.05));
    if (e.key === 'ArrowLeft')  onSeek(Math.max(0, progressRatio - 0.05));
  };

  return (
    <div
      className="tw:rounded-2xl tw:border tw:overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accent}10 0%, ${accent}06 100%)`,
        borderColor: `${accent}25`,
      }}
    >
      {/* Header row */}
      <div
        className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2.5 tw:border-b"
        style={{ borderColor: `${accent}15` }}
      >
        <Headphones size={14} weight="fill" style={{ color: accent }} />
        <span
          className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider"
          style={{ color: accent }}
        >
          Listen carefully
        </span>
      </div>

      <div className="tw:px-5 tw:py-5">
        {/* Error state */}
        {isError && (
          <div
            className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:mb-4"
            style={{
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning-text)',
            }}
          >
            <XCircle size={16} weight="fill" />
            <span>{audioState.errorMessage ?? 'Audio unavailable. You may still answer the questions.'}</span>
          </div>
        )}

        {/* Controls row: play button + progress + time */}
        <div className="tw:flex tw:items-center tw:gap-4">
          {/* Play / Pause button */}
          <div className="tw:relative tw:shrink-0">
            {/* Ping ring — visible only while playing */}
            {isPlaying && (
              <span
                className="tw:absolute tw:inset-0 tw:rounded-full tw:animate-ping"
                style={{ backgroundColor: accent, opacity: 0.22 }}
              />
            )}
            <button
              type="button"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              disabled={isError || isLoading}
              className="tw:relative tw:w-12 tw:h-12 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:transition-all tw:duration-150 tw:border-0 tw:cursor-pointer tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
              style={{
                backgroundColor: accent,
                boxShadow: isPlaying
                  ? `0 0 0 3px ${accent}30, 0 4px 0 0 ${accent}80`
                  : `0 4px 0 0 ${accent}80`,
              }}
              onClick={togglePlay}
            >
              {isLoading ? (
                <span className="tw:w-4 tw:h-4 tw:rounded-full tw:border-2 tw:border-white tw:border-t-transparent tw:animate-spin tw:block" />
              ) : isPlaying ? (
                <Pause size={18} weight="fill" />
              ) : (
                <Play size={18} weight="fill" className="tw:translate-x-px" />
              )}
            </button>
          </div>

          {/* Progress bar + time */}
          <div className="tw:flex-1 tw:min-w-0">
            {/* Progress track (clickable + keyboard seekable) */}
            <div
              ref={progressBarRef}
              role="slider"
              aria-label="Audio progress"
              aria-valuenow={Math.round(progressRatio * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={hasPlayedOnce ? 0 : -1}
              className={[
                'tw:relative tw:h-2 tw:rounded-pill tw:mb-1.5 tw:overflow-hidden',
                'tw:transition-opacity tw:duration-200',
                hasPlayedOnce ? 'tw:cursor-pointer' : 'tw:cursor-default',
              ].join(' ')}
              style={{ backgroundColor: `${accent}20` }}
              onClick={handleProgressClick}
              onKeyDown={handleProgressKey}
            >
              {/* Fill */}
              <div
                className="tw:absolute tw:inset-y-0 tw:left-0 tw:rounded-pill tw:transition-all tw:duration-100"
                style={{
                  width: `${progressRatio * 100}%`,
                  backgroundColor: accent,
                }}
              />
              {/* Thumb — visible when has played */}
              {hasPlayedOnce && (
                <div
                  className="tw:absolute tw:top-1/2 tw:w-3 tw:h-3 tw:rounded-full tw:bg-white tw:border-2 tw:shadow-sm tw:transition-all tw:duration-100"
                  style={{
                    left: `calc(${progressRatio * 100}% - 6px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderColor: accent,
                  }}
                />
              )}
            </div>

            {/* Time row */}
            <div className="tw:flex tw:justify-between tw:text-[11px] tw:font-medium" style={{ color: `${accent}90` }}>
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Status + replay row */}
        <div className="tw:flex tw:items-center tw:justify-between tw:mt-3">
          {/* Status text */}
          <p className="tw:text-xs tw:text-text-secondary">
            {isLoading && 'Loading…'}
            {isPlaying && 'Playing…'}
            {phase === 'paused' && hasPlayedOnce && 'Paused — tap to continue'}
            {hasEnded && 'Finished — you can replay'}
            {!hasPlayedOnce && !isLoading && !isPlaying && !isError && (
              <span className="tw:flex tw:items-center tw:gap-1.5">
                <span>Press</span>
                <Play size={11} weight="fill" style={{ color: accent }} />
                <span>to begin</span>
              </span>
            )}
          </p>

          {/* Replay button — only shown after first play */}
          {hasPlayedOnce && !isPlaying && !submitted && (
            <button
              type="button"
              className="tw:flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:transition-opacity tw:hover:opacity-70 tw:cursor-pointer tw:bg-transparent tw:border-0 tw:p-0"
              style={{ color: accent }}
              onClick={onReplay}
              aria-label="Replay audio from start"
            >
              <ArrowCounterClockwise size={13} weight="bold" />
              Replay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OptionButton
// ─────────────────────────────────────────────────────────────

interface OptionButtonProps {
  option: AnswerOption;
  index: number;
  isSelected: boolean;
  isLocked: boolean;
  submitted: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  accent: string;
  onSelect: () => void;
  onLockedClick: () => void;
}

function OptionButton({
  option,
  index,
  isSelected,
  isLocked,
  submitted,
  isCorrect,
  isWrong,
  accent,
  onSelect,
  onLockedClick,
}: OptionButtonProps) {
  // Derive visual style from state
  let bg      = 'var(--color-bg-surface)';
  let border  = 'var(--color-border-default)';
  let color   = 'var(--color-text-primary)';
  let opacity = 1;

  if (isLocked) {
    bg      = 'var(--color-bg-muted)';
    color   = 'var(--color-text-disabled)';
    opacity = 0.6;
  } else if (isCorrect) {
    bg     = 'var(--color-success-bg)';
    border = 'var(--color-success)';
    color  = 'var(--color-success-text)';
  } else if (isWrong) {
    bg     = 'var(--color-warning-bg)';
    border = 'var(--color-warning)';
    color  = 'var(--color-warning-text)';
  } else if (isSelected) {
    bg     = `${accent}12`;
    border = accent;
    color  = accent;
  }

  // Letter index: A, B, C, D…
  const letter = String.fromCharCode(65 + index);

  const handleClick = () => {
    if (submitted) return;
    if (isLocked) { onLockedClick(); return; }
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isLocked || submitted}
      tabIndex={isLocked || submitted ? -1 : 0}
      whileTap={!isLocked && !submitted ? { scale: 0.97 } : {}}
      whileHover={!isLocked && !submitted ? { y: -1 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={[
        'tw:w-full tw:text-left tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3',
        'tw:rounded-xl tw:border tw:text-sm tw:font-medium',
        'tw:transition-colors tw:duration-150',
        isLocked ? 'tw:cursor-not-allowed' : submitted ? 'tw:cursor-default' : 'tw:cursor-pointer',
        !isLocked && !submitted ? 'tw:hover:shadow-(--shadow-1)' : '',
      ].filter(Boolean).join(' ')}
      style={{ backgroundColor: bg, borderColor: border, color, opacity }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Letter badge */}
      <span
        className="tw:w-6 tw:h-6 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:shrink-0 tw:transition-colors tw:duration-150"
        style={
          isCorrect
            ? { backgroundColor: 'var(--color-success)', color: 'white' }
            : isWrong
            ? { backgroundColor: 'var(--color-warning)', color: 'white' }
            : isSelected
            ? { backgroundColor: accent, color: 'white' }
            : { backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-secondary)' }
        }
      >
        {isCorrect ? <CheckCircle size={13} weight="fill" /> : letter}
      </span>

      <span className="tw:flex-1">{option.text}</span>

      {/* Right icon for correct/wrong */}
      {submitted && isCorrect && (
        <CheckCircle size={16} weight="fill" style={{ color: 'var(--color-success)', flexShrink: 0 }} />
      )}
      {submitted && isWrong && (
        <XCircle size={16} weight="fill" style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────
// ListenFirstPrompt
// ─────────────────────────────────────────────────────────────

function ListenFirstPrompt() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium"
        style={{
          backgroundColor: 'var(--color-info-bg)',
          color: 'var(--color-info-text)',
        }}
      >
        <span>👂</span>
        <span>Listen to the audio first, then choose your answer.</span>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

interface ListeningSelectExerciseProps {
  exercise: ListeningSelectExerciseType;
  interaction: ExerciseInteraction;
  accent: string;
  onComplete: (xpEarned: number) => void;
}

export function ListeningSelectExercise({
  exercise,
  interaction,
  accent,
  onComplete,
}: ListeningSelectExerciseProps) {
  // Audio
  const { state: audioState, play, pause, seek, replay } = useListeningAudio(
    exercise.audio.src,
  );
  const hasPlayedOnce = audioState.hasPlayedOnce;

  // Answers: questionId → selected optionId
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Whether user tried to click a locked option (shows "Listen first" prompt)
  const [showLockedHint, setShowLockedHint] = useState(false);
  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const questions = exercise.questions;
  const total     = questions.length;
  const answered  = Object.keys(answers).length;
  const canCheck  = answered === total && !submitted;

  // Auto-hide the "listen first" hint after 2.5 s
  useEffect(() => {
    if (!showLockedHint) return;
    const t = window.setTimeout(() => setShowLockedHint(false), 2500);
    return () => window.clearTimeout(t);
  }, [showLockedHint]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted || !hasPlayedOnce) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleLockedClick = () => {
    setShowLockedHint(true);
  };

  const handleSubmit = () => {
    const correct = questions.filter(q => {
      return q.correctOptionId && answers[q.id] === q.correctOptionId;
    }).length;
    const ratio = total > 0 ? correct / total : 0;
    const xp    = Math.round(interaction.xp * ratio);
    setScore(correct);
    setSubmitted(true);
    onComplete(xp);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setShowTranscript(false);
  };

  const isPerfect = submitted && score === total;
  const hasMistakes = submitted && score !== null && score < total;

  return (
    <div className="tw:space-y-5">
      {/* ── Audio player ── */}
      <AudioPlayerCard
        audio={exercise.audio}
        accent={accent}
        submitted={submitted}
        onFirstPlay={() => {}}
        audioState={audioState}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
        onReplay={replay}
      />

      {/* ── Listen-first hint (appears when locked option clicked) ── */}
      {showLockedHint && !hasPlayedOnce && <ListenFirstPrompt />}

      {/* ── Questions ── */}
      <div className="tw:space-y-6">
        {questions.map((q, qi) => (
          <QuestionGroup
            key={q.id}
            question={q}
            index={qi}
            total={total}
            selectedOptionId={answers[q.id] ?? null}
            submitted={submitted}
            locked={!hasPlayedOnce}
            accent={accent}
            onSelect={optionId => handleSelect(q.id, optionId)}
            onLockedClick={handleLockedClick}
          />
        ))}
      </div>

      {/* ── Result banner ── */}
      {submitted && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-medium"
          style={
            isPerfect
              ? { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }
              : { backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning-text)' }
          }
        >
          {isPerfect
            ? <CheckCircle size={18} weight="fill" />
            : <XCircle size={18} weight="fill" />}
          <span>
            {isPerfect
              ? total === 1
                ? 'Correct! Great listening.'
                : `All ${total} correct — excellent!`
              : `${score} of ${total} correct${interaction.retryable ? ' — try again?' : '.'}`}
          </span>
        </motion.div>
      )}

      {/* ── Transcript reveal (post-submission) ── */}
      {submitted && exercise.audio.transcript && (
        <div>
          <button
            type="button"
            className="tw:flex tw:items-center tw:gap-1.5 tw:text-xs tw:font-medium tw:transition-opacity tw:hover:opacity-70 tw:cursor-pointer tw:bg-transparent tw:border-0 tw:p-0 tw:mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
            onClick={() => setShowTranscript(v => !v)}
            aria-expanded={showTranscript}
          >
            <Article size={13} />
            {showTranscript ? 'Hide transcript' : 'Show transcript'}
            <CaretRight
              size={11}
              weight="bold"
              style={{
                transform: showTranscript ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="tw:overflow-hidden"
              >
                <div
                  className="tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:leading-relaxed tw:italic"
                  style={{
                    backgroundColor: 'var(--color-bg-muted)',
                    color: 'var(--color-text-secondary)',
                    borderLeft: `3px solid ${accent}50`,
                  }}
                >
                  {exercise.audio.transcript}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Action row ── */}
      <div className="tw:flex tw:justify-end tw:gap-3">
        {/* Retry — only if retryable and has mistakes */}
        {hasMistakes && interaction.retryable && (
          <button
            type="button"
            className="tw:px-4 tw:py-2.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:transition-colors tw:cursor-pointer tw:border"
            style={{
              color: accent,
              borderColor: `${accent}40`,
              backgroundColor: `${accent}08`,
            }}
            onClick={handleRetry}
          >
            Try again
          </button>
        )}

        {/* Submit */}
        {!submitted && (
          <button
            type="button"
            disabled={!canCheck}
            className="tw:px-5 tw:py-2.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 0 0 ${accent}80`,
            }}
            onClick={handleSubmit}
          >
            Check answer{total > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QuestionGroup — one question with its option list
// ─────────────────────────────────────────────────────────────

interface QuestionGroupProps {
  question: ExerciseQuestion;
  index: number;
  total: number;
  selectedOptionId: string | null;
  submitted: boolean;
  locked: boolean;
  accent: string;
  onSelect: (optionId: string) => void;
  onLockedClick: () => void;
}

function QuestionGroup({
  question,
  index,
  total,
  selectedOptionId,
  submitted,
  locked,
  accent,
  onSelect,
  onLockedClick,
}: QuestionGroupProps) {
  // Shake the option list when a locked click is attempted
  const [shakeKey, setShakeKey] = useState(0);

  const handleLockedClick = () => {
    setShakeKey(k => k + 1);
    onLockedClick();
  };

  return (
    <div>
      {/* Question prompt */}
      <div className="tw:flex tw:items-start tw:gap-2.5 tw:mb-3">
        {total > 1 && (
          <span
            className="tw:shrink-0 tw:w-5 tw:h-5 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:text-white tw:mt-0.5"
            style={{ backgroundColor: locked ? 'var(--color-text-disabled)' : accent }}
          >
            {index + 1}
          </span>
        )}
        <p
          className="tw:text-sm tw:font-medium tw:text-text-primary tw:leading-relaxed"
          style={{ opacity: locked ? 0.5 : 1 }}
        >
          {question.prompt}
        </p>
      </div>

      {/* Options */}
      <motion.div
        className="tw:space-y-2"
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [-3, 3, -3, 2, -1, 0] } : {}}
        transition={{ duration: 0.3 }}
        role="radiogroup"
        aria-label={question.prompt}
      >
        {(question.options ?? []).map((option, optIndex) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect  = submitted && option.id === question.correctOptionId;
          const isWrong    = submitted && isSelected && option.id !== question.correctOptionId;

          return (
            <motion.div
              key={option.id}
              initial={false}
              animate={{ opacity: locked ? 0.55 : 1 }}
              transition={{ duration: 0.25, delay: locked ? 0 : optIndex * 0.06 }}
            >
              <OptionButton
                option={option}
                index={optIndex}
                isSelected={isSelected}
                isLocked={locked}
                submitted={submitted}
                isCorrect={isCorrect}
                isWrong={isWrong}
                accent={accent}
                onSelect={() => onSelect(option.id)}
                onLockedClick={handleLockedClick}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
