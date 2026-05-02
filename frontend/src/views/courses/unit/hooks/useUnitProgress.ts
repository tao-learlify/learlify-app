import { useReducer, useCallback, useMemo } from 'react';
import type { Unit } from '../../../../schemas/course/hierarchy';
import type { Block } from '../../../../schemas/course/blocks';
import type { UnlockRule } from '../../../../schemas/course/primitives';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type BlockUIState = 'locked' | 'available' | 'in_progress' | 'completed';

interface ProgressState {
  /** IDs of blocks the user has fully submitted/completed */
  completedBlockIds: string[];
  /** XP earned per block: blockId → xp */
  xpRecord: Record<string, number>;
  /** The block currently being worked on */
  currentBlockId: string | null;
}

type ProgressAction =
  | { type: 'START_BLOCK'; blockId: string }
  | { type: 'COMPLETE_BLOCK'; blockId: string; xpEarned: number }
  | { type: 'RESET' };

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────

const initialState: ProgressState = {
  completedBlockIds: [],
  xpRecord: {},
  currentBlockId: null,
};

function reducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'START_BLOCK':
      return { ...state, currentBlockId: action.blockId };

    case 'COMPLETE_BLOCK': {
      const alreadyDone = state.completedBlockIds.includes(action.blockId);
      return {
        ...state,
        completedBlockIds: alreadyDone
          ? state.completedBlockIds
          : [...state.completedBlockIds, action.blockId],
        xpRecord: {
          ...state.xpRecord,
          [action.blockId]: action.xpEarned,
        },
        currentBlockId:
          state.currentBlockId === action.blockId ? null : state.currentBlockId,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Unlock rule evaluator
// ─────────────────────────────────────────────────────────────

function evaluateUnlockRule(
  rule: UnlockRule | undefined,
  completedBlockIds: string[],
  completedSectionIds: string[],
): boolean {
  if (!rule || rule.type === 'always') return true;
  if (rule.type === 'after_block') return completedBlockIds.includes(rule.refId);
  if (rule.type === 'after_section') return completedSectionIds.includes(rule.refId);
  // score_threshold: treat block completion as sufficient for now
  if (rule.type === 'score_threshold') return completedBlockIds.includes(rule.refId);
  return false;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function computeCompletedSectionIds(
  unit: Unit,
  completedBlockIds: string[],
): string[] {
  return unit.sections
    .filter(section =>
      section.blocks.length > 0 &&
      section.blocks.every(block => completedBlockIds.includes(block.id)),
    )
    .map(s => s.id);
}

function getBlockXP(block: Block): number {
  if (block.type === 'exercise') return block.interaction.xp;
  return 0;
}

function getAllBlocks(unit: Unit): Block[] {
  return unit.sections.flatMap(s => s.blocks);
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useUnitProgress(unit: Unit) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const completedSectionIds = useMemo(
    () => computeCompletedSectionIds(unit, state.completedBlockIds),
    [unit, state.completedBlockIds],
  );

  const getBlockUIState = useCallback(
    (block: Block): BlockUIState => {
      if (state.completedBlockIds.includes(block.id)) return 'completed';
      if (state.currentBlockId === block.id) return 'in_progress';

      const unlockRule = (block as Block & { unlockRule?: UnlockRule }).unlockRule;
      const unlocked = evaluateUnlockRule(
        unlockRule,
        state.completedBlockIds,
        completedSectionIds,
      );
      return unlocked ? 'available' : 'locked';
    },
    [state.completedBlockIds, state.currentBlockId, completedSectionIds],
  );

  const totalXP = useMemo(
    () => getAllBlocks(unit).reduce((sum, block) => sum + getBlockXP(block), 0),
    [unit],
  );

  const earnedXP = useMemo(
    () => Object.values(state.xpRecord).reduce((sum, xp) => sum + xp, 0),
    [state.xpRecord],
  );

  const progress = totalXP > 0 ? Math.min(100, Math.round((earnedXP / totalXP) * 100)) : 0;

  const nextAvailableBlockId = useMemo(() => {
    for (const section of unit.sections) {
      for (const block of section.blocks) {
        if (getBlockUIState(block) === 'available') return block.id;
      }
    }
    return null;
  }, [unit, getBlockUIState]);

  const isUnitComplete = useMemo(
    () => getAllBlocks(unit).every(b => state.completedBlockIds.includes(b.id)),
    [unit, state.completedBlockIds],
  );

  const startBlock = useCallback((blockId: string) => {
    dispatch({ type: 'START_BLOCK', blockId });
  }, []);

  const completeBlock = useCallback((blockId: string, xpEarned: number) => {
    dispatch({ type: 'COMPLETE_BLOCK', blockId, xpEarned });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    getBlockUIState,
    startBlock,
    completeBlock,
    reset,
    earnedXP,
    totalXP,
    progress,
    currentBlockId: state.currentBlockId,
    nextAvailableBlockId,
    completedSectionIds,
    isUnitComplete,
  };
}

export type UnitProgressAPI = ReturnType<typeof useUnitProgress>;
