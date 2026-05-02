// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Exercise Definitions
// ─────────────────────────────────────────────────────────────
// An Exercise is a pure content definition: what the student
// sees and interacts with. It carries no review configuration,
// no scoring rules, and no XP values — those live on the
// ExerciseBlock that wraps it.
//
// v2 changes from v1:
//   • `reviewMode` removed from SpeakingOpen, SpeakingImage,
//     WritingOpen, WritingForm variants. It now lives on
//     ExerciseBlock.review (see blocks.ts), separating
//     pedagogy (what to do) from evaluation (how to score).
//   • Type discriminants use string literals, not enum members,
//     eliminating the JSON assignment incompatibility.
//   • Exercises are grouped by ExerciseFamily in the comments
//     and in the EXERCISE_FAMILY lookup map (enums.ts).
//   • ExerciseInteraction remains here as the pure behavior
//     contract (XP, retries, shuffle, scoring, time limit).
// ─────────────────────────────────────────────────────────────

import { ExerciseType, ScoringMode, DifficultyLevel } from "./enums";
import { RichContent } from "./content";
import { AudioAsset, ImageAsset } from "./assets";

// ── Answer Option ─────────────────────────────────────────────

/**
 * A selectable answer choice for multiple-choice and gap-select
 * exercise questions.
 */
export interface AnswerOption {
  id: string;
  text: string;
  /** Optional image for visual answer choices */
  image?: ImageAsset;
}

// ── Exercise Question ─────────────────────────────────────────

/**
 * A single question item within an exercise.
 *
 * Not all fields apply to every exercise type — the exercise
 * variant determines which fields are meaningful:
 *   - `options` / `correctOptionId`  → selection exercises
 *   - `acceptedAnswers`              → input exercises
 *   - `audio`                        → listening exercises
 *   - `image` / `images`             → speaking-image, visual exercises
 *   - `subtitle`                     → speaking exercises (spoken prompt)
 *   - `order`                        → ordering exercises (correct position)
 */
export interface ExerciseQuestion {
  id: string;
  /** Plain-text prompt shown above the question */
  prompt: string;
  /** Structured rich-text prompt (replaces or supplements `prompt`) */
  richPrompt?: RichContent;
  /** Selectable choices for selection-family exercises */
  options?: AnswerOption[];
  /** The id of the correct AnswerOption (selection exercises) */
  correctOptionId?: string;
  /** Accepted string answers for input exercises */
  acceptedAnswers?: string[];
  /** Audio asset for listening exercises */
  audio?: AudioAsset;
  /** Single image for speaking-image or visual prompts */
  image?: ImageAsset;
  /** Multiple images (e.g. picture galleries in speaking exercises) */
  images?: ImageAsset[];
  /** Spoken subtitle/caption displayed during recording */
  subtitle?: string;
  /** Correct position index for ordering exercises */
  order?: number;
}

// ── Exercise Base ─────────────────────────────────────────────

/**
 * Common fields shared by all exercise variants.
 * Extended by each specific exercise interface.
 */
export interface ExerciseBase {
  id: string;
  type: ExerciseType;
  /** Short display label (e.g. "Exercise 1", "Speaking Task") */
  label: string;
  /** Plain-text description/instruction shown to the student */
  description: string;
  /** Structured rich-text description (replaces or supplements `description`) */
  richDescription?: RichContent;
  /** Ordered list of question items */
  questions: ExerciseQuestion[];
}

// ── Selection Family ──────────────────────────────────────────
// Exercises where the student selects from presented options.

/** Student picks the correct answer from a set of choices. */
export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple_choice";
}

/** Listen to audio then select the correct answer. */
export interface ListeningSelectExercise extends ExerciseBase {
  type: "listening_select";
  /** Audio played before or during the exercise */
  audio: AudioAsset;
}

/** Binary true/false or yes/no selection. */
export interface TrueFalseExercise extends ExerciseBase {
  type: "true_false";
}

// ── Input Family ──────────────────────────────────────────────
// Exercises where the student types a response.

/** Student types the missing word(s) into blank fields. */
export interface FillInTheBlankExercise extends ExerciseBase {
  type: "fill_in_the_blank";
}

/** Student selects missing words from a provided word bank. */
export interface GapSelectExercise extends ExerciseBase {
  type: "gap_select";
  /** Pool of words to choose from (subset used per question) */
  wordBank?: string[];
}

// ── Ordering Family ───────────────────────────────────────────
// Exercises where the student arranges items into correct order.

/** Student reorders shuffled items into the correct sequence. */
export interface OrderingExercise extends ExerciseBase {
  type: "ordering";
}

/** Student drags items into categories or blank drop zones. */
export interface DragDropExercise extends ExerciseBase {
  type: "drag_drop";
}

// ── Pairing Family ────────────────────────────────────────────
// Exercises where the student connects pairs of related items.

/** Student matches item pairs (e.g. word ↔ definition). */
export interface MatchingExercise extends ExerciseBase {
  type: "matching";
}

// ── Speaking Family ───────────────────────────────────────────
// Exercises where the student records a spoken response.
// Review configuration (auto/human/ai/hybrid) lives on
// ExerciseBlock.review — NOT on these exercise definitions.

/**
 * Student records a spoken response to a text prompt.
 * No review configuration here — see ExerciseBlock.review.
 */
export interface SpeakingOpenExercise extends ExerciseBase {
  type: "speaking_open";
  /** Maximum allowed recording duration in seconds */
  recordingTimeSec: number;
}

/**
 * Student records a spoken response to an image prompt.
 * No review configuration here — see ExerciseBlock.review.
 */
export interface SpeakingImageExercise extends ExerciseBase {
  type: "speaking_image";
  /** Maximum allowed recording duration in seconds */
  recordingTimeSec: number;
}

// ── Writing Family ────────────────────────────────────────────
// Exercises where the student writes a text response.
// Review configuration (auto/human/ai/hybrid) lives on
// ExerciseBlock.review — NOT on these exercise definitions.

/**
 * Student writes a free-form text response.
 * No review configuration here — see ExerciseBlock.review.
 */
export interface WritingOpenExercise extends ExerciseBase {
  type: "writing_open";
  /** Target word count range for the response */
  wordRange?: { min: number; max: number };
}

/**
 * Student fills in structured short-answer form fields.
 * No review configuration here — see ExerciseBlock.review.
 */
export interface WritingFormExercise extends ExerciseBase {
  type: "writing_form";
  /** Guidance word limit shown to the student (e.g. "20–30 words") */
  wordLimit?: string;
}

// ── Exercise Discriminated Union ──────────────────────────────

/**
 * Discriminated union of all exercise variants.
 * Discriminant: `exercise.type`
 *
 * Renderer routing strategy (two-level):
 * ```ts
 * import { EXERCISE_FAMILY } from "./enums";
 *
 * // Level 1: route by family
 * const family = EXERCISE_FAMILY[exercise.type];
 * switch (family) {
 *   case "selection": return <SelectionRenderer exercise={exercise} />;
 *   case "speaking":  return <SpeakingRenderer  exercise={exercise} />;
 *   // ...
 * }
 *
 * // Level 2: route by specific type inside each family renderer
 * switch (exercise.type) {
 *   case "speaking_open":  return <SpeakingOpenView  exercise={exercise} />;
 *   case "speaking_image": return <SpeakingImageView exercise={exercise} />;
 * }
 * ```
 */
export type Exercise =
  // Selection
  | MultipleChoiceExercise
  | ListeningSelectExercise
  | TrueFalseExercise
  // Input
  | FillInTheBlankExercise
  | GapSelectExercise
  // Ordering
  | OrderingExercise
  | DragDropExercise
  // Pairing
  | MatchingExercise
  // Speaking
  | SpeakingOpenExercise
  | SpeakingImageExercise
  // Writing
  | WritingOpenExercise
  | WritingFormExercise;

// ── Exercise Interaction ──────────────────────────────────────

/**
 * Interaction and scoring rules for an exercise block.
 * Lives on ExerciseBlock alongside the Exercise definition.
 *
 * This separates pure content (Exercise) from behavior rules
 * (ExerciseInteraction), enabling the same exercise definition
 * to be reused with different XP values, time limits, or
 * scoring modes across different contexts.
 */
export interface ExerciseInteraction {
  /** XP awarded on successful completion */
  xp: number;
  /** Optional CEFR difficulty label for this specific block */
  difficulty?: DifficultyLevel;
  /** Whether the student can attempt the exercise more than once */
  retryable: boolean;
  /** Whether option order should be randomized per attempt */
  shuffleOptions: boolean;
  /** Scoring algorithm to apply */
  scoringMode: ScoringMode;
  /** Optional hard time limit in seconds (activates a countdown UI) */
  timeLimitSec?: number;
  /** Exam simulation mode — disables hints and feedback until complete */
  examMode: boolean;
}
