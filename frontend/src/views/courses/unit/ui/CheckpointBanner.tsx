/**
 * CheckpointBanner — unit midpoint reward moment.
 *
 * Appears once, inline in UnitFlow, right after the ~50% block.
 * Acknowledges progress without interrupting the learning flow.
 *
 * Trigger: injected by UnitFlow after the midpoint block.
 * Visibility: gated on progress ≥ 40 from context (tolerance band
 * accounts for uneven XP distribution across blocks).
 *
 * Design intent:
 *  - Subtle, non-blocking
 *  - Uses unit accent for thematic continuity
 *  - Fade + slide-up entrance
 *  - Small panda moment — encouraging, not childish
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning, Star } from '@phosphor-icons/react';
import { useUnitProgressContext } from '../hooks/UnitProgressContext';

interface CheckpointBannerProps {
  /** Unit accent color — passed down from UnitFlow, consistent with other UI. */
  accent: string;
}

export function CheckpointBanner({ accent }: CheckpointBannerProps) {
  const { progress, earnedXP } = useUnitProgressContext();

  // Show once the user has genuinely crossed the halfway point.
  // 40% threshold (not 50%) gives a small tolerance for uneven XP blocks
  // so the banner appears at a natural moment, not at an odd partial block.
  const isVisible = progress >= 40;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="checkpoint-banner"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          role="status"
          aria-label="Halfway checkpoint"
          className="tw:my-6 tw:rounded-2xl tw:border tw:overflow-hidden"
          style={{
            borderColor: `${accent}28`,
            backgroundColor: `${accent}09`,
          }}
        >
          {/* Accent top stripe */}
          <div
            className="tw:h-1 tw:w-full"
            style={{ backgroundColor: accent }}
          />

          <div className="tw:flex tw:items-center tw:gap-4 tw:px-5 tw:py-4">
            {/* Icon */}
            <div
              className="tw:w-10 tw:h-10 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shrink-0 tw:text-white tw:flex-shrink-0"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            >
              <Star size={18} weight="fill" />
            </div>

            {/* Copy */}
            <div className="tw:flex-1 tw:min-w-0">
              <p
                className="tw:text-sm tw:font-bold tw:leading-tight"
                style={{ color: accent }}
              >
                You're halfway there
              </p>
              {earnedXP > 0 && (
                <div className="tw:flex tw:items-center tw:gap-1 tw:mt-0.5">
                  <Lightning
                    size={12}
                    weight="fill"
                    style={{ color: accent }}
                    aria-hidden="true"
                  />
                  <span className="tw:text-xs tw:text-text-secondary">
                    {earnedXP} XP earned so far
                  </span>
                </div>
              )}
            </div>

            {/* Panda moment — purely decorative */}
            <span
              className="tw:text-2xl tw:shrink-0"
              aria-hidden="true"
            >
              🐼
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
