/**
 * StageTransition — an in-flow rhythm break between stage groups.
 *
 * Appears BETWEEN groups only (never before the first group in a section).
 * The transition copy is derived from the stage pair (learn→practice, etc.).
 *
 * Design intent:
 *   - Subtle, not loud
 *   - Gives the user a sense of "what comes next" without breaking immersion
 *   - Styled as a centred label with fading horizontal rules
 */
import React from 'react';
import { motion } from 'framer-motion';
import type { FlowStage } from '../flow/deriveFlowStages';
import { getStageTransitionCopy } from '../flow/deriveFlowStages';

interface StageTransitionProps {
  from: FlowStage;
  to: FlowStage;
}

export function StageTransition({ from, to }: StageTransitionProps) {
  const copy = getStageTransitionCopy(from, to);
  if (!copy) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="tw:flex tw:items-center tw:gap-3 tw:my-6"
    >
      {/* Left rule */}
      <div className="tw:flex-1 tw:h-px tw:bg-border-default" />

      {/* Label */}
      <div className="tw:flex tw:items-center tw:gap-1.5 tw:shrink-0">
        <span className="tw:text-sm" aria-hidden="true">{copy.emoji}</span>
        <span className="tw:text-xs tw:font-semibold tw:text-text-secondary tw:tracking-wide">
          {copy.label}
        </span>
      </div>

      {/* Right rule */}
      <div className="tw:flex-1 tw:h-px tw:bg-border-default" />
    </motion.div>
  );
}
