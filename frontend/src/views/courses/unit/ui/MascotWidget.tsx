import React from 'react';
import type { UnitTheme } from '../../../../schemas/course/primitives';

interface MascotWidgetProps {
  mood?: UnitTheme['mood'];
  size?: number;
}

// Tailwind animation class per mood.
// `tw:animate-bounce` and `tw:animate-pulse` are built-in Tailwind utilities.
const MOOD_ANIMATION_CLASS: Record<NonNullable<UnitTheme['mood']>, string> = {
  energetic: 'tw:animate-bounce',
  playful:   'tw:animate-pulse',
  focused:   '',
  calm:      '',
};

export function MascotWidget({ mood = 'calm', size = 38 }: MascotWidgetProps) {
  const animClass = MOOD_ANIMATION_CLASS[mood] ?? '';

  return (
    <div
      className={`tw:flex tw:items-center tw:justify-center tw:select-none ${animClass}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.82) }}
      aria-hidden="true"
      title={`Mascot mood: ${mood}`}
    >
      🐼
    </div>
  );
}
