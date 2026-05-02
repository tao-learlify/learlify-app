/**
 * UnitCompletionCard — the end-of-unit reward screen.
 *
 * Replaces the previous inline UnitCompleteBanner with a more
 * satisfying, detailed, and motivating completion state.
 *
 * Shows:
 *   - Total XP earned
 *   - Skills practised (derived from sections)
 *   - Panda + celebratory tone
 *   - CTA to next unit or back to course path
 *
 * Design intent:
 *   - Rewarding without being childish
 *   - Uses unit accent (thematic continuity)
 *   - Slides up into view with motion
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning, ArrowRight, House } from '@phosphor-icons/react';
import type { Unit } from '../../../../schemas/course/hierarchy';
import { useUnitProgressContext } from '../hooks/UnitProgressContext';
import { MascotWidget } from './MascotWidget';

// ── Skill labels ─────────────────────────────────────────────

const SKILL_LABELS: Record<string, { emoji: string; label: string }> = {
  grammar:    { emoji: '📐', label: 'Grammar' },
  vocabulary: { emoji: '📚', label: 'Vocabulary' },
  listening:  { emoji: '🎧', label: 'Listening' },
  speaking:   { emoji: '🎤', label: 'Speaking' },
  reading:    { emoji: '📖', label: 'Reading' },
  writing:    { emoji: '✏️',  label: 'Writing' },
};

// ── Component ─────────────────────────────────────────────────

interface UnitCompletionCardProps {
  unit: Unit;
  accent: string;
  onNextUnit?: () => void;
  onBackToCourse?: () => void;
}

export function UnitCompletionCard({
  unit,
  accent,
  onNextUnit,
  onBackToCourse,
}: UnitCompletionCardProps) {
  const { isUnitComplete, earnedXP, totalXP } = useUnitProgressContext();

  // Deduplicated skill list from sections
  const skills = Array.from(new Set(unit.sections.map(s => s.skill)));

  return (
    <AnimatePresence>
      {isUnitComplete && (
        <motion.div
          key="unit-complete"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="tw:mt-12 tw:rounded-3xl tw:overflow-hidden tw:border"
          style={{
            borderColor: `${accent}30`,
            boxShadow: `0 8px 32px ${accent}18`,
          }}
        >
          {/* Gradient header */}
          <div
            className="tw:px-6 tw:py-8 tw:text-center"
            style={{
              background: `linear-gradient(160deg, ${accent}15 0%, ${accent}06 100%)`,
              borderBottom: `1px solid ${accent}15`,
            }}
          >
            {/* Mascot */}
            <div className="tw:flex tw:justify-center tw:mb-3">
              <div className="tw:text-5xl tw:mb-1">🎉</div>
            </div>

            <h2
              className="tw:text-2xl tw:font-black tw:text-text-primary tw:mb-1"
              style={{ fontFamily: 'var(--font-family-display)' }}
            >
              Unit complete!
            </h2>
            <p className="tw:text-sm tw:text-text-secondary">
              {unit.title.replace(/^Unit \d+\s*[—–-]\s*/i, '')}
            </p>
          </div>

          {/* Stats + skills */}
          <div className="tw:bg-bg-surface tw:px-6 tw:py-6">
            {/* XP earned */}
            <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-6">
              <div
                className="tw:flex tw:items-center tw:gap-2 tw:px-5 tw:py-2.5 tw:rounded-pill tw:font-bold tw:text-white tw:text-base"
                style={{ backgroundColor: accent }}
              >
                <Lightning size={16} weight="fill" />
                <span>
                  {earnedXP}
                  {totalXP > 0 && earnedXP < totalXP && (
                    <span className="tw:font-normal tw:opacity-75"> / {totalXP}</span>
                  )}{' '}
                  XP earned
                </span>
              </div>
            </div>

            {/* Skills practised */}
            {skills.length > 0 && (
              <div className="tw:mb-6">
                <p className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-text-secondary tw:mb-3 tw:text-center">
                  Skills practised
                </p>
                <div className="tw:flex tw:flex-wrap tw:justify-center tw:gap-2">
                  {skills.map(skill => {
                    const meta = SKILL_LABELS[skill];
                    if (!meta) return null;
                    return (
                      <div
                        key={skill}
                        className="tw:flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:rounded-pill tw:text-sm tw:font-medium tw:bg-bg-muted tw:text-text-secondary"
                      >
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="tw:flex tw:flex-col tw:sm:flex-row tw:gap-3">
              {onNextUnit && (
                <button
                  type="button"
                  className="tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-5 tw:py-3 tw:rounded-xl tw:text-sm tw:font-bold tw:text-white tw:transition-opacity tw:hover:opacity-90 tw:cursor-pointer tw:border-0"
                  style={{
                    backgroundColor: accent,
                    boxShadow: `0 4px 0 0 ${accent}80`,
                  }}
                  onClick={onNextUnit}
                >
                  Next Unit
                  <ArrowRight size={15} weight="bold" />
                </button>
              )}

              {onBackToCourse && (
                <button
                  type="button"
                  className="tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-5 tw:py-3 tw:rounded-xl tw:text-sm tw:font-semibold tw:transition-all tw:hover:opacity-80 tw:cursor-pointer tw:border"
                  style={{
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border-default)',
                    backgroundColor: 'var(--color-bg-surface)',
                  }}
                  onClick={onBackToCourse}
                >
                  <House size={15} />
                  Back to course
                </button>
              )}

              {/* Fallback if no callbacks provided */}
              {!onNextUnit && !onBackToCourse && (
                <div
                  className="tw:text-center tw:text-sm tw:text-text-secondary tw:py-2"
                >
                  <MascotWidget mood="playful" size={32} />
                  <p className="tw:mt-1">Well done! 🎓</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
