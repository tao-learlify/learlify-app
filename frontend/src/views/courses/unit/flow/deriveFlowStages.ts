/**
 * deriveFlowStages — pure utility, no React, no side effects.
 *
 * Derives stage classification from block structure.
 * This is a PRESENTATION concern — stages live here, not in the schema.
 *
 * Classification rules:
 *   learn      → theory, instruction, media (content consumption)
 *   practice   → exercises with low-demand types (selection, gap, matching)
 *   challenge  → exercises with high-demand types (listening, speaking, writing)
 *   transparent→ divider blocks (rendered as-is, no stage label)
 */
import type { Block } from '../../../../schemas/course/blocks';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type FlowStage = 'learn' | 'practice' | 'challenge';

export interface StageGroup {
  stage: FlowStage;
  blocks: Block[];
}

// ─────────────────────────────────────────────────────────────
// Classification
// ─────────────────────────────────────────────────────────────

/**
 * Exercise types that signal a high-demand challenge moment.
 * Everything else in the exercise family is treated as practice.
 */
const CHALLENGE_EXERCISE_TYPES = new Set([
  'listening_select',
  'speaking_open',
  'speaking_image',
  'writing_open',
  'writing_form',
]);

/**
 * Derive the FlowStage for a single block.
 * Dividers return null — they are transparent to stage logic.
 */
export function deriveBlockStage(block: Block): FlowStage | null {
  if (block.type === 'divider') return null;

  if (
    block.type === 'theory' ||
    block.type === 'instruction' ||
    block.type === 'media'
  ) {
    return 'learn';
  }

  if (block.type === 'exercise') {
    return CHALLENGE_EXERCISE_TYPES.has(block.exercise.type)
      ? 'challenge'
      : 'practice';
  }

  return 'learn';
}

// ─────────────────────────────────────────────────────────────
// Grouping
// ─────────────────────────────────────────────────────────────

/**
 * Group consecutive blocks by stage for rendering stage transitions.
 *
 * Divider blocks are merged into the current open group (they don't
 * form their own group and don't break stage continuity).
 *
 * Example input:  [theory, theory, mc-exercise, listening]
 * Example output: [
 *   { stage: 'learn',     blocks: [theory, theory] },
 *   { stage: 'practice',  blocks: [mc-exercise] },
 *   { stage: 'challenge', blocks: [listening] },
 * ]
 */
export function groupBlocksByStage(blocks: Block[]): StageGroup[] {
  const groups: StageGroup[] = [];

  for (const block of blocks) {
    const stage = deriveBlockStage(block);

    if (stage === null) {
      // Divider: append to current group, or open a 'learn' group
      const last = groups[groups.length - 1];
      if (last) {
        last.blocks.push(block);
      } else {
        groups.push({ stage: 'learn', blocks: [block] });
      }
      continue;
    }

    const last = groups[groups.length - 1];
    if (last && last.stage === stage) {
      last.blocks.push(block);
    } else {
      groups.push({ stage, blocks: [block] });
    }
  }

  return groups;
}

// ─────────────────────────────────────────────────────────────
// Transition copy
// ─────────────────────────────────────────────────────────────

interface TransitionCopy {
  emoji: string;
  label: string;
}

/**
 * Human-readable label for the transition INTO a stage.
 * Used by StageTransition component.
 * Returns null for the 'learn' stage (no transition into theory — it starts sections).
 */
export function getStageTransitionCopy(
  from: FlowStage,
  to: FlowStage,
): TransitionCopy | null {
  if (from === 'learn' && to === 'practice') {
    return { emoji: '✏️', label: `Now let's practise` };
  }
  if (from === 'practice' && to === 'challenge') {
    return { emoji: '🎯', label: 'Time for a challenge' };
  }
  if (from === 'learn' && to === 'challenge') {
    return { emoji: '🎯', label: 'Ready for a challenge?' };
  }
  // practice → learn or challenge → learn are unusual but handled gracefully
  if (to === 'learn') {
    return { emoji: '📖', label: 'A bit more to read' };
  }
  return null;
}
