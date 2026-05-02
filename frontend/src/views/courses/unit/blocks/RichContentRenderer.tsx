/**
 * RichContentRenderer — renders a RichContent (ContentNode[]) tree.
 *
 * Handles all node types defined in schemas/course/content.ts.
 * No external dependencies beyond React. Styled with design tokens + tw: classes.
 */
import React from 'react';
import type {
  ContentNode,
  InlineText,
  Mark,
  ParagraphNode,
  HeadingNode,
  ListNode,
  TableNode,
  BlockquoteNode,
  CalloutNode,
  ConjugationTableNode,
  ExampleSentenceNode,
  CodeBlockNode,
  ImageNode,
  AudioNode,
} from '../../../../schemas/course/content';

// ── Inline text rendering ───────────────────────────────────────

function applyMark(mark: Mark, children: React.ReactNode): React.ReactNode {
  switch (mark.type) {
    case 'bold':          return <strong>{children}</strong>;
    case 'italic':        return <em>{children}</em>;
    case 'underline':     return <u>{children}</u>;
    case 'strikethrough': return <s>{children}</s>;
    case 'highlight':     return <mark style={mark.color ? { backgroundColor: mark.color } : undefined}>{children}</mark>;
    case 'color':         return <span style={{ color: mark.value }}>{children}</span>;
    default:              return <span>{children}</span>;
  }
}

function renderInlineText(span: InlineText, index: number): React.ReactNode {
  if (!span.marks || span.marks.length === 0) {
    return <React.Fragment key={index}>{span.text}</React.Fragment>;
  }
  // Nest marks inside each other (innermost first), then wrap in a keyed Fragment
  // so the key lives on the outermost sibling, not on an inner wrapper.
  const inner = span.marks.reduceRight<React.ReactNode>(
    (children, mark) => applyMark(mark, children),
    span.text,
  );
  return <React.Fragment key={index}>{inner}</React.Fragment>;
}

function renderInlineChildren(children: InlineText[]): React.ReactNode {
  return children.map((span, i) => renderInlineText(span, i));
}

// ── Callout variant styles ──────────────────────────────────────

const CALLOUT_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  tip:     { bg: 'var(--color-info-bg)',    border: 'var(--color-info)',    label: '💡 Tip'     },
  warning: { bg: 'var(--color-warning-bg)', border: 'var(--color-warning)', label: '⚠️ Warning'  },
  note:    { bg: 'var(--color-bg-muted)',   border: 'var(--color-border-strong)', label: '📌 Note' },
  example: { bg: 'var(--color-brand-primary-light)', border: 'var(--color-brand-primary)', label: '📖 Example' },
};

// ── Node renderers ──────────────────────────────────────────────

function renderNode(node: ContentNode, index: number): React.ReactNode {
  switch (node.type) {

    case 'paragraph':
      return (
        <p key={`p-${index}`} className="tw:text-base tw:text-text-primary tw:leading-relaxed tw:mb-3 tw:last:mb-0">
          {renderInlineChildren((node as ParagraphNode).children)}
        </p>
      );

    case 'heading': {
      const n = node as HeadingNode;
      const Tag = `h${n.level}` as keyof JSX.IntrinsicElements;
      const sizeMap: Record<number, string> = {
        1: 'tw:text-3xl tw:font-bold tw:mb-4',
        2: 'tw:text-2xl tw:font-bold tw:mb-3',
        3: 'tw:text-xl tw:font-semibold tw:mb-2',
        4: 'tw:text-lg tw:font-semibold tw:mb-2',
        5: 'tw:text-base tw:font-semibold tw:mb-1',
        6: 'tw:text-sm tw:font-semibold tw:mb-1',
      };
      return (
        <Tag key={`h-${index}`} className={`${sizeMap[n.level]} tw:text-text-primary`}>
          {renderInlineChildren(n.children)}
        </Tag>
      );
    }

    case 'list': {
      const n = node as ListNode;
      const Tag = n.ordered ? 'ol' : 'ul';
      return (
        <Tag key={`list-${index}`} className={`tw:mb-3 tw:pl-5 tw:space-y-1 ${n.ordered ? 'tw:list-decimal' : 'tw:list-disc'}`}>
          {n.items.map((item, i) => (
            <li key={`li-${i}`} className="tw:text-base tw:text-text-primary tw:leading-relaxed">
              {renderInlineChildren(item.children)}
            </li>
          ))}
        </Tag>
      );
    }

    case 'table': {
      const n = node as TableNode;
      return (
        <div key={`table-${index}`} className="tw:overflow-x-auto tw:mb-4">
          <table className="tw:w-full tw:border-collapse tw:text-sm">
            {n.headers && (
              <thead>
                <tr className="tw:bg-bg-muted">
                  {n.headers.cells.map((cell, ci) => (
                    <th
                      key={`th-${ci}`}
                      className="tw:text-left tw:px-3 tw:py-2 tw:font-semibold tw:text-text-primary tw:border tw:border-border-default"
                      colSpan={cell.colSpan}
                      rowSpan={cell.rowSpan}
                    >
                      {renderInlineChildren(cell.children)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {n.rows.map((row, ri) => (
                <tr key={`tr-${ri}`} className={ri % 2 === 0 ? '' : 'tw:bg-bg-muted'}>
                  {row.cells.map((cell, ci) => (
                    <td
                      key={`td-${ci}`}
                      className="tw:px-3 tw:py-2 tw:text-text-primary tw:border tw:border-border-default"
                      colSpan={cell.colSpan}
                      rowSpan={cell.rowSpan}
                    >
                      {renderInlineChildren(cell.children)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'blockquote': {
      const n = node as BlockquoteNode;
      return (
        <blockquote
          key={`bq-${index}`}
          className="tw:border-l-4 tw:border-brand-primary tw:pl-4 tw:py-1 tw:mb-3 tw:italic tw:text-text-secondary"
        >
          {n.children.map((child, i) => renderNode(child, i))}
        </blockquote>
      );
    }

    case 'code_block': {
      const n = node as CodeBlockNode;
      return (
        <pre
          key={`code-${index}`}
          className="tw:bg-bg-muted tw:rounded-lg tw:p-4 tw:mb-3 tw:overflow-x-auto tw:text-sm tw:font-mono tw:text-text-primary"
        >
          <code>{n.code}</code>
        </pre>
      );
    }

    case 'image': {
      const n = node as ImageNode;
      return (
        <figure key={`img-${index}`} className="tw:mb-4">
          <img
            src={n.src}
            alt={n.alt ?? ''}
            className="tw:rounded-xl tw:max-w-full tw:border tw:border-border-default"
          />
          {n.caption && (
            <figcaption className="tw:text-xs tw:text-text-secondary tw:mt-1.5 tw:text-center">
              {n.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'audio': {
      const n = node as AudioNode;
      return (
        <div key={`audio-${index}`} className="tw:mb-4">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={n.src} className="tw:w-full" />
          {n.caption && (
            <p className="tw:text-xs tw:text-text-secondary tw:mt-1">{n.caption}</p>
          )}
        </div>
      );
    }

    case 'spacer':
      return <div key={`spacer-${index}`} className="tw:h-4" />;

    case 'callout': {
      const n = node as CalloutNode;
      const style = CALLOUT_STYLES[n.variant] ?? CALLOUT_STYLES.note;
      return (
        <div
          key={`callout-${index}`}
          className="tw:rounded-xl tw:px-4 tw:py-3 tw:mb-4"
          style={{
            backgroundColor: style.bg,
            borderLeft: `3px solid ${style.border}`,
          }}
        >
          <p key="callout-label" className="tw:text-xs tw:font-semibold tw:mb-1 tw:text-text-secondary">
            {style.label}
          </p>
          {n.children.map((child, i) => renderNode(child, i))}
        </div>
      );
    }

    case 'conjugation_table': {
      const n = node as ConjugationTableNode;
      return (
        <div
          key={`conj-${index}`}
          className="tw:mb-4 tw:rounded-xl tw:overflow-hidden tw:border tw:border-border-default"
        >
          <div className="tw:bg-brand-primary tw:px-3 tw:py-2">
            <span className="tw:text-xs tw:font-semibold tw:text-white tw:uppercase tw:tracking-wider">
              {n.label}
            </span>
          </div>
          <table className="tw:w-full tw:text-sm">
            <tbody>
              {n.rows.map((row, i) => (
                <tr key={`row-${i}`} className={i % 2 === 0 ? 'tw:bg-bg-surface' : 'tw:bg-bg-muted'}>
                  <td className="tw:px-3 tw:py-2 tw:text-text-secondary tw:font-medium tw:w-1/2">
                    {row.subject}
                  </td>
                  <td className="tw:px-3 tw:py-2 tw:text-text-primary tw:font-semibold tw:italic">
                    {row.form}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'example_sentence': {
      const n = node as ExampleSentenceNode;
      return (
        <div
          key={`ex-${index}`}
          className="tw:mb-3 tw:px-4 tw:py-2.5 tw:rounded-lg tw:bg-brand-primary-light tw:border-l-2 tw:border-brand-primary"
        >
          <p className="tw:text-base tw:text-brand-primary tw:italic tw:mb-0">
            {renderInlineChildren(n.sentence)}
          </p>
          {n.translation && (
            <p className="tw:text-sm tw:text-text-secondary tw:mt-0.5">
              {n.translation}
            </p>
          )}
        </div>
      );
    }

    // list_item, table_row, table_cell are rendered as part of their parents
    case 'list_item':
    case 'table_row':
    case 'table_cell':
      return null;

    default:
      return null;
  }
}

// ── Public component ────────────────────────────────────────────

interface RichContentRendererProps {
  nodes: ContentNode[];
  className?: string;
}

export function RichContentRenderer({ nodes, className = '' }: RichContentRendererProps) {
  return (
    <div className={`tw:text-base tw:text-text-primary ${className}`}>
      {nodes.map((node, i) => renderNode(node, i))}
    </div>
  );
}
