// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Content Hierarchy
// ─────────────────────────────────────────────────────────────
// Defines the tree structure: Course → Unit → Section → Block
//
// v2 changes from v1:
//   • Course is the unambiguous root entity. The bidirectional
//     v1 coupling (Course.examProduct AND ExamProduct.courses[])
//     is resolved: Course embeds an ExamRef value object.
//   • ExamProduct as a container type is removed. Query/grouping
//     by exam is a view/service concern, not a schema concern.
//   • ExamRef (from primitives.ts) replaces ExamProductType enum
//     on Course, supporting any provider/exam pair.
//   • Unit gains subtitle, learningObjective, estimatedDurationMin,
//     and theme — the full identity and UX-theming surface.
//   • Section gains unlockRule — progressive unlock support.
//   • DifficultyLevel is re-exported from enums.ts for compat;
//     CEFRLevel from primitives.ts is the canonical type.
// ─────────────────────────────────────────────────────────────

import { SkillType } from "./enums";
import { ExamRef, UnitTheme, UnlockRule, CEFRLevel } from "./primitives";
import { Block } from "./blocks";

// ── Section ───────────────────────────────────────────────────

/**
 * A section groups related blocks under a single language skill.
 * One unit typically has one section per skill (grammar,
 * vocabulary, listening, speaking, reading, writing).
 *
 * `unlockRule` gates this section behind a prerequisite.
 * Omitting it is equivalent to `{ type: "always" }`.
 */
export interface Section {
  id: string;
  /** Language skill this section targets */
  skill: SkillType;
  /** Display title, e.g. "Grammar — Present Simple" */
  title: string;
  /** Ordered sequence of content/exercise blocks */
  blocks: Block[];
  /** Whether completing this section awards progress toward the unit */
  awardsProgress: boolean;
  /**
   * Progressive unlock condition.
   * Omitting means always accessible (same as `{ type: "always" }`).
   */
  unlockRule?: UnlockRule;
}

// ── Unit ──────────────────────────────────────────────────────

/**
 * A unit is a self-contained learning module within a course.
 * Each unit has an identity (id, order, title), pedagogical
 * metadata (subtitle, learningObjective, estimatedDurationMin),
 * an optional visual theme, and an ordered list of sections.
 *
 * `difficulty` indicates the CEFR level of this unit's content.
 * It may differ from the course's overall target level —
 * for example, a B2 course may include A2 review units.
 */
export interface Unit {
  id: string;
  /** 1-based display order within the course */
  order: number;
  /** Primary display title, e.g. "Unit 1 — Daily Routines" */
  title: string;
  /**
   * Secondary title or theme label shown below the main title.
   * e.g. "Talking about habits and schedules"
   */
  subtitle?: string;
  /**
   * A single-sentence learning objective for this unit.
   * e.g. "By the end of this unit you will be able to describe
   * your daily routine using Present Simple."
   */
  learningObjective?: string;
  /**
   * Approximate time to complete all sections in minutes.
   * Used for progress estimation and course-duration display.
   */
  estimatedDurationMin?: number;
  /** CEFR difficulty level of this unit's content */
  difficulty?: CEFRLevel;
  /**
   * Visual theme tokens for this unit's UI presentation.
   * Contains only CSS-compatible values — no component coupling.
   * See UnitTheme in primitives.ts.
   */
  theme?: UnitTheme;
  /**
   * Legacy prose description of the unit.
   * Prefer `subtitle` + `learningObjective` for new content.
   * Retained for migration compatibility.
   */
  description?: string;
  /** Ordered list of sections (one per skill, typically) */
  sections: Section[];
  /** Arbitrary content tags for filtering and analytics */
  tags?: string[];
}

// ── Course ────────────────────────────────────────────────────

/**
 * Course-level administrative metadata.
 * Optional — not all courses require authorship or version records.
 */
export interface CourseMetadata {
  /** Author display name or team identifier */
  author?: string;
  /** ISO 8601 date-time of last content update */
  updatedAt?: string;
  /** Semantic version string, e.g. "2.1.0" */
  version?: string;
  /** Estimated total completion time in hours */
  estimatedHours?: number;
  /** CDN URL or asset key for the course cover image */
  coverImage?: string;
}

/**
 * A course is the top-level content entity.
 *
 * v2: Course is the root. Exam metadata is an embedded ExamRef
 * value object. There is no ExamProduct container wrapping
 * courses — grouping courses by exam provider is a query
 * concern handled at the service/API layer.
 *
 * `schemaVersion` must be bumped when breaking schema changes
 * are introduced. Consumers should validate this field before
 * parsing. Recommended: semantic versioning, e.g. "2.0.0".
 */
export interface Course {
  id: string;
  /**
   * Normalized exam reference replacing v1's ExamProductType enum.
   * Supports any provider/exam combination without schema changes.
   * Example: { provider: "british_council", exam: "aptis_general" }
   */
  examRef: ExamRef;
  /** Display title of the course */
  title: string;
  /** Optional prose description for catalogue display */
  description?: string;
  /**
   * Schema version of this document.
   * Consumers must check this before parsing.
   * Use "2.0.0" for documents conforming to this v2 schema.
   */
  schemaVersion: string;
  /**
   * BCP 47 language code for the language of instruction.
   * e.g. "en", "en-GB", "es"
   */
  language: string;
  /**
   * CEFR level range this course covers.
   * `from` may equal `to` for single-level courses.
   */
  targetLevel?: { from: CEFRLevel; to: CEFRLevel };
  /**
   * Declared unit count.
   * Should match `units.length` — validated by CourseSchema.
   */
  totalUnits: number;
  /** Ordered array of course units */
  units: Unit[];
  /** Optional administrative metadata */
  metadata?: CourseMetadata;
}
