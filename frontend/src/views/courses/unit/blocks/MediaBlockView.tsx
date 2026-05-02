import React from 'react';
import type { MediaBlock } from '../../../../schemas/course/blocks';

interface MediaBlockViewProps {
  block: MediaBlock;
}

export function MediaBlockView({ block }: MediaBlockViewProps) {
  return (
    <div className="tw:p-6 tw:space-y-4">
      {block.images && block.images.length > 0 && (
        <div className={`tw:grid tw:gap-3 ${block.images.length > 1 ? 'tw:grid-cols-2' : 'tw:grid-cols-1'}`}>
          {block.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={img.alt ?? `Media ${i + 1}`}
              className="tw:rounded-xl tw:w-full tw:object-cover tw:border tw:border-border-default"
            />
          ))}
        </div>
      )}
      {block.audio && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls src={block.audio.url} className="tw:w-full tw:rounded-lg" />
      )}
      {block.caption && (
        <p className="tw:text-xs tw:text-text-secondary tw:text-center tw:italic">
          {block.caption}
        </p>
      )}
    </div>
  );
}
