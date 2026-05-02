import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  accent: string;
  className?: string;
}

export function ProgressBar({ value, accent, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`tw:relative tw:h-2 tw:rounded-pill tw:overflow-hidden tw:bg-bg-muted ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="tw:absolute tw:inset-y-0 tw:left-0 tw:rounded-pill"
        style={{ backgroundColor: accent }}
        initial={{ width: '0%' }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
