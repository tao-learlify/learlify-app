/**
 * UnitIntroCard — the mission entry point.
 *
 * Sits at the top of UnitFlow, always in the DOM.
 *
 * Entry states:
 *   fresh     → "Begin Unit"
 *   resume    → "Resume" + compact progress + "Start over" (secondary)
 *   completed → "Review unit" + optional "Next unit"
 *
 * Design: generous spacing, accent gradient, skill tag row, objective callout.
 * Not childish. Duolingo clarity + Linear/Notion spacing quality.
 */
import React, { useState } from 'react';
import { Clock, Lightning, ArrowRight, BookOpen, ArrowCounterClockwise, CheckCircle } from '@phosphor-icons/react';
import type { Unit } from '../../../../schemas/course/hierarchy';
import { MascotWidget } from './MascotWidget';
import { useUnitProgressContext } from '../hooks/UnitProgressContext';

// ── Skill config ──────────────────────────────────────────────

const SKILL_META: Record<string, { emoji: string; label: string; color: string }> = {
  grammar:    { emoji: '📐', label: 'Grammar',    color: '#3B82F6' },
  vocabulary: { emoji: '📚', label: 'Vocabulary', color: '#22C55E' },
  listening:  { emoji: '🎧', label: 'Listening',  color: '#F97316' },
  speaking:   { emoji: '🎤', label: 'Speaking',   color: '#A855F7' },
  reading:    { emoji: '📖', label: 'Reading',    color: '#F59E0B' },
  writing:    { emoji: '✏️',  label: 'Writing',    color: '#0EA5E9' },
};

// ── Component ─────────────────────────────────────────────────

interface UnitIntroCardProps {
  unit: Unit;
  accent: string;
  onBegin: () => void;
  /** Called when user confirms "Start over" — parent resets progress */
  onStartOver?: () => void;
}

export function UnitIntroCard({ unit, accent, onBegin, onStartOver }: UnitIntroCardProps) {
  const { earnedXP, totalXP, isUnitComplete, completedBlockCount } = useUnitProgressContext();
  const [confirmReset, setConfirmReset] = useState(false);

  // Block count is always correct (restored from completedBlockIds).
  // XP-based progress is 0 on restore (xpRecord not persisted), so derive
  // the display percentage from blocks instead.
  const totalBlockCount = unit.sections
    .flatMap(s => s.blocks)
    .filter(b => b.type !== 'divider').length;
  const blockProgressPercent = totalBlockCount > 0
    ? Math.round((completedBlockCount / totalBlockCount) * 100)
    : 0;

  const hasProgress = completedBlockCount > 0;
  const entryType = isUnitComplete ? 'completed' : hasProgress ? 'resume' : 'fresh';

  // Unique skills from sections (preserve order, dedupe)
  const skills = Array.from(
    new Set(unit.sections.map(s => s.skill)),
  );

  return (
    <div
      className="tw:rounded-3xl tw:overflow-hidden tw:mb-8 tw:border"
      style={{
        borderColor: `${accent}20`,
        boxShadow: `0 2px 12px ${accent}12`,
      }}
    >
      {/* Accent band */}
      <div className="tw:h-1.5 tw:w-full" style={{ backgroundColor: accent }} />

      {/* Main content */}
      <div
        className="tw:px-6 tw:pt-6 tw:pb-5"
        style={{
          background: `linear-gradient(145deg, ${accent}08 0%, transparent 60%)`,
        }}
      >
        {/* Top row: unit label + mascot */}
        <div className="tw:flex tw:items-start tw:justify-between tw:gap-3 tw:mb-4">
          <div>
            <span
              className="tw:text-[11px] tw:font-bold tw:uppercase tw:tracking-widest"
              style={{ color: accent }}
            >
              Unit {unit.order}
              {unit.difficulty && (
                <span className="tw:ml-2 tw:opacity-55">{unit.difficulty}</span>
              )}
            </span>
            <h2
              className="tw:text-2xl tw:font-black tw:text-text-primary tw:leading-tight tw:mt-1"
              style={{ fontFamily: 'var(--font-family-display)' }}
            >
              {unit.title.replace(/^Unit \d+\s*[—–-]\s*/i, '')}
            </h2>
            {unit.subtitle && (
              <p className="tw:text-sm tw:text-text-secondary tw:mt-1">
                {unit.subtitle}
              </p>
            )}
          </div>
          <MascotWidget mood={unit.theme?.mood} size={48} />
        </div>

        {/* Skill tags */}
        {skills.length > 0 && (
          <div className="tw:flex tw:flex-wrap tw:gap-1.5 tw:mb-4">
            {skills.map(skill => {
              const meta = SKILL_META[skill];
              if (!meta) return null;
              return (
                <span
                  key={skill}
                  className="tw:flex tw:items-center tw:gap-1 tw:px-2.5 tw:py-1 tw:rounded-pill tw:text-xs tw:font-semibold"
                  style={{
                    backgroundColor: `${meta.color}15`,
                    color: meta.color,
                    border: `1px solid ${meta.color}25`,
                  }}
                >
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Learning objective */}
        {unit.learningObjective && (
          <div
            className="tw:flex tw:gap-2.5 tw:px-3.5 tw:py-3 tw:rounded-xl tw:mb-4"
            style={{ backgroundColor: `${accent}0c` }}
          >
            <BookOpen
              size={15}
              weight="fill"
              className="tw:shrink-0 tw:mt-0.5"
              style={{ color: accent }}
            />
            <p className="tw:text-sm tw:text-text-secondary tw:leading-relaxed tw:italic">
              {unit.learningObjective}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="tw:flex tw:items-center tw:gap-4 tw:mb-5">
          {unit.estimatedDurationMin && (
            <div className="tw:flex tw:items-center tw:gap-1.5 tw:text-xs tw:text-text-secondary">
              <Clock size={13} />
              <span>{unit.estimatedDurationMin} min</span>
            </div>
          )}
          {totalXP > 0 && (
            <div
              className="tw:flex tw:items-center tw:gap-1 tw:text-xs tw:font-semibold"
              style={{ color: accent }}
            >
              <Lightning size={13} weight="fill" />
              <span>Up to {totalXP} XP</span>
            </div>
          )}
        </div>

        {/* Progress bar (resume / completed) */}
        {hasProgress && (
          <div className="tw:mb-4">
            <div className="tw:flex tw:justify-between tw:text-[11px] tw:text-text-secondary tw:mb-1.5">
              <span>{isUnitComplete ? 'Completed' : 'Progress'}</span>
              <span>{isUnitComplete ? '100' : blockProgressPercent}%</span>
            </div>
            <div
              className="tw:h-1.5 tw:rounded-pill tw:overflow-hidden"
              style={{ backgroundColor: `${accent}20` }}
            >
              <div
                className="tw:h-full tw:rounded-pill tw:transition-all tw:duration-500"
                style={{
                  width: `${isUnitComplete ? 100 : blockProgressPercent}%`,
                  backgroundColor: isUnitComplete ? '#22C55E' : accent,
                }}
              />
            </div>
          </div>
        )}

        {/* Resume context banner */}
        {entryType === 'resume' && (
          <div
            className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2.5 tw:rounded-xl tw:mb-4 tw:text-xs"
            style={{ backgroundColor: `${accent}10`, color: accent }}
          >
            <ArrowRight size={13} weight="bold" className="tw:shrink-0" />
            <span className="tw:font-medium">
              Continue where you left off — {blockProgressPercent}% through this unit
            </span>
          </div>
        )}

        {/* Completed banner */}
        {entryType === 'completed' && (
          <div
            className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2.5 tw:rounded-xl tw:mb-4 tw:text-xs"
            style={{ backgroundColor: '#22C55E15', color: '#16A34A' }}
          >
            <CheckCircle size={13} weight="fill" className="tw:shrink-0" />
            <span className="tw:font-medium">You've completed this unit!</span>
          </div>
        )}

        {/* CTAs */}
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
          {/* Primary CTA */}
          <button
            type="button"
            className="tw:flex tw:items-center tw:gap-2 tw:px-5 tw:py-3 tw:rounded-xl tw:text-sm tw:font-bold tw:text-white tw:transition-all tw:duration-150 tw:hover:opacity-90 tw:cursor-pointer tw:border-0"
            style={{
              backgroundColor: entryType === 'completed' ? '#22C55E' : accent,
              boxShadow: `0 4px 0 0 ${entryType === 'completed' ? '#16A34A' : accent}80`,
            }}
            onClick={onBegin}
          >
            {entryType === 'fresh' && <>Begin Unit <ArrowRight size={15} weight="bold" /></>}
            {entryType === 'resume' && <>Resume <ArrowRight size={15} weight="bold" /></>}
            {entryType === 'completed' && <>Review unit <ArrowRight size={15} weight="bold" /></>}
          </button>

          {/* Start Over — only when progress exists */}
          {hasProgress && onStartOver && !confirmReset && (
            <button
              type="button"
              className="tw:flex tw:items-center tw:gap-1.5 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-medium tw:text-text-secondary tw:hover:text-text-primary tw:transition-colors tw:cursor-pointer tw:border-0 tw:bg-transparent"
              onClick={() => setConfirmReset(true)}
            >
              <ArrowCounterClockwise size={14} />
              Start over
            </button>
          )}

          {/* Inline confirmation */}
          {confirmReset && (
            <div className="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:text-text-secondary">
              <span>Reset all progress?</span>
              <button
                type="button"
                className="tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-xs tw:font-bold tw:text-white tw:bg-red-500 tw:border-0 tw:cursor-pointer tw:hover:bg-red-600"
                onClick={() => { setConfirmReset(false); onStartOver?.(); }}
              >
                Yes, reset
              </button>
              <button
                type="button"
                className="tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-xs tw:font-medium tw:text-text-secondary tw:border-0 tw:bg-transparent tw:cursor-pointer tw:hover:text-text-primary"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
