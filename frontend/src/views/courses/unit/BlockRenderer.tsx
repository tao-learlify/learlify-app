/**
 * BlockRenderer — top-level dispatcher.
 *
 * Receives a Block (discriminated union) and routes to the correct view.
 * Each block type maps 1:1 to a renderer component.
 */
import React from 'react';
import type { Block } from '../../../schemas/course/blocks';
import { TheoryBlockView }      from './blocks/TheoryBlockView';
import { ExerciseBlockView }    from './blocks/ExerciseBlockView';
import { MediaBlockView }       from './blocks/MediaBlockView';
import { InstructionBlockView } from './blocks/InstructionBlockView';

interface BlockRendererProps {
  block: Block;
  accent: string;
  onXP: (xp: number) => void;
}

export function BlockRenderer({ block, accent, onXP }: BlockRendererProps) {
  switch (block.type) {
    case 'theory':
      return <TheoryBlockView block={block} accent={accent} />;

    case 'exercise':
      return <ExerciseBlockView block={block} accent={accent} onXP={onXP} />;

    case 'media':
      return <MediaBlockView block={block} />;

    case 'instruction':
      return <InstructionBlockView block={block} accent={accent} />;

    case 'divider':
      return (
        <hr className="tw:border-border-default" />
      );

    default:
      return null;
  }
}
