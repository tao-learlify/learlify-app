// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Domain String Types
// ─────────────────────────────────────────────────────────────
// Domain-specific string literal union types used across the
// course schema. Replaces v1 TypeScript enums with string
// literal unions for two reasons:
//
//   1. JSON compatibility: enum member types (e.g.
//      ContentNodeType.Paragraph) are distinct from their string
//      value ("paragraph") in TypeScript's type system. String
//      literal unions eliminate this mismatch, so JSON data can
//      be typed directly without casting or enum imports.
//
//   2. Zero runtime cost: string literal unions have no emitted
//      JavaScript representation, unlike enums which become IIFE
//      objects in the compiled output.
//
// CEFRLevel lives in primitives.ts (canonical location).
// ReviewMode and related review types live in review.ts.
// ExamProductType has been removed — use ExamRef from
// primitives.ts for exam identity.
// ─────────────────────────────────────────────────────────────

// ── Skill Type ────────────────────────────────────────────────

/**
 * Language skill category targeted by a section.
 */
export type SkillType =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

// ── Block Type ────────────────────────────────────────────────

/**
 * Block-level content type within a section.
 * Each value maps to exactly one renderer component.
 * Discriminant field: `block.type`
 */
export type BlockType =
  | "theory"
  | "exercise"
  | "media"
  | "instruction"
  | "divider";

// ── Exercise Type ─────────────────────────────────────────────

/**
 * Discriminant type for exercise variants.
 * Grouped by interaction family for renderer routing:
 *
 *   Selection family:  multiple_choice | true_false | listening_select
 *   Input family:      fill_in_the_blank | gap_select
 *   Ordering family:   ordering | drag_drop
 *   Pairing family:    matching
 *   Speaking family:   speaking_open | speaking_image
 *   Writing family:    writing_open | writing_form
 */
export type ExerciseType =
  | "multiple_choice"
  | "fill_in_the_blank"
  | "gap_select"
  | "ordering"
  | "matching"
  | "speaking_open"
  | "speaking_image"
  | "writing_open"
  | "writing_form"
  | "listening_select"
  | "true_false"
  | "drag_drop";

/**
 * High-level exercise family used for renderer routing and
 * analytics grouping. Renderers can branch on family first,
 * then on the specific type, reducing switch-case depth.
 */
export type ExerciseFamily =
  | "selection"  // multiple_choice, true_false, listening_select
  | "input"      // fill_in_the_blank, gap_select
  | "ordering"   // ordering, drag_drop
  | "pairing"    // matching
  | "speaking"   // speaking_open, speaking_image
  | "writing";   // writing_open, writing_form

/**
 * Maps each ExerciseType to its ExerciseFamily.
 * Use this lookup in renderers and analytics pipelines.
 */
export const EXERCISE_FAMILY: Record<ExerciseType, ExerciseFamily> = {
  multiple_choice: "selection",
  true_false: "selection",
  listening_select: "selection",
  fill_in_the_blank: "input",
  gap_select: "input",
  ordering: "ordering",
  drag_drop: "ordering",
  matching: "pairing",
  speaking_open: "speaking",
  speaking_image: "speaking",
  writing_open: "writing",
  writing_form: "writing",
};

// ── Difficulty Level ──────────────────────────────────────────

/**
 * CEFR-aligned difficulty level.
 * Alias for `CEFRLevel` from primitives.ts — re-exported here
 * for migration compatibility and for files that already import
 * from enums.ts without loading primitives.ts directly.
 *
 * Prefer importing `CEFRLevel` from `./primitives` in new code.
 */
export type DifficultyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ── Scoring Mode ──────────────────────────────────────────────

/**
 * How an exercise result is scored.
 *
 *   binary   — correct or incorrect (0 or full XP)
 *   partial  — partial credit for partially correct answers
 *   rubric   — rubric-based scoring for open-ended responses
 *   unscored — practice/exploration; no score recorded
 */
export type ScoringMode = "binary" | "partial" | "rubric" | "unscored";

// ── Content Node Type ─────────────────────────────────────────

/**
 * Discriminant for structured content nodes.
 * Used as the `type` field in ContentNode interfaces.
 * Discriminant field: `node.type`
 */
export type ContentNodeType =
  | "paragraph"
  | "heading"
  | "list"
  | "list_item"
  | "table"
  | "table_row"
  | "table_cell"
  | "blockquote"
  | "code_block"
  | "image"
  | "audio"
  | "spacer"
  | "callout"
  | "conjugation_table"
  | "example_sentence";

// ── Text Mark Type ────────────────────────────────────────────

/**
 * Inline text formatting marks applied to InlineText spans.
 * Discriminant field: `mark.type`
 */
export type TextMark =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "highlight"
  | "color";
