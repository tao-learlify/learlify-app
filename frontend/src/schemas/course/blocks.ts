// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Blocks
// ─────────────────────────────────────────────────────────────
// A Block is the atomic rendering unit within a Section.
// Each block maps to exactly one React component.
// Blocks are ordered in an array — the renderer walks the
// array top-to-bottom and delegates to the correct component
// based on `block.type`.
//
// v2 changes from v1:
//   • ExerciseBlock gains `review?: ExerciseReview` — the
//     review configuration that was embedded in individual
//     exercise variants (speaking, writing) is now a block-
//     level concern, decoupling content from evaluation.
//   • All block types gain `unlockRule?: UnlockRule` —
//     progressive gating at the block level (finer-grained
//     than section-level unlocking).
//   • String literal discriminants replace enum member types.
// ─────────────────────────────────────────────────────────────

import { RichContent } from "./content";
import { AudioAsset, ImageAsset } from "./assets";
import { Exercise, ExerciseInteraction } from "./exercises";
import { ExerciseReview } from "./review";
import { UnlockRule } from "./primitives";

// ── Theory Block ─────────────────────────────────────────────

/**
 * A theory/instructional block containing rich formatted content.
 *
 * Replaces legacy: `{ theory: { title, heading, subheading: "<html>..." } }`
 * Now uses a structured ContentNode tree instead of raw HTML.
 *
 * `unlockRule` gates this block behind a prerequisite.
 */
export interface TheoryBlock {
  type: "theory";
  id: string;
  /** Main heading (e.g. "Present Simple") */
  heading?: string;
  /** Subtitle or topic label */
  title?: string;
  /** Structured content body — replaces legacy `subheading` HTML */
  body: RichContent;
  /** Optional featured image (e.g. vocabulary image cards) */
  image?: ImageAsset;
  /** Progressive unlock condition. Omit for always-accessible. */
  unlockRule?: UnlockRule;
}

// ── Exercise Block ───────────────────────────────────────────

/**
 * An exercise block wrapping a typed exercise with interaction
 * metadata and optional review configuration.
 *
 * Three concerns are explicitly separated:
 *   - `exercise`    — pure content definition (what the student does)
 *   - `interaction` — behavior rules (XP, retries, scoring, timer)
 *   - `review`      — evaluation strategy (how the response is scored)
 *
 * `review` is only meaningful for open-ended exercises
 * (speaking and writing families). For auto-scored exercises,
 * it can be omitted or set to `{ mode: "auto" }`.
 *
 * This separation allows the same exercise to be used in
 * practice mode (retryable, unscored) and exam mode (single
 * attempt, rubric-scored, human reviewed) without duplicating
 * exercise content.
 */
export interface ExerciseBlock {
  type: "exercise";
  id: string;
  /** The exercise content and questions */
  exercise: Exercise;
  /** Interaction rules (XP, retries, scoring, etc.) */
  interaction: ExerciseInteraction;
  /**
   * Review/evaluation configuration for open-ended responses.
   * Carries the review mode (auto/human/ai/hybrid) and rubric reference.
   * Omit for exercises that are auto-scored by algorithm.
   */
  review?: ExerciseReview;
  /** Progressive unlock condition. Omit for always-accessible. */
  unlockRule?: UnlockRule;
}

// ── Media Block ──────────────────────────────────────────────

/**
 * A standalone media block (image gallery, audio player, video).
 * For media that exists outside of theory or exercises —
 * e.g. a pronunciation audio file or a vocabulary picture set.
 */
export interface MediaBlock {
  type: "media";
  id: string;
  images?: ImageAsset[];
  audio?: AudioAsset;
  caption?: string;
  /** Progressive unlock condition. Omit for always-accessible. */
  unlockRule?: UnlockRule;
}

// ── Instruction Block ────────────────────────────────────────

/**
 * A standalone instruction or callout block.
 * For section-level instructions that are not part of a theory
 * or exercise block — e.g. exam task instructions.
 */
export interface InstructionBlock {
  type: "instruction";
  id: string;
  body: RichContent;
  /** Progressive unlock condition. Omit for always-accessible. */
  unlockRule?: UnlockRule;
}

// ── Divider Block ────────────────────────────────────────────

/**
 * A visual separator between content groups within a section.
 */
export interface DividerBlock {
  type: "divider";
  id: string;
}

// ── Block Union ──────────────────────────────────────────────

/**
 * Discriminated union of all block types.
 * Discriminant: `block.type`
 *
 * Renderer pattern:
 * ```tsx
 * function BlockRenderer({ block }: { block: Block }) {
 *   switch (block.type) {
 *     case "theory":      return <TheoryView      block={block} />;
 *     case "exercise":    return <ExerciseView    block={block} />;
 *     case "media":       return <MediaView       block={block} />;
 *     case "instruction": return <InstructionView block={block} />;
 *     case "divider":     return <Divider />;
 *   }
 * }
 * ```
 *
 * For ExerciseView, use `block.review` to determine if a review
 * panel should be shown after submission:
 * ```tsx
 * function ExerciseView({ block }: { block: ExerciseBlock }) {
 *   const needsReview = block.review && block.review.mode !== "auto";
 *   // ...
 * }
 * ```
 */
export type Block =
  | TheoryBlock
  | ExerciseBlock
  | MediaBlock
  | InstructionBlock
  | DividerBlock;
