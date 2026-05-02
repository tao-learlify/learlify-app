/**
 * SectionCheckpointBanner — celebrates completing a full section.
 *
 * Appears below each section when ALL its blocks are done.
 * Acts as a milestone marker, giving the user a sense of meaningful progress.
 *
 * Design intent:
 *   - Encouraging, not childish
 *   - Uses success palette, not the unit accent (neutral milestone feel)
 *   - Shows what skill was mastered, not just a generic "well done"
 *   - Slides in with a subtle animation
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';
import type { Section } from '../../../../schemas/course/hierarchy';
import { useUnitProgressContext } from '../hooks/UnitProgressContext';

// ── Skill copy ────────────────────────────────────────────────

const SKILL_CHECKPOINT_COPY: Record<string, string> = {
  grammar:    'Grammar section complete',
  vocabulary: 'Vocabulary section complete',
  listening:  'Listening section complete',
  speaking:   'Speaking section complete',
  reading:    'Reading section complete',
  writing:    'Writing section complete',
};

const SKILL_EMOJI: Record<string, string> = {
  grammar:    '📐',
  vocabulary: '📚',
  listening:  '🎧',
  speaking:   '🎤',
  reading:    '📖',
  writing:    '✏️',
};

const SKILL_ENCOURAGEMENT: Record<string, string> = {
  grammar:    'Your grammar is getting sharper.',
  vocabulary: 'New words added to your toolkit.',
  listening:  'Your ear is getting better.',
  speaking:   'Great effort on speaking.',
  reading:    'Strong reading work.',
  writing:    'Your writing is coming along.',
};

// ── Component ─────────────────────────────────────────────────

interface SectionCheckpointBannerProps {
  section: Section;
}

export function SectionCheckpointBanner({ section }: SectionCheckpointBannerProps) {
  const { completedSectionIds } = useUnitProgressContext();
  const isComplete = completedSectionIds.includes(section.id);

  const title       = SKILL_CHECKPOINT_COPY[section.skill] ?? `${section.skill} complete`;
  const emoji       = SKILL_EMOJI[section.skill] ?? '✓';
  const encouragement = SKILL_ENCOURAGEMENT[section.skill] ?? 'Keep it up.';

  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          key={`checkpoint-${section.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.2 }}
          className="tw:mt-6 tw:rounded-2xl tw:border tw:overflow-hidden"
          style={{
            borderColor: 'var(--color-success)',
            backgroundColor: 'var(--color-success-bg)',
          }}
        >
          {/* Top stripe */}
          <div
            className="tw:h-1 tw:w-full"
            style={{ backgroundColor: 'var(--color-success)' }}
          />

          <div className="tw:flex tw:items-center tw:gap-4 tw:px-5 tw:py-4">
            {/* Icon */}
            <div
              className="tw:w-10 tw:h-10 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shrink-0"
              style={{ backgroundColor: 'var(--color-success)', color: 'white' }}
            >
              <CheckCircle size={20} weight="fill" />
            </div>

            {/* Text */}
            <div className="tw:flex-1 tw:min-w-0">
              <div className="tw:flex tw:items-center tw:gap-1.5">
                <span aria-hidden="true">{emoji}</span>
                <p
                  className="tw:text-sm tw:font-bold tw:leading-tight"
                  style={{ color: 'var(--color-success-text)' }}
                >
                  {title}
                </p>
              </div>
              <p
                className="tw:text-xs tw:mt-0.5"
                style={{ color: 'var(--color-success-text)', opacity: 0.75 }}
              >
                {encouragement}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
