// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Shared Primitives
// ─────────────────────────────────────────────────────────────
// Domain primitives shared across hierarchy, exercises, and
// blocks. No imports from other schema modules — this is the
// foundation layer.
//
// Design decisions:
//   • CEFRLevel replaces the split DifficultyLevel / targetLevel
//     enums with a single canonical type used everywhere.
//   • ExamRef replaces ExamProductType enum, enabling any
//     provider/exam pair without requiring schema changes.
//   • UnlockRule models gating as a tagged discriminated union
//     rather than booleans, supporting future condition types.
//   • UnitTheme carries design tokens only — no React props,
//     no CSS class names, no component names. Renderer-agnostic.
// ─────────────────────────────────────────────────────────────

// ── CEFR Proficiency Level ───────────────────────────────────

/**
 * A canonical CEFR proficiency level.
 * Used for unit difficulty, course target level, and exercise
 * difficulty throughout the schema. Single source of truth —
 * replaces v1's split `DifficultyLevel` enum.
 */
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ── Exam Reference ────────────────────────────────────────────

/**
 * A normalized exam reference that decouples exam identity from
 * a rigid enum. Supports any provider/exam combination without
 * requiring a schema change when new exams are onboarded.
 *
 * Replaces v1's `ExamProductType` enum and the `ExamProduct`
 * container type. Course is now the root entity; exam metadata
 * is an embedded reference, not a parent container.
 *
 * Examples:
 * ```ts
 * { provider: "british_council", exam: "aptis_general" }
 * { provider: "cambridge",       exam: "b2_first",          variant: "for_schools" }
 * { provider: "ets",             exam: "toefl_ibt",         level: "B2" }
 * { provider: "cambridge",       exam: "ielts",             variant: "academic" }
 * ```
 */
export interface ExamRef {
  /** Issuing organisation slug, e.g. "british_council", "cambridge", "ets" */
  provider: string;
  /** Exam slug, e.g. "aptis_general", "b2_first", "ielts_academic" */
  exam: string;
  /** Sub-variant of the exam, e.g. "general", "advanced", "for_schools" */
  variant?: string;
  /** Target CEFR level this course prepares for */
  level?: CEFRLevel;
}

// ── Unlock Rule ───────────────────────────────────────────────

/**
 * A progressive unlock condition for sections and blocks.
 *
 * Discriminated on `type`:
 *   • `always`           — no gate; item is always accessible
 *   • `after_block`      — requires the referenced block to be completed
 *   • `after_section`    — requires the referenced section to be completed
 *   • `score_threshold`  — requires a minimum score on a referenced item
 *
 * `refId` references the id of the block or section that must be
 * satisfied. The progress engine resolves the rule; this type
 * carries only the data, not the evaluation logic.
 */
export type UnlockRule =
  | { type: "always" }
  | { type: "after_block"; refId: string }
  | { type: "after_section"; refId: string }
  | { type: "score_threshold"; refId: string; value: number };

// ── Unit Theme ────────────────────────────────────────────────

/**
 * Visual theme tokens scoped to a single unit.
 *
 * Contains only CSS-compatible values and semantic hints —
 * no component names, CSS class names, or framework-specific
 * props. The renderer is responsible for applying these tokens
 * to its own component primitives.
 *
 * `mood` is a vocabulary hint for animation and pacing systems;
 * renderers may ignore it if they do not support it.
 */
export interface UnitTheme {
  /** Human-readable theme label for debugging and CMS display */
  name: string;
  /** Primary accent colour, e.g. "#3B82F6" */
  accent: string;
  /** Lighter accent for backgrounds and highlights, e.g. "#DBEAFE" */
  accentSoft: string;
  /** Card/surface background colour, e.g. "#F0F9FF" */
  surface: string;
  /** Icon key (design-system token) or CDN URL */
  icon?: string;
  /** Optional mood vocabulary for animation/pacing systems */
  mood?: "calm" | "energetic" | "focused" | "playful";
}
