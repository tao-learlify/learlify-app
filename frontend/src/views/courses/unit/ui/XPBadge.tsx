import React from 'react';
import { Lightning } from '@phosphor-icons/react';

interface XPBadgeProps {
  earned: number;
  total: number;
  accent: string;
}

export function XPBadge({ earned, total, accent }: XPBadgeProps) {
  return (
    <div
      className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1 tw:rounded-pill tw:text-sm tw:font-semibold tw:shrink-0"
      style={{
        backgroundColor: `${accent}18`,
        color: accent,
        border: `1.5px solid ${accent}30`,
      }}
    >
      <Lightning size={13} weight="fill" />
      <span>{earned}</span>
      <span
        className="tw:text-xs tw:font-medium"
        style={{ opacity: 0.55 }}
      >
        / {total} XP
      </span>
    </div>
  );
}
