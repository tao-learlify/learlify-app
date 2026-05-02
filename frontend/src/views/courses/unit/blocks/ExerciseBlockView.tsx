/**
 * ExerciseBlockView — shell around any exercise.
 *
 * Responsibilities:
 *  - Show exercise label + description header
 *  - Show XP chip + review-mode badge
 *  - Delegate to ExerciseRouter for the actual interaction
 *  - Trigger onComplete → progress engine + XPFeedback
 */
import React, { useState } from 'react';
import { Lightning, SealCheck, UserCircle, Robot } from '@phosphor-icons/react';
import type { ExerciseBlock } from '../../../../schemas/course/blocks';
import type { ReviewMode } from '../../../../schemas/course/review';
import { ExerciseRouter } from '../exercise/ExerciseRouter';
import { useUnitProgressContext } from '../hooks/UnitProgressContext';

interface ExerciseBlockViewProps {
  block: ExerciseBlock;
  accent: string;
  onXP: (xp: number) => void;
}

const REVIEW_MODE_LABEL: Record<ReviewMode, { label: string; icon: React.ReactNode }> = {
  auto:   { label: 'Auto-graded',       icon: <SealCheck size={12} weight="fill" /> },
  human:  { label: 'Human review',      icon: <UserCircle size={12} weight="fill" /> },
  ai:     { label: 'AI feedback',       icon: <Robot size={12} weight="fill" /> },
  hybrid: { label: 'AI + Human review', icon: <Robot size={12} weight="fill" /> },
};

export function ExerciseBlockView({ block, accent, onXP }: ExerciseBlockViewProps) {
  const { completeBlock, getBlockUIState } = useUnitProgressContext();
  const [completedXP, setCompletedXP] = useState<number | null>(null);

  const state = getBlockUIState(block);
  const isDone = state === 'completed';

  const { exercise, interaction, review } = block;
  const reviewMeta = review ? REVIEW_MODE_LABEL[review.mode] : null;

  const handleComplete = (xpEarned: number) => {
    setCompletedXP(xpEarned);
    completeBlock(block.id, xpEarned);
    if (xpEarned > 0) onXP(xpEarned);
  };

  return (
    <div className="tw:p-6">
      {/* Header: label + XP chip + review mode */}
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-3 tw:mb-4">
        <div>
          <p
            className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:mb-0.5"
            style={{ color: accent }}
          >
            {exercise.label}
          </p>
          {exercise.description && (
            <p className="tw:text-sm tw:text-text-secondary tw:leading-relaxed">
              {exercise.description}
            </p>
          )}
        </div>

        <div className="tw:flex tw:flex-col tw:items-end tw:gap-1.5 tw:shrink-0">
          {/* XP award chip */}
          <div
            className="tw:flex tw:items-center tw:gap-1 tw:px-2.5 tw:py-1 tw:rounded-pill tw:text-xs tw:font-bold"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <Lightning size={11} weight="fill" />
            <span>{interaction.xp} XP</span>
          </div>

          {/* Review mode badge */}
          {reviewMeta && review?.mode !== 'auto' && (
            <div
              className="tw:flex tw:items-center tw:gap-1 tw:px-2 tw:py-0.5 tw:rounded-pill tw:text-[10px] tw:font-medium"
              style={{
                backgroundColor: 'var(--color-bg-muted)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {reviewMeta.icon}
              <span>{reviewMeta.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Time limit indicator */}
      {interaction.timeLimitSec && !isDone && (
        <div
          className="tw:flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-xs tw:font-medium tw:mb-4"
          style={{
            backgroundColor: 'var(--color-warning-bg)',
            color: 'var(--color-warning-text)',
          }}
        >
          ⏱ {Math.floor(interaction.timeLimitSec / 60)}:{String(interaction.timeLimitSec % 60).padStart(2, '0')} time limit
        </div>
      )}

      {/* Separator */}
      <div className="tw:h-px tw:bg-border-default tw:mb-5" />

      {/* Exercise content */}
      {isDone ? (
        <div
          className="tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-medium"
          style={{
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success-text)',
          }}
        >
          Exercise completed
          {completedXP !== null && completedXP > 0 && (
            <span className="tw:ml-2">· +{completedXP} XP earned</span>
          )}
        </div>
      ) : (
        <ExerciseRouter
          block={block}
          accent={accent}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
