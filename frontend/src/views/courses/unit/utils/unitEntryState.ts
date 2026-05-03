import type { Unit } from '../../../../schemas/course/hierarchy';
import type { SavedV2Progress } from '../hooks/useUnitProgress';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type UnitEntryState =
  | { type: 'fresh' }
  | {
      type: 'resume';
      currentBlockId: string | null;
      progressPercent: number;       // 0–1
      xpEarned: number;
      completedBlockCount: number;
      totalBlockCount: number;
    }
  | {
      type: 'completed';
      xpEarned: number;
      totalBlockCount: number;
    };

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────

/**
 * Derive UnitEntryState from saved v2 progress and the unit schema.
 *
 * @param unit  — full unit schema (used to count total blocks)
 * @param saved — saved v2 block-level progress from advance.content[n].v2
 */
export function getUnitEntryState(
  unit: Unit,
  saved: SavedV2Progress | undefined,
): UnitEntryState {
  if (!saved || saved.completedBlockIds.length === 0) {
    return { type: 'fresh' };
  }

  const allBlocks = unit.sections
    .flatMap(s => s.blocks)
    .filter(b => b.type !== 'divider');

  const totalBlockCount = allBlocks.length;
  const completedBlockCount = saved.completedBlockIds.length;
  const xpEarned = Object.values(saved.xpRecord ?? {}).reduce((s, v) => s + v, 0);

  const isComplete =
    totalBlockCount > 0 &&
    allBlocks.every(b => saved.completedBlockIds.includes(b.id));

  if (isComplete) {
    return { type: 'completed', xpEarned, totalBlockCount };
  }

  const progressPercent =
    totalBlockCount > 0 ? completedBlockCount / totalBlockCount : 0;

  return {
    type: 'resume',
    currentBlockId: saved.currentBlockId ?? null,
    progressPercent,
    xpEarned,
    completedBlockCount,
    totalBlockCount,
  };
}
