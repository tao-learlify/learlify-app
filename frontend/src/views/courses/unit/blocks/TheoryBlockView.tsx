import React from 'react';
import { BookOpen } from '@phosphor-icons/react';
import type { TheoryBlock } from '../../../../schemas/course/blocks';
import { RichContentRenderer } from './RichContentRenderer';
import { useUnitProgressContext } from '../hooks/UnitProgressContext';

interface TheoryBlockViewProps {
  block: TheoryBlock;
  accent: string;
}

export function TheoryBlockView({ block, accent }: TheoryBlockViewProps) {
  const { completeBlock, getBlockUIState } = useUnitProgressContext();
  const state = getBlockUIState(block);
  const isDone = state === 'completed';

  const handleGotIt = () => {
    // Theory blocks are free — award 0 XP, they just unlock the next block
    completeBlock(block.id, 0);
  };

  return (
    <div className="tw:p-6">
      {/* Block header */}
      {(block.heading || block.title) && (
        <div className="tw:flex tw:items-center tw:gap-2 tw:mb-5">
          <div
            className="tw:w-8 tw:h-8 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:shrink-0"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <BookOpen size={16} weight="fill" />
          </div>
          <div>
            {block.heading && (
              <h2
                className="tw:text-lg tw:font-bold tw:text-text-primary tw:leading-tight"
                style={{ fontFamily: 'var(--font-family-display)' }}
              >
                {block.heading}
              </h2>
            )}
            {block.title && block.title !== block.heading && (
              <p className="tw:text-sm tw:text-text-secondary">{block.title}</p>
            )}
          </div>
        </div>
      )}

      {/* Optional featured image */}
      {block.image && (
        <img
          src={block.image.src}
          alt={block.image.alt ?? block.heading ?? ''}
          className="tw:rounded-xl tw:w-full tw:mb-5 tw:border tw:border-border-default tw:object-cover"
          style={{ maxHeight: 280 }}
        />
      )}

      {/* Rich content body */}
      <RichContentRenderer nodes={block.body} />

      {/* CTA — "Got it" to mark complete */}
      {!isDone && (
        <div className="tw:mt-6 tw:flex tw:justify-end">
          <button
            type="button"
            className="tw:px-5 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:hover:opacity-90 tw:cursor-pointer"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 0 0 ${accent}80`,
            }}
            onClick={handleGotIt}
          >
            Got it ✓
          </button>
        </div>
      )}
    </div>
  );
}
