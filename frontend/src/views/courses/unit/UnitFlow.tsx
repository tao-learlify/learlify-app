/**
 * UnitFlow — progressive, block-by-block learning canvas.
 *
 * The unit is experienced ONE BLOCK AT A TIME:
 *
 *   Phase 1 — Intro:  UnitIntroCard  →  user clicks "Begin"
 *   Phase 2 — Flow:   current block  →  complete  →  Continue  →  next block
 *   Phase 3 — Done:   UnitCompletionCard
 *
 * Future blocks are hidden. Completed blocks are not re-shown.
 * The user focuses on the current learning moment only.
 *
 * Interstitials (stage transitions, midpoint checkpoint, section checkpoint)
 * appear in the post-completion area before the Continue button.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy } from '@phosphor-icons/react';
import type { Unit } from '../../../schemas/course/hierarchy';

import { BlockCard }     from './ui/BlockCard';
import { BlockRenderer } from './BlockRenderer';
import { UnitIntroCard }            from './ui/UnitIntroCard';
import { UnitCompletionCard }       from './ui/UnitCompletionCard';
import { CheckpointBanner }         from './ui/CheckpointBanner';
import { SectionCheckpointBanner }  from './ui/SectionCheckpointBanner';
import { StageTransition }          from './ui/StageTransition';
import { BlockProgressStrip }       from './ui/BlockProgressStrip';
import { StageIndicator }           from './ui/StageIndicator';

import { deriveBlockStage } from './flow/deriveFlowStages';
import { useUnitProgressContext } from './hooks/UnitProgressContext';

// ─────────────────────────────────────────────────────────────
// UnitFlow — root
// ─────────────────────────────────────────────────────────────

interface UnitFlowProps {
  unit: Unit;
  accent: string;
  onXP: (xp: number) => void;
  onNextUnit?: () => void;
  onBackToCourse?: () => void;
  /** When true, skip the intro card and go directly to the first block */
  skipIntro?: boolean;
  /** Called after local progress is reset — parent should also clear backend v2 */
  onStartOver?: () => void;
}

export function UnitFlow({
  unit,
  accent,
  onXP,
  onNextUnit,
  onBackToCourse,
  skipIntro = false,
  onStartOver,
}: UnitFlowProps) {
  const progress = useUnitProgressContext();

  // Flatten all blocks once (stable across renders).
  // Dividers are excluded — they have no learning content.
  const allBlocks = useMemo(
    () => unit.sections.flatMap(s => s.blocks).filter(b => b.type !== 'divider'),
    [unit],
  );

  // ── Phase state ────────────────────────────────────────────
  // When skipIntro=true (unit already started), go directly to the flow.
  const [showIntro, setShowIntro] = useState(!skipIntro);
  const [showCompletion, setShowCompletion] = useState(false);

  // The block currently displayed — persists after completion so user
  // sees the completed state + Continue button (rather than a blank screen).
  const [displayBlockId, setDisplayBlockId] = useState<string | null>(null);

  // When skipping the intro, auto-start the saved or first available block on mount.
  // Priority: savedCurrentBlockId (from v2) → nextAvailableBlockId → first block
  React.useEffect(() => {
    if (!skipIntro && displayBlockId === null) return;
    if (skipIntro && displayBlockId === null) {
      // progress.currentBlockId was hydrated from savedProgress in useUnitProgress
      const resumeId =
        progress.currentBlockId                      // saved "in progress" block
        ?? progress.nextAvailableBlockId             // first incomplete block
        ?? (allBlocks.length > 0 ? allBlocks[0].id : null); // fallback: first block

      if (resumeId) {
        progress.startBlock(resumeId);
        setDisplayBlockId(resumeId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipIntro]); // run once on mount only

  // ── Derived state ──────────────────────────────────────────
  const displayBlock = displayBlockId
    ? allBlocks.find(b => b.id === displayBlockId) ?? null
    : null;

  const displayBlockIndex = displayBlock
    ? allBlocks.indexOf(displayBlock)
    : -1;

  const displaySection = displayBlock
    ? unit.sections.find(s => s.blocks.some(b => b.id === displayBlock.id))
    : null;

  const displayState = displayBlock
    ? progress.getBlockUIState(displayBlock)
    : null;

  const completedCount = allBlocks.filter(
    b => progress.getBlockUIState(b) === 'completed',
  ).length;

  // Block just completed — show interstitials + Continue button
  const justCompleted =
    displayState === 'completed' && !progress.currentBlockId;

  const hasMoreBlocks = progress.nextAvailableBlockId != null;

  // Midpoint checkpoint: show when displayed block is at the midpoint
  const midpointIndex = Math.floor((allBlocks.length - 1) / 2);
  const showMidpoint = justCompleted && displayBlockIndex === midpointIndex;

  // Section just completed?
  const sectionJustCompleted =
    justCompleted &&
    displaySection != null &&
    progress.completedSectionIds.includes(displaySection.id);

  // Stage transition preview: next block has a different stage?
  const nextBlock = progress.nextAvailableBlockId
    ? allBlocks.find(b => b.id === progress.nextAvailableBlockId) ?? null
    : null;
  const currentStage = displayBlock ? deriveBlockStage(displayBlock) : null;
  const nextStage = nextBlock ? deriveBlockStage(nextBlock) : null;
  const showStageTransition =
    justCompleted &&
    hasMoreBlocks &&
    currentStage != null &&
    nextStage != null &&
    currentStage !== nextStage;

  // ── Handlers ───────────────────────────────────────────────

  const handleBegin = () => {
    // On resume: prefer the saved currentBlockId (mid-block), then the first
    // incomplete block, then the very first block (fresh start).
    const resumeId =
      progress.currentBlockId
      ?? progress.nextAvailableBlockId
      ?? (allBlocks.length > 0 ? allBlocks[0].id : null);
    if (resumeId) {
      progress.startBlock(resumeId);
      setDisplayBlockId(resumeId);
    }
    setShowIntro(false);
  }

  // Reset all local progress and return to intro screen.
  // Parent is responsible for clearing backend v2 state.
  const handleStartOver = () => {
    progress.reset();
    setShowIntro(true);
    setShowCompletion(false);
    setDisplayBlockId(null);
    onStartOver?.();
  };

  const handleContinue = () => {
    const nextId = progress.nextAvailableBlockId;
    if (nextId) {
      progress.startBlock(nextId);
      setDisplayBlockId(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (progress.isUnitComplete) {
      setShowCompletion(true);
    }
  };

  // ── Phase 1: Intro ────────────────────────────────────────

  if (showIntro) {
    return (
      <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:py-6 tw:pb-32">
        <UnitIntroCard unit={unit} accent={accent} onBegin={handleBegin} onStartOver={handleStartOver} />
      </div>
    );
  }

  // ── Phase 3: Completion ───────────────────────────────────

  if (showCompletion) {
    return (
      <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:py-6 tw:pb-32">
        <UnitCompletionCard
          unit={unit}
          accent={accent}
          onNextUnit={onNextUnit}
          onBackToCourse={onBackToCourse}
        />
      </div>
    );
  }

  // ── Phase 2: Active Learning Canvas ───────────────────────

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:pt-4 tw:pb-32">

      {/* Block progress strip */}
      <BlockProgressStrip
        total={allBlocks.length}
        completed={completedCount}
        current={displayBlockIndex}
        accent={accent}
      />

      {/* Section + stage context */}
      {displayBlock && displaySection && (
        <StageIndicator section={displaySection} block={displayBlock} />
      )}

      {/* ── Current block canvas ── */}
      <AnimatePresence mode="wait">
        {displayBlock && (
          <motion.div
            key={displayBlock.id}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <BlockCard
              state={displayState!}
              accent={accent}
              blockId={displayBlock.id}
              delay={0}
            >
              <BlockRenderer
                block={displayBlock}
                accent={accent}
                onXP={onXP}
              />
            </BlockCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Post-completion area ── */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            key="continue-area"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, delay: 0.15 }}
            className="tw:mt-6 tw:space-y-4"
          >
            {/* Midpoint checkpoint */}
            {showMidpoint && <CheckpointBanner accent={accent} />}

            {/* Section complete */}
            {sectionJustCompleted && displaySection && (
              <SectionCheckpointBanner section={displaySection} />
            )}

            {/* Stage transition preview */}
            {showStageTransition && (
              <StageTransition from={currentStage!} to={nextStage!} />
            )}

            {/* Continue / Finish button */}
            <div className="tw:flex tw:justify-center tw:pt-2">
              <button
                type="button"
                className="tw:flex tw:items-center tw:gap-2 tw:px-6 tw:py-3 tw:rounded-xl tw:text-sm tw:font-bold tw:text-white tw:transition-all tw:hover:opacity-90 tw:cursor-pointer tw:border-0"
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 4px 0 0 ${accent}80`,
                }}
                onClick={handleContinue}
              >
                {hasMoreBlocks ? 'Continue' : 'See results'}
                {hasMoreBlocks
                  ? <ArrowRight size={15} weight="bold" />
                  : <Trophy size={15} weight="bold" />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
