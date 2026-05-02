import React from 'react';
import type { Unit } from '../../../schemas/course/hierarchy';
import { ProgressBar }    from './ui/ProgressBar';
import { XPBadge }        from './ui/XPBadge';
import { MascotWidget }   from './ui/MascotWidget';
import { useUnitProgressContext } from './hooks/UnitProgressContext';

interface UnitHeaderProps {
  unit: Unit;
}

// Strip the leading "Unit N — " prefix for a cleaner display title
function shortTitle(title: string): string {
  return title.replace(/^Unit \d+\s*[—–-]\s*/i, '');
}

export function UnitHeader({ unit }: UnitHeaderProps) {
  const { earnedXP, totalXP, progress } = useUnitProgressContext();

  const theme  = unit.theme;
  const accent = theme?.accent ?? 'var(--color-brand-primary)';

  return (
    <header
      className="tw:sticky tw:top-0 tw:z-200 tw:bg-bg-surface"
      style={{
        borderBottom: `1px solid ${accent}25`,
        backgroundColor: theme?.surface
          ? `color-mix(in srgb, ${theme.surface} 30%, white)`
          : undefined,
      }}
    >
      {/* Thin accent stripe */}
      <div
        className="tw:h-0.5 tw:w-full"
        style={{ backgroundColor: accent }}
      />

      <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:py-2">
        {/* Single row: unit label + title | XP + mascot */}
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:mb-1.5">
          <div className="tw:flex tw:items-center tw:gap-2 tw:min-w-0">
            <span
              className="tw:text-[10px] tw:font-bold tw:uppercase tw:tracking-wider tw:shrink-0"
              style={{ color: accent }}
            >
              Unit {unit.order}
            </span>
            <h1
              className="tw:text-sm tw:font-bold tw:text-text-primary tw:truncate tw:leading-none"
              style={{ fontFamily: 'var(--font-family-display)' }}
            >
              {shortTitle(unit.title)}
            </h1>
          </div>
          <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
            <XPBadge earned={earnedXP} total={totalXP} accent={accent} />
            <MascotWidget mood={theme?.mood} size={24} />
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar value={progress} accent={accent} />
      </div>
    </header>
  );
}
