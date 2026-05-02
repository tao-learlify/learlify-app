/**
 * UnitIntroCard — the mission entry point.
 *
 * Sits at the top of UnitFlow, always in the DOM.
 * On a fresh visit: the user sees this first and clicks "Begin".
 * On a returning visit: the page auto-scrolls past it to the current block.
 *
 * Design: generous spacing, accent gradient, skill tag row, objective callout.
 * Not childish. Duolingo clarity + Linear/Notion spacing quality.
 */
import React from 'react';
import { Clock, Lightning, ArrowRight, BookOpen } from '@phosphor-icons/react';
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
}

export function UnitIntroCard({ unit, accent, onBegin }: UnitIntroCardProps) {
  const { earnedXP, totalXP, progress } = useUnitProgressContext();

  const hasProgress = progress > 0;

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
              <span>
                {hasProgress ? `${earnedXP} / ${totalXP} XP` : `Up to ${totalXP} XP`}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar (only when in-progress) */}
        {hasProgress && (
          <div className="tw:mb-4">
            <div className="tw:flex tw:justify-between tw:text-[11px] tw:text-text-secondary tw:mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="tw:h-1.5 tw:rounded-pill tw:overflow-hidden"
              style={{ backgroundColor: `${accent}20` }}
            >
              <div
                className="tw:h-full tw:rounded-pill tw:transition-all tw:duration-500"
                style={{ width: `${progress}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          className="tw:flex tw:items-center tw:gap-2 tw:px-5 tw:py-3 tw:rounded-xl tw:text-sm tw:font-bold tw:text-white tw:transition-all tw:duration-150 tw:hover:opacity-90 tw:cursor-pointer tw:border-0"
          style={{
            backgroundColor: accent,
            boxShadow: `0 4px 0 0 ${accent}80`,
          }}
          onClick={onBegin}
        >
          {hasProgress ? 'Continue' : 'Begin Unit'}
          <ArrowRight size={15} weight="bold" />
        </button>
      </div>
    </div>
  );
}
