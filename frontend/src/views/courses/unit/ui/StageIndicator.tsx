/**
 * StageIndicator — section + stage context badge.
 *
 * Shows the current section skill (with emoji) and stage label
 * above the active block in the focused learning canvas.
 */
import React from 'react';
import type { Section } from '../../../../schemas/course/hierarchy';
import type { Block } from '../../../../schemas/course/blocks';
import { deriveBlockStage } from '../flow/deriveFlowStages';

const SKILL_EMOJI: Record<string, string> = {
  grammar:    '📐',
  vocabulary: '📚',
  listening:  '🎧',
  speaking:   '🎤',
  reading:    '📖',
  writing:    '✏️',
};

const SKILL_COLORS: Record<string, { bg: string; color: string }> = {
  grammar:    { bg: '#EFF6FF', color: '#1D4ED8' },
  vocabulary: { bg: '#F0FDF4', color: '#15803D' },
  listening:  { bg: '#FFF7ED', color: '#C2410C' },
  speaking:   { bg: '#FDF4FF', color: '#7E22CE' },
  reading:    { bg: '#FFFBEB', color: '#B45309' },
  writing:    { bg: '#F0F9FF', color: '#0369A1' },
};

const STAGE_LABELS: Record<string, string> = {
  learn: 'Learn',
  practice: 'Practice',
  challenge: 'Challenge',
};

interface StageIndicatorProps {
  section: Section;
  block: Block;
}

export function StageIndicator({ section, block }: StageIndicatorProps) {
  const stage = deriveBlockStage(block);
  const skillStyle = SKILL_COLORS[section.skill] ?? { bg: '#F3F4F6', color: '#374151' };
  const emoji = SKILL_EMOJI[section.skill] ?? '📝';
  const stageLabel = stage ? STAGE_LABELS[stage] ?? stage : '';

  return (
    <div className="tw:flex tw:items-center tw:gap-2 tw:mb-3">
      <div
        className="tw:flex tw:items-center tw:gap-1 tw:px-2.5 tw:py-1 tw:rounded-pill tw:text-xs tw:font-semibold"
        style={{ backgroundColor: skillStyle.bg, color: skillStyle.color }}
      >
        <span aria-hidden="true">{emoji}</span>
        <span className="tw:capitalize">{section.skill}</span>
      </div>
      {stageLabel && (
        <>
          <span className="tw:text-text-disabled tw:text-xs">·</span>
          <span className="tw:text-xs tw:font-medium tw:text-text-secondary tw:capitalize">
            {stageLabel}
          </span>
        </>
      )}
    </div>
  );
}
