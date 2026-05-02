// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Public API
// ─────────────────────────────────────────────────────────────
// Single import surface for all schema types and Zod validators.
//
// Import pattern:
//   import type { Course, Unit, Exercise } from "schemas/course";
//   import { CourseSchema, ExerciseSchema } from "schemas/course";
// ─────────────────────────────────────────────────────────────

// ── Primitives ────────────────────────────────────────────────
export type { CEFRLevel, ExamRef, UnlockRule, UnitTheme } from "./primitives";

// ── Review system ─────────────────────────────────────────────
export type {
  ReviewMode,
  FeedbackStatus,
  QueueState,
  ExerciseReview,
} from "./review";

// ── String types (formerly enums) ─────────────────────────────
export type {
  SkillType,
  BlockType,
  ExerciseType,
  ExerciseFamily,
  DifficultyLevel,
  ScoringMode,
  ContentNodeType,
  TextMark,
} from "./enums";

// EXERCISE_FAMILY is a runtime value — must be a value export, not type
export { EXERCISE_FAMILY } from "./enums";

// ── Content nodes & rich text ─────────────────────────────────
export type {
  Mark,
  InlineText,
  ContentNode,
  RichContent,
  ParagraphNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  BlockquoteNode,
  CodeBlockNode,
  ImageNode,
  AudioNode,
  SpacerNode,
  CalloutNode,
  ConjugationTableNode,
  ExampleSentenceNode,
} from "./content";

// ── Assets ────────────────────────────────────────────────────
export type { AudioAsset, ImageAsset } from "./assets";

// ── Exercises ─────────────────────────────────────────────────
export type {
  AnswerOption,
  ExerciseQuestion,
  ExerciseBase,
  Exercise,
  ExerciseInteraction,
  // Selection family
  MultipleChoiceExercise,
  ListeningSelectExercise,
  TrueFalseExercise,
  // Input family
  FillInTheBlankExercise,
  GapSelectExercise,
  // Ordering family
  OrderingExercise,
  DragDropExercise,
  // Pairing family
  MatchingExercise,
  // Speaking family
  SpeakingOpenExercise,
  SpeakingImageExercise,
  // Writing family
  WritingOpenExercise,
  WritingFormExercise,
} from "./exercises";

// ── Blocks ────────────────────────────────────────────────────
export type {
  Block,
  TheoryBlock,
  ExerciseBlock,
  MediaBlock,
  InstructionBlock,
  DividerBlock,
} from "./blocks";

// ── Hierarchy ─────────────────────────────────────────────────
export type {
  Section,
  Unit,
  Course,
  CourseMetadata,
} from "./hierarchy";

// ── Zod validation schemas ─────────────────────────────────────
export {
  // Primitives
  CEFRLevelSchema,
  DifficultyLevelSchema,
  ExamRefSchema,
  UnlockRuleSchema,
  UnitThemeSchema,
  // Review
  ReviewModeSchema,
  FeedbackStatusSchema,
  QueueStateSchema,
  ExerciseReviewSchema,
  // Enum schemas
  SkillTypeSchema,
  BlockTypeSchema,
  ExerciseTypeSchema,
  ScoringModeSchema,
  ContentNodeTypeSchema,
  TextMarkTypeSchema,
  // Content schemas
  MarkSchema,
  InlineTextSchema,
  ContentNodeSchema,
  RichContentSchema,
  ParagraphNodeSchema,
  HeadingNodeSchema,
  ListNodeSchema,
  ListItemNodeSchema,
  TableNodeSchema,
  TableRowNodeSchema,
  TableCellNodeSchema,
  BlockquoteNodeSchema,
  CodeBlockNodeSchema,
  ImageNodeSchema,
  AudioNodeSchema,
  SpacerNodeSchema,
  CalloutNodeSchema,
  ConjugationTableNodeSchema,
  ExampleSentenceNodeSchema,
  // Asset schemas
  AudioAssetSchema,
  ImageAssetSchema,
  // Exercise schemas
  AnswerOptionSchema,
  ExerciseQuestionSchema,
  ExerciseSchema,
  ExerciseInteractionSchema,
  MultipleChoiceExerciseSchema,
  ListeningSelectExerciseSchema,
  TrueFalseExerciseSchema,
  FillInTheBlankExerciseSchema,
  GapSelectExerciseSchema,
  OrderingExerciseSchema,
  DragDropExerciseSchema,
  MatchingExerciseSchema,
  SpeakingOpenExerciseSchema,
  SpeakingImageExerciseSchema,
  WritingOpenExerciseSchema,
  WritingFormExerciseSchema,
  // Block schemas
  BlockSchema,
  TheoryBlockSchema,
  ExerciseBlockSchema,
  MediaBlockSchema,
  InstructionBlockSchema,
  DividerBlockSchema,
  // Hierarchy schemas
  SectionSchema,
  UnitSchema,
  CourseMetadataSchema,
  CourseSchema,
} from "./validation";
