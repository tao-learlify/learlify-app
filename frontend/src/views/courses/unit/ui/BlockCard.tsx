import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from '@phosphor-icons/react';
import type { BlockUIState } from '../hooks/useUnitProgress';

interface BlockCardProps {
  state: BlockUIState;
  accent: string;
  children: React.ReactNode;
  /** Used as the DOM `id` for scroll-to targeting */
  blockId: string;
  /** Stagger delay for entrance animation (seconds) */
  delay?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function BlockCard({
  state,
  accent,
  children,
  blockId,
  delay = 0,
}: BlockCardProps) {
  const isLocked     = state === 'locked';
  const isInProgress = state === 'in_progress';
  const isCompleted  = state === 'completed';

  // Border left thickness for in-progress indicator
  const inProgressStyle = isInProgress
    ? {
        borderLeftWidth: 4,
        borderLeftColor: accent,
        boxShadow: `0 0 0 1px ${accent}20, var(--shadow-2)`,
      }
    : {};

  const completedStyle = isCompleted
    ? {
        backgroundColor: 'var(--color-success-bg)',
        borderColor: 'var(--color-success)',
      }
    : {};

  return (
    <motion.div
      id={`block-${blockId}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.28, ease: 'easeOut', delay }}
      className={[
        'tw:relative tw:rounded-2xl tw:border tw:bg-bg-surface tw:overflow-hidden',
        'tw:transition-colors tw:duration-200',
        isLocked ? 'tw:opacity-40 tw:grayscale' : '',
        !isCompleted && !isInProgress ? 'tw:border-border-default tw:shadow-[var(--shadow-1)]' : 'tw:border',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...inProgressStyle, ...completedStyle }}
    >
      {/* Locked indicator */}
      {isLocked && (
        <div className="tw:absolute tw:top-3 tw:right-3 tw:text-text-disabled">
          <Lock size={16} weight="bold" />
        </div>
      )}

      {/* Completed indicator */}
      {isCompleted && (
        <div
          className="tw:absolute tw:top-3 tw:right-3"
          style={{ color: 'var(--color-success)' }}
        >
          <CheckCircle size={20} weight="fill" />
        </div>
      )}

      {/* Content — interaction disabled when locked */}
      <div className={isLocked ? 'tw:pointer-events-none tw:select-none' : ''}>
        {children}
      </div>
    </motion.div>
  );
}
