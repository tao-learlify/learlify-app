// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Rich Text & Content Nodes
// ─────────────────────────────────────────────────────────────
// Replaces embedded HTML strings with a typed, portable
// content-node tree. Every piece of formatted text is expressed
// as a tree of ContentNode objects, each containing an array of
// InlineText spans with optional formatting marks.
//
// v2 changes from v1:
//   • Interface `type` discriminants use string literals instead
//     of enum member types (e.g. `"paragraph"` not
//     `ContentNodeType.Paragraph`). This removes the TypeScript
//     enum/string-literal incompatibility that caused errors
//     when assigning JSON data directly to ContentNode types.
//   • `ContentNodeType` and `TextMark` imports from enums.ts
//     are removed; types are now inlined as string literals.
// ─────────────────────────────────────────────────────────────

// ── Inline Text ──────────────────────────────────────────────

/**
 * A formatting mark applied to a text span.
 * Most marks are boolean flags; `color` and `highlight` carry optional values.
 */
export type Mark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "underline" }
  | { type: "strikethrough" }
  | { type: "highlight"; color?: string }
  | { type: "color"; value: string };

/**
 * An inline text span with optional formatting marks.
 *
 * Example: The HTML `<strong>swims</strong>` becomes:
 * ```ts
 * { text: "swims", marks: [{ type: "bold" }] }
 * ```
 */
export interface InlineText {
  text: string;
  marks?: Mark[];
}

// ── Content Nodes (block-level) ──────────────────────────────

export interface ParagraphNode {
  type: "paragraph";
  children: InlineText[];
}

export interface HeadingNode {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineText[];
}

export interface ListNode {
  type: "list";
  ordered: boolean;
  items: ListItemNode[];
}

export interface ListItemNode {
  type: "list_item";
  children: InlineText[];
}

export interface TableNode {
  type: "table";
  headers?: TableRowNode;
  rows: TableRowNode[];
}

export interface TableRowNode {
  type: "table_row";
  cells: TableCellNode[];
}

export interface TableCellNode {
  type: "table_cell";
  children: InlineText[];
  colSpan?: number;
  rowSpan?: number;
}

export interface BlockquoteNode {
  type: "blockquote";
  children: ContentNode[];
}

export interface CodeBlockNode {
  type: "code_block";
  language?: string;
  code: string;
}

export interface ImageNode {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
}

export interface AudioNode {
  type: "audio";
  src: string;
  transcript?: string;
  caption?: string;
}

export interface SpacerNode {
  type: "spacer";
}

/**
 * A highlighted callout box for tips, warnings, notes, etc.
 */
export interface CalloutNode {
  type: "callout";
  variant: "tip" | "warning" | "note" | "example";
  children: ContentNode[];
}

/**
 * A structured conjugation/declension table for grammar content.
 * Replaces Bootstrap-grid-based conjugation layouts in legacy HTML.
 *
 * Example: Present Simple conjugation:
 * ```ts
 * {
 *   type: "conjugation_table",
 *   label: "Affirmative",
 *   rows: [
 *     { subject: "I, you, we, they", form: "swim" },
 *     { subject: "He, she, it",      form: "swims" }
 *   ]
 * }
 * ```
 */
export interface ConjugationTableNode {
  type: "conjugation_table";
  label: string;
  rows: { subject: string; form: string }[];
}

/**
 * A single example sentence with optional translation.
 * Replaces inline `<em style="color:blue">` patterns in legacy HTML.
 */
export interface ExampleSentenceNode {
  type: "example_sentence";
  sentence: InlineText[];
  translation?: string;
}

// ── Discriminated Union ──────────────────────────────────────

/**
 * All possible content nodes. Discriminated on `type`.
 * Used in theory blocks and instruction blocks.
 *
 * JSON data with a `type` string field (e.g. `{ type: "paragraph", ... }`)
 * satisfies the corresponding node interface directly, without needing
 * enum imports or casts.
 */
export type ContentNode =
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | BlockquoteNode
  | CodeBlockNode
  | ImageNode
  | AudioNode
  | SpacerNode
  | CalloutNode
  | ConjugationTableNode
  | ExampleSentenceNode;

/**
 * A rich-text body: an ordered array of content nodes.
 * The top-level content container for theory blocks,
 * instructions, and any other rich formatted content.
 */
export type RichContent = ContentNode[];
