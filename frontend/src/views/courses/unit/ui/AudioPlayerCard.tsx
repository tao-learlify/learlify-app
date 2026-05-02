/**
 * AudioPlayerCard — shared self-contained audio player component.
 *
 * Visual language matches the premium player in ListeningSelectExercise.
 * This version owns its audio state internally — no external hook needed.
 *
 * Use this for:
 *  • Speaking question audio prompts ("Audio prompt")
 *  • Recording playback review ("Your recording")
 *  • Any drop-in audio player that doesn't need external lock/state control
 *
 * For ListeningSelectExercise (which needs external state to lock options
 * until audio plays), the local useListeningAudio + AudioPlayerCard remain
 * in that file.
 */
import React, { useRef, useEffect, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Play, Pause, ArrowCounterClockwise, Headphones } from '@phosphor-icons/react';

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// Audio state machine
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

function useAudioPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, dispatch] = useReducer(audioReducer, audioInitial);

  useEffect(() => {
    const el = new Audio(src);
    audioRef.current = el;

    const onLoadStart   = () => dispatch({ type: 'LOAD_START' });
    const onCanPlay     = () => dispatch({ type: 'CAN_PLAY', duration: el.duration || 0 });
    const onPlay        = () => dispatch({ type: 'PLAY' });
    const onPause       = () => dispatch({ type: 'PAUSE' });
    const onTimeUpdate  = () => dispatch({ type: 'TIME_UPDATE', currentTime: el.currentTime });
    const onEnded       = () => dispatch({ type: 'ENDED' });
    const onError       = () => dispatch({ type: 'ERROR', message: 'Could not load audio.' });

    el.addEventListener('loadstart',      onLoadStart);
    el.addEventListener('canplaythrough', onCanPlay);
    el.addEventListener('play',           onPlay);
    el.addEventListener('pause',          onPause);
    el.addEventListener('timeupdate',     onTimeUpdate);
    el.addEventListener('ended',          onEnded);
    el.addEventListener('error',          onError);

    el.preload = 'metadata';
    el.load();

    return () => {
      el.pause();
      el.removeEventListener('loadstart',      onLoadStart);
      el.removeEventListener('canplaythrough', onCanPlay);
      el.removeEventListener('play',           onPlay);
      el.removeEventListener('pause',          onPause);
      el.removeEventListener('timeupdate',     onTimeUpdate);
      el.removeEventListener('ended',          onEnded);
      el.removeEventListener('error',          onError);
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

export interface AudioPlayerCardProps {
  /** Audio source — CDN URL or blob object URL */
  src: string;
  /** Accent color (drives all color accents) */
  accent: string;
  /** Header label (default: "Audio") */
  label?: string;
  /** Custom header icon (default: Headphones) */
  headerIcon?: ReactNode;
  /** Compact mode — removes the header strip, smaller padding */
  compact?: boolean;
}

export function AudioPlayerCard({
  src,
  accent,
  label = 'Audio',
  headerIcon,
  compact = false,
}: AudioPlayerCardProps) {
  const { state, play, pause, seek, replay } = useAudioPlayer(src);
  const { phase, currentTime, duration, hasPlayedOnce } = state;

  const isPlaying = phase === 'playing';
  const isLoading = phase === 'loading';
  const isError   = phase === 'error';
  const hasEnded  = phase === 'ended';

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !hasPlayedOnce) return;
    const rect  = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(ratio);
  };

  const handleProgressKey = (e: React.KeyboardEvent) => {
    if (!hasPlayedOnce) return;
    if (e.key === 'ArrowRight') seek(Math.min(1, progressRatio + 0.05));
    if (e.key === 'ArrowLeft')  seek(Math.max(0, progressRatio - 0.05));
  };

  const togglePlay = () => (isPlaying ? pause() : play());

  return (
    <div
      className="tw:rounded-2xl tw:border tw:overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accent}10 0%, ${accent}06 100%)`,
        borderColor: `${accent}25`,
      }}
    >
      {/* Header strip */}
      {!compact && (
        <div
          className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2.5 tw:border-b"
          style={{ borderColor: `${accent}18` }}
        >
          {headerIcon ?? (
            <Headphones size={14} weight="fill" style={{ color: accent }} />
          )}
          <span
            className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider"
            style={{ color: accent }}
          >
            {label}
          </span>
        </div>
      )}

      <div className={compact ? 'tw:px-4 tw:py-3' : 'tw:px-5 tw:py-4'}>
        {/* Error banner */}
        {isError && (
          <div
            className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:rounded-lg tw:text-xs tw:mb-3"
            style={{
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning-text)',
            }}
          >
            {state.errorMessage ?? 'Audio unavailable.'}
          </div>
        )}

        {/* Controls row */}
        <div className="tw:flex tw:items-center tw:gap-4">
          {/* Play / Pause button */}
          <div className="tw:relative tw:shrink-0">
            {/* Ping ring while playing */}
            {isPlaying && (
              <span
                className="tw:absolute tw:inset-0 tw:rounded-full tw:animate-ping"
                style={{ backgroundColor: accent, opacity: 0.22 }}
              />
            )}
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={isError || isLoading}
              className="tw:relative tw:w-10 tw:h-10 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:border-0 tw:cursor-pointer tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
              style={{
                backgroundColor: accent,
                boxShadow: isPlaying
                  ? `0 0 0 3px ${accent}30, 0 4px 0 0 ${accent}80`
                  : `0 4px 0 0 ${accent}80`,
              }}
              onClick={togglePlay}
            >
              {isLoading ? (
                <span className="tw:w-3.5 tw:h-3.5 tw:rounded-full tw:border-2 tw:border-white tw:border-t-transparent tw:animate-spin tw:block" />
              ) : isPlaying ? (
                <Pause size={16} weight="fill" />
              ) : (
                <Play size={16} weight="fill" className="tw:translate-x-px" />
              )}
            </button>
          </div>

          {/* Progress + time */}
          <div className="tw:flex-1 tw:min-w-0">
            {/* Seekable progress track */}
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
                hasPlayedOnce ? 'tw:cursor-pointer' : 'tw:cursor-default',
              ].join(' ')}
              style={{ backgroundColor: `${accent}20` }}
              onClick={handleProgressClick}
              onKeyDown={handleProgressKey}
            >
              {/* Fill */}
              <div
                className="tw:absolute tw:inset-y-0 tw:left-0 tw:rounded-pill tw:transition-all tw:duration-100"
                style={{ width: `${progressRatio * 100}%`, backgroundColor: accent }}
              />
              {/* Thumb */}
              {hasPlayedOnce && (
                <div
                  className="tw:absolute tw:w-3 tw:h-3 tw:rounded-full tw:bg-white tw:border-2 tw:shadow-sm tw:transition-all tw:duration-100"
                  style={{
                    left: `calc(${progressRatio * 100}% - 6px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderColor: accent,
                  }}
                />
              )}
            </div>

            {/* Time display */}
            <div
              className="tw:flex tw:justify-between tw:text-[11px] tw:font-medium"
              style={{ color: `${accent}90` }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Status + replay row */}
        <div className="tw:flex tw:items-center tw:justify-between tw:mt-3">
          <p className="tw:text-xs tw:text-text-secondary">
            {isLoading && 'Loading…'}
            {isPlaying && 'Playing…'}
            {phase === 'paused' && hasPlayedOnce && 'Paused'}
            {hasEnded && 'Finished'}
            {!hasPlayedOnce && !isLoading && !isPlaying && !isError && (
              <span className="tw:flex tw:items-center tw:gap-1">
                <span>Press</span>
                <Play size={10} weight="fill" style={{ color: accent }} />
                <span>to listen</span>
              </span>
            )}
          </p>

          {/* Replay — shown after first play, when not actively playing */}
          {hasPlayedOnce && !isPlaying && (
            <button
              type="button"
              className="tw:flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:hover:opacity-70 tw:cursor-pointer tw:bg-transparent tw:border-0 tw:p-0"
              style={{ color: accent }}
              onClick={replay}
              aria-label="Replay from start"
            >
              <ArrowCounterClockwise size={12} weight="bold" />
              Replay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
