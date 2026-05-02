// ─────────────────────────────────────────────────────────────
// Course Content Schema v2 — Zod Validation Schemas
// ─────────────────────────────────────────────────────────────
// Runtime-safe validation for all v2 schema types.
// Each Zod schema mirrors its TypeScript interface exactly.
//
// Usage:
//   const result = CourseSchema.safeParse(jsonData);
//   if (!result.success) console.error(result.error.issues);
//
// v2 changes from v1:
//   • ExamProductTypeSchema removed — replaced by ExamRefSchema.
//   • ExamProductSchema (container) removed.
//   • ReviewModeSchema updated to include "ai" mode.
//   • ExerciseReviewSchema added (was missing in v1).
//   • Speaking/writing exercise schemas no longer include reviewMode.
//   • ExerciseBlockSchema includes optional `review` and `unlockRule`.
//   • UnitSchema includes theme, subtitle, learningObjective,
//     estimatedDurationMin.
//   • SectionSchema includes unlockRule.
//   • CourseSchema uses examRef instead of examProduct.
//   • UnlockRuleSchema is a discriminated union (4 variants).
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

// ── Primitive Schemas ─────────────────────────────────────────

export const CEFRLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

/** Migration alias — prefer CEFRLevelSchema in new code */
export const DifficultyLevelSchema = CEFRLevelSchema;

export const ExamRefSchema = z.object({
  provider: z.string().min(1),
  exam: z.string().min(1),
  variant: z.string().optional(),
  level: CEFRLevelSchema.optional(),
});

export const UnlockRuleSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("always") }),
  z.object({ type: z.literal("after_block"), refId: z.string() }),
  z.object({ type: z.literal("after_section"), refId: z.string() }),
  z.object({
    type: z.literal("score_threshold"),
    refId: z.string(),
    value: z.number().min(0).max(100),
  }),
]);

export const UnitThemeSchema = z.object({
  name: z.string(),
  accent: z.string(),
  accentSoft: z.string(),
  surface: z.string(),
  icon: z.string().optional(),
  mood: z.enum(["calm", "energetic", "focused", "playful"]).optional(),
});

// ── Review Schemas ────────────────────────────────────────────

export const ReviewModeSchema = z.enum(["auto", "human", "ai", "hybrid"]);

export const FeedbackStatusSchema = z.enum([
  "pending",
  "in_review",
  "completed",
  "rejected",
]);

export const QueueStateSchema = z.enum([
  "unqueued",
  "queued",
  "claimed",
  "done",
]);

export const ExerciseReviewSchema = z.object({
  mode: ReviewModeSchema,
  rubricId: z.string().optional(),
  feedbackStatus: FeedbackStatusSchema.optional(),
  queueState: QueueStateSchema.optional(),
});

// ── Enum/Type Schemas ─────────────────────────────────────────

export const SkillTypeSchema = z.enum([
  "grammar",
  "vocabulary",
  "listening",
  "speaking",
  "reading",
  "writing",
]);

export const BlockTypeSchema = z.enum([
  "theory",
  "exercise",
  "media",
  "instruction",
  "divider",
]);

export const ExerciseTypeSchema = z.enum([
  "multiple_choice",
  "fill_in_the_blank",
  "gap_select",
  "ordering",
  "matching",
  "speaking_open",
  "speaking_image",
  "writing_open",
  "writing_form",
  "listening_select",
  "true_false",
  "drag_drop",
]);

export const ScoringModeSchema = z.enum([
  "binary",
  "partial",
  "rubric",
  "unscored",
]);

export const ContentNodeTypeSchema = z.enum([
  "paragraph",
  "heading",
  "list",
  "list_item",
  "table",
  "table_row",
  "table_cell",
  "blockquote",
  "code_block",
  "image",
  "audio",
  "spacer",
  "callout",
  "conjugation_table",
  "example_sentence",
]);

export const TextMarkTypeSchema = z.enum([
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "highlight",
  "color",
]);

// ── Inline Text Schemas ──────────────────────────────────────

export const MarkSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bold") }),
  z.object({ type: z.literal("italic") }),
  z.object({ type: z.literal("underline") }),
  z.object({ type: z.literal("strikethrough") }),
  z.object({ type: z.literal("highlight"), color: z.string().optional() }),
  z.object({ type: z.literal("color"), value: z.string() }),
]);

export const InlineTextSchema = z.object({
  text: z.string(),
  marks: z.array(MarkSchema).optional(),
});

// ── Content Node Schemas ─────────────────────────────────────

export const ParagraphNodeSchema = z.object({
  type: z.literal("paragraph"),
  children: z.array(InlineTextSchema),
});

export const HeadingNodeSchema = z.object({
  type: z.literal("heading"),
  level: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
  children: z.array(InlineTextSchema),
});

export const ListItemNodeSchema = z.object({
  type: z.literal("list_item"),
  children: z.array(InlineTextSchema),
});

export const ListNodeSchema = z.object({
  type: z.literal("list"),
  ordered: z.boolean(),
  items: z.array(ListItemNodeSchema),
});

export const TableCellNodeSchema = z.object({
  type: z.literal("table_cell"),
  children: z.array(InlineTextSchema),
  colSpan: z.number().optional(),
  rowSpan: z.number().optional(),
});

export const TableRowNodeSchema = z.object({
  type: z.literal("table_row"),
  cells: z.array(TableCellNodeSchema),
});

export const TableNodeSchema = z.object({
  type: z.literal("table"),
  headers: TableRowNodeSchema.optional(),
  rows: z.array(TableRowNodeSchema),
});

export const CodeBlockNodeSchema = z.object({
  type: z.literal("code_block"),
  language: z.string().optional(),
  code: z.string(),
});

export const ImageNodeSchema = z.object({
  type: z.literal("image"),
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const AudioNodeSchema = z.object({
  type: z.literal("audio"),
  src: z.string(),
  transcript: z.string().optional(),
  caption: z.string().optional(),
});

export const SpacerNodeSchema = z.object({
  type: z.literal("spacer"),
});

// Forward-declared for recursive BlockquoteNode and CalloutNode
export const ContentNodeSchema: z.ZodType = z.lazy(() =>
  z.discriminatedUnion("type", [
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
  ])
);

export const BlockquoteNodeSchema = z.object({
  type: z.literal("blockquote"),
  children: z.array(ContentNodeSchema),
});

export const CalloutNodeSchema = z.object({
  type: z.literal("callout"),
  variant: z.enum(["tip", "warning", "note", "example"]),
  children: z.array(ContentNodeSchema),
});

export const ConjugationTableNodeSchema = z.object({
  type: z.literal("conjugation_table"),
  label: z.string(),
  rows: z.array(
    z.object({
      subject: z.string(),
      form: z.string(),
    })
  ),
});

export const ExampleSentenceNodeSchema = z.object({
  type: z.literal("example_sentence"),
  sentence: z.array(InlineTextSchema),
  translation: z.string().optional(),
});

export const RichContentSchema = z.array(ContentNodeSchema);

// ── Asset Schemas ────────────────────────────────────────────

export const AudioAssetSchema = z.object({
  src: z.string(),
  duration: z.number().optional(),
  mimeType: z.string().optional(),
  transcript: z.string().optional(),
});

export const ImageAssetSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// ── Exercise Schemas ─────────────────────────────────────────

export const AnswerOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  image: ImageAssetSchema.optional(),
});

export const ExerciseQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  richPrompt: RichContentSchema.optional(),
  options: z.array(AnswerOptionSchema).optional(),
  correctOptionId: z.string().optional(),
  acceptedAnswers: z.array(z.string()).optional(),
  audio: AudioAssetSchema.optional(),
  image: ImageAssetSchema.optional(),
  images: z.array(ImageAssetSchema).optional(),
  subtitle: z.string().optional(),
  order: z.number().optional(),
});

const ExerciseBaseSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  richDescription: RichContentSchema.optional(),
  questions: z.array(ExerciseQuestionSchema),
});

// Selection family
export const MultipleChoiceExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("multiple_choice"),
});

export const ListeningSelectExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("listening_select"),
  audio: AudioAssetSchema,
});

export const TrueFalseExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("true_false"),
});

// Input family
export const FillInTheBlankExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("fill_in_the_blank"),
});

export const GapSelectExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("gap_select"),
  wordBank: z.array(z.string()).optional(),
});

// Ordering family
export const OrderingExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("ordering"),
});

export const DragDropExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("drag_drop"),
});

// Pairing family
export const MatchingExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("matching"),
});

// Speaking family — reviewMode removed; it lives on ExerciseBlock.review
export const SpeakingOpenExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("speaking_open"),
  recordingTimeSec: z.number().positive(),
});

export const SpeakingImageExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("speaking_image"),
  recordingTimeSec: z.number().positive(),
});

// Writing family — reviewMode removed; it lives on ExerciseBlock.review
export const WritingOpenExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("writing_open"),
  wordRange: z
    .object({ min: z.number().nonnegative(), max: z.number().positive() })
    .optional(),
});

export const WritingFormExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal("writing_form"),
  wordLimit: z.string().optional(),
});

export const ExerciseSchema = z.discriminatedUnion("type", [
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
]);

export const ExerciseInteractionSchema = z.object({
  xp: z.number().nonnegative(),
  difficulty: CEFRLevelSchema.optional(),
  retryable: z.boolean(),
  shuffleOptions: z.boolean(),
  scoringMode: ScoringModeSchema,
  timeLimitSec: z.number().positive().optional(),
  examMode: z.boolean(),
});

// ── Block Schemas ────────────────────────────────────────────

export const TheoryBlockSchema = z.object({
  type: z.literal("theory"),
  id: z.string(),
  heading: z.string().optional(),
  title: z.string().optional(),
  body: RichContentSchema,
  image: ImageAssetSchema.optional(),
  unlockRule: UnlockRuleSchema.optional(),
});

export const ExerciseBlockSchema = z.object({
  type: z.literal("exercise"),
  id: z.string(),
  exercise: ExerciseSchema,
  interaction: ExerciseInteractionSchema,
  review: ExerciseReviewSchema.optional(),
  unlockRule: UnlockRuleSchema.optional(),
});

export const MediaBlockSchema = z.object({
  type: z.literal("media"),
  id: z.string(),
  images: z.array(ImageAssetSchema).optional(),
  audio: AudioAssetSchema.optional(),
  caption: z.string().optional(),
  unlockRule: UnlockRuleSchema.optional(),
});

export const InstructionBlockSchema = z.object({
  type: z.literal("instruction"),
  id: z.string(),
  body: RichContentSchema,
  unlockRule: UnlockRuleSchema.optional(),
});

export const DividerBlockSchema = z.object({
  type: z.literal("divider"),
  id: z.string(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  TheoryBlockSchema,
  ExerciseBlockSchema,
  MediaBlockSchema,
  InstructionBlockSchema,
  DividerBlockSchema,
]);

// ── Hierarchy Schemas ────────────────────────────────────────

export const SectionSchema = z.object({
  id: z.string(),
  skill: SkillTypeSchema,
  title: z.string(),
  blocks: z.array(BlockSchema),
  awardsProgress: z.boolean(),
  unlockRule: UnlockRuleSchema.optional(),
});

export const UnitSchema = z.object({
  id: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  subtitle: z.string().optional(),
  learningObjective: z.string().optional(),
  estimatedDurationMin: z.number().positive().optional(),
  difficulty: CEFRLevelSchema.optional(),
  theme: UnitThemeSchema.optional(),
  description: z.string().optional(),
  sections: z.array(SectionSchema),
  tags: z.array(z.string()).optional(),
});

export const CourseMetadataSchema = z.object({
  author: z.string().optional(),
  updatedAt: z.string().optional(),
  version: z.string().optional(),
  estimatedHours: z.number().optional(),
  coverImage: z.string().optional(),
});

export const CourseSchema = z
  .object({
    id: z.string(),
    examRef: ExamRefSchema,
    title: z.string(),
    description: z.string().optional(),
    schemaVersion: z.string(),
    language: z.string(),
    targetLevel: z
      .object({
        from: CEFRLevelSchema,
        to: CEFRLevelSchema,
      })
      .optional(),
    totalUnits: z.number().int().positive(),
    units: z.array(UnitSchema),
    metadata: CourseMetadataSchema.optional(),
  })
  .refine((course) => course.totalUnits === course.units.length, {
    message: "totalUnits must equal the number of units in the units array",
    path: ["totalUnits"],
  });
