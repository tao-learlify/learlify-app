import React from 'react';
import { Info } from '@phosphor-icons/react';
import type { InstructionBlock } from '../../../../schemas/course/blocks';
import { RichContentRenderer } from './RichContentRenderer';

interface InstructionBlockViewProps {
  block: InstructionBlock;
  accent: string;
}

export function InstructionBlockView({ block, accent }: InstructionBlockViewProps) {
  return (
    <div
      className="tw:flex tw:gap-3 tw:p-5"
      style={{
        backgroundColor: `${accent}08`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <Info size={18} className="tw:shrink-0 tw:mt-0.5" style={{ color: accent }} />
      <RichContentRenderer nodes={block.body} />
    </div>
  );
}
