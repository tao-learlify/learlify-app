// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Exercise Review System
// ─────────────────────────────────────────────────────────────
// Review configuration has been extracted from individual
// exercise types (v1 flaw: reviewMode was embedded inside
// SpeakingOpen/WritingOpen exercise definitions) into its own
// module that lives on the ExerciseBlock.
//
// Design decisions:
//   • ExerciseReview lives on the BLOCK, not on the exercise
//     definition. Pedagogy (what the student does) is separated
//     from evaluation (how the response is reviewed).
//   • "ai" is added as a distinct ReviewMode alongside "human"
//     and "hybrid", enabling explicit AI-only review pipelines.
//   • FeedbackStatus and QueueState model the full lifecycle of
//     a submitted open-ended response through the review system.
//   • rubricId is a foreign key to an external rubric registry;
//     this schema does not embed rubric content.
// ─────────────────────────────────────────────────────────────

// ── Review Mode ───────────────────────────────────────────────

/**
 * How an open-ended exercise response is evaluated.
 *
 *   • `auto`   — evaluated entirely by automated scoring logic
 *   • `human`  — routed to a human reviewer queue
 *   • `ai`     — evaluated by an AI model (distinct from auto-scoring rules)
 *   • `hybrid` — AI pre-scores; a human reviewer confirms or overrides
 */
export type ReviewMode = "auto" | "human" | "ai" | "hybrid";

// ── Feedback Lifecycle ────────────────────────────────────────

/**
 * Lifecycle state of a submitted response awaiting feedback.
 * Applies to `human`, `ai`, and `hybrid` review modes.
 *
 *   • `pending`    — submitted but not yet picked up
 *   • `in_review`  — actively being reviewed
 *   • `completed`  — feedback delivered to the learner
 *   • `rejected`   — submission rejected (invalid input, policy violation)
 */
export type FeedbackStatus =
  | "pending"
  | "in_review"
  | "completed"
  | "rejected";

// ── Human Review Queue State ──────────────────────────────────

/**
 * Position of a submission in the human review work queue.
 * Only meaningful when `reviewMode` is `"human"` or `"hybrid"`.
 *
 *   • `unqueued` — not yet placed into a queue
 *   • `queued`   — waiting for a reviewer to claim it
 *   • `claimed`  — a reviewer has started working on it
 *   • `done`     — review complete, feedback ready to publish
 */
export type QueueState = "unqueued" | "queued" | "claimed" | "done";

// ── Exercise Review ───────────────────────────────────────────

/**
 * Review configuration for an exercise block that produces
 * open-ended output (speaking or writing exercises).
 *
 * This object lives on `ExerciseBlock.review`, not on the
 * exercise definition itself. That separation means:
 *   - The same speaking exercise can be used in `auto` mode
 *     for practice and `human` mode for exam simulation.
 *   - Exercise definitions remain pure content; evaluation
 *     strategy is a block-level concern.
 *
 * `feedbackStatus` and `queueState` are runtime/submission
 * state fields. They are optional here because the schema
 * describes content structure, not submission state — a
 * separate submission record type should carry them in
 * practice. They are included here for cases where a compact
 * JSON representation embeds submission state inline.
 */
export interface ExerciseReview {
  /** Evaluation strategy for this exercise block */
  mode: ReviewMode;
  /**
   * Foreign key to an external rubric registry.
   * Used by AI-scoring and human-review pipelines to load
   * the correct scoring criteria. Not embedded in the schema.
   */
  rubricId?: string;
  /** Current feedback lifecycle state (runtime/submission field) */
  feedbackStatus?: FeedbackStatus;
  /** Current position in the human review queue (runtime field) */
  queueState?: QueueState;
}
