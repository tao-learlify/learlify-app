/**
 * BlockProgressStrip — segmented progress bar for block-by-block flow.
 *
 * Shows total blocks as thin segments. Filled = completed,
 * half-filled = current, empty = future. Compact and minimal.
 */
import React from 'react';

interface BlockProgressStripProps {
  total: number;
  completed: number;
  /** 0-based index of the currently displayed block */
  current: number;
  accent: string;
}

export function BlockProgressStrip({
  total,
  completed,
  current,
  accent,
}: BlockProgressStripProps) {
  if (total <= 0) return null;

  return (
    <div className="tw:mb-4">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-1.5">
        <span className="tw:text-[11px] tw:font-semibold tw:text-text-secondary tw:uppercase tw:tracking-wider">
          Block {Math.min(current + 1, total)} of {total}
        </span>
        <span className="tw:text-[11px] tw:font-medium tw:text-text-secondary">
          {Math.round((completed / total) * 100)}%
        </span>
      </div>
      <div className="tw:flex tw:gap-0.5">
        {Array.from({ length: total }).map((_, i) => {
          let bg: string;
          if (i < completed) bg = accent;
          else if (i === current) bg = `${accent}50`;
          else bg = 'var(--color-bg-muted)';

          return (
            <div
              key={i}
              className="tw:h-1 tw:flex-1 tw:rounded-pill tw:transition-all tw:duration-300"
              style={{ backgroundColor: bg }}
            />
          );
        })}
      </div>
    </div>
  );
}
