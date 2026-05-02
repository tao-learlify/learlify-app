# Migration Guide: Legacy → New Course Content Schema

## Overview

This guide describes how to transform content from the legacy flat JSON format
(`aptis-course.json`) to the new typed schema without changing any educational
content. The migration is a **structural transformation only**.

---

## Hierarchy Mapping

```
LEGACY                           NEW SCHEMA
─────────────────────────────    ─────────────────────────────
(implicit)                   →   ExamProduct { type: "aptis" }
{ course: { order: 1 } }    →   Course { id, examProduct, units: [...] }
views[n]                     →   Unit { id, order: n+1, sections: [...] }
views[n].sections[n]         →   Section { skill, blocks: [...] }
content[n].theory            →   Block { type: "theory" }
content[n].exercise          →   Block { type: "exercise" }
```

### Key changes:
- **Explicit IDs** at every level (unit, section, block, exercise, question)
- **`schemaVersion`** on Course enables future migrations
- **`totalUnits`** replaces the top-level `units: 15` count

---

## Section Type Mapping

| Legacy `type` / `as`            | New `skill` value |
|----------------------------------|-------------------|
| `"Grammar & Vocabulary"` / `"Grammar"`    | `"grammar"`   |
| `"Grammar & Vocabulary"` / `"Vocabulary"` | `"vocabulary"` |
| `"Listening"` / `"Listening"`             | `"listening"` |
| `"Speaking"` / `"Speaking"`               | `"speaking"`  |
| `"Reading"` / `"Reading"`                 | `"reading"`   |
| `"Writing"` / `"Writing"`                 | `"writing"`   |

- The legacy `category` + `explicit` pair collapses into a single `SkillType` enum
- Section `title` can be customized independently of `skill`

---

## Theory Block Migration

### Legacy format:
```json
{
  "point": true,
  "theory": {
    "title": "Vocabulary",
    "heading": "Present Simple",
    "subheading": "<div class='row'><div class='col-4'>...</div></div>"
  }
}
```

### New format:
```typescript
{
  type: "theory",
  id: "u1-grammar-theory-1",
  heading: "Present Simple",
  title: "Vocabulary",
  body: [/* ContentNode[] */]
}
```

### HTML → ContentNode conversion rules:

| Legacy HTML pattern                       | New ContentNode type          |
|-------------------------------------------|-------------------------------|
| `<p>text</p>`                             | `ParagraphNode`               |
| `<h2>Affirmative</h2>`                    | `HeadingNode { level: 2 }`    |
| `<ol><li>...</li></ol>`                   | `ListNode { ordered: true }`  |
| `<ul><li>...</li></ul>`                   | `ListNode { ordered: false }` |
| `<strong>text</strong>`                   | `InlineText { marks: [{ type: "bold" }] }` |
| `<em>text</em>`                           | `InlineText { marks: [{ type: "italic" }] }` |
| `<span style='color: #0000ff'>text</span>` | `InlineText { marks: [{ type: "color", value: "#0000ff" }] }` |
| `<p>&nbsp;</p>`                           | `SpacerNode`                  |
| Bootstrap grid conjugation layouts        | `ConjugationTableNode`        |
| Inline example sentences with color       | `ExampleSentenceNode`         |

### Special HTML patterns:

1. **Bootstrap grid conjugation tables**: The legacy HTML uses `<div class='row'><div class='col-4'>` 
   patterns to lay out verb conjugations. These should be migrated to `ConjugationTableNode`:
   ```
   <div class='col-4'><h2>Affirmative</h2></div>
   <div class='col-8'><em>I, you, we, they <strong>swim</strong></em></div>
   ```
   →
   ```typescript
   { type: "conjugation_table", label: "Affirmative", rows: [{ subject: "I, you, we, they", form: "swim" }] }
   ```

2. **Nested formatting**: `<em><strong>text</strong></em>` → multiple marks on one span:
   ```typescript
   { text: "text", marks: [{ type: "italic" }, { type: "bold" }] }
   ```

3. **Image-only theory blocks**: Some vocabulary blocks have `imageUrl` but no `subheading`:
   ```json
   { "theory": { "heading": "Hobbies", "imageUrl": { "images": ["url"] } } }
   ```
   →
   ```typescript
   { type: "theory", id: "...", heading: "Hobbies", body: [], image: { src: "url", alt: "Hobbies" } }
   ```

---

## Exercise Migration

### Pattern 1: Multiple Choice (Grammar, Vocabulary, Reading)

**Legacy** (nested questions with `correct` as 0-based index):
```json
{
  "exercise": {
    "label": "Reading Part 3",
    "description": "Read the text and complete each gap...",
    "questions": [{
      "title": "Marc and Paul (1) {x} at some brand-name trainers.",
      "answers": [{ "title": "A. are looking" }, { "title": "B. look" }, { "title": "C. is looking" }],
      "correct": 0
    }]
  }
}
```

**New:**
```typescript
{
  type: "exercise",
  id: "u1-grammar-ex-1",
  exercise: {
    id: "...",
    type: "multiple_choice",
    label: "Reading Part 3",
    description: "Read the text and complete each gap...",
    questions: [{
      id: "q1",
      prompt: "Marc and Paul (1) ___ at some brand-name trainers.",  // {x} → ___
      options: [
        { id: "a", text: "are looking" },   // Strip "A. " prefix
        { id: "b", text: "look" },           // Strip "B. " prefix
        { id: "c", text: "is looking" },     // Strip "C. " prefix
      ],
      correctOptionId: "a",  // answers[correct].id
    }]
  },
  interaction: { xp: 10, retryable: true, shuffleOptions: false, scoringMode: "binary", examMode: false }
}
```

**Migration steps:**
1. Replace `{x}` → `___` in question title/prompt
2. Strip `A. `, `B. `, etc. prefixes from answer titles
3. Convert `correct: N` (0-based index) to `correctOptionId` referencing the option at that index
4. Generate unique IDs for exercise, questions, and options

### Pattern 2: Listening Select (flat answers)

**Legacy** (flat format, no `questions` array):
```json
{
  "point": true,
  "exercise": {
    "answers": [" 1. The people", " 2. The nature", " 3. The boat trip"],
    "correct": 0,
    "description": "Listen to Pete and Dale talk about Pete's trip. What surprised Pete most? {x}",
    "label": "Listening",
    "recordingUrl": "https://...mp3",
    "transcript": "A: Pete, hi! How was your trip..."
  }
}
```

**New:**
```typescript
{
  type: "exercise",
  id: "...",
  exercise: {
    id: "...",
    type: "listening_select",
    label: "Listening",
    description: "Listen to Pete and Dale talk about Pete's trip. What surprised Pete most?",
    audio: { src: "https://...mp3", transcript: "A: Pete, hi! How was your trip..." },
    questions: [{
      id: "q1",
      prompt: "What surprised Pete most on his trip to Peru?",  // Extract from description
      options: [
        { id: "a", text: "The people" },     // Strip " 1. " prefix
        { id: "b", text: "The nature" },
        { id: "c", text: "The boat trip" },
      ],
      correctOptionId: "a",
    }]
  },
  interaction: { xp: 10, retryable: true, shuffleOptions: false, scoringMode: "binary", examMode: false }
}
```

**Migration steps:**
1. Move `recordingUrl` + `transcript` into `audio: AudioAsset`
2. Wrap the flat answers into a normalized `questions[0]` with `options`
3. Strip numeric prefixes from answers (` 1. `, ` 2. `, etc.)
4. Extract question prompt from `description` (split at `{x}`)
5. Replace `{v}` → `\n` in description text

### Pattern 3: Speaking Image

**Legacy:**
```json
{
  "exercise": {
    "title": "Speaking Practice",
    "description": "Part One. In this part... {v} You will have 30 seconds...",
    "label": "Speaking Part 2",
    "recordingTime": 30,
    "questions": [{
      "recordingUrl": "https://...mp3",
      "title": "What are you doing this weekend? {x}",
      "answers": ["x"],
      "correct": 0,
      "imageUrl": { "images": ["https://...jpg"] }
    }]
  }
}
```

**New:**
```typescript
{
  type: "exercise",
  id: "...",
  exercise: {
    id: "...",
    type: "speaking_image",
    label: "Speaking Part 2",
    description: "Part One. In this part...\nYou will have 30 seconds...",
    recordingTimeSec: 30,
    reviewMode: "hybrid",
    questions: [{
      id: "q1",
      prompt: "What are you doing this weekend?",  // Remove {x}
      audio: { src: "https://...mp3" },
      images: [{ src: "https://...jpg", alt: "Weekend activities" }],
    }]
  }
}
```

**Migration steps:**
1. `answers: ["x"]` → no `correctOptionId` (open response)
2. `imageUrl.images` array → `images: ImageAsset[]` with `alt` text
3. `recordingUrl` → `audio: AudioAsset`
4. `recordingTime` → `recordingTimeSec`
5. Remove `{x}` from prompt (no blank needed for speaking)
6. Replace `{v}` → `\n` in description
7. Set `reviewMode: "hybrid"` (speaking exercises need review)

### Pattern 4: Speaking Open (no images)

Same as Speaking Image but `type: "speaking_open"` and no `images` field.
Questions may have `recordingUrl: null` — omit the `audio` property entirely.

### Pattern 5: Writing Form

**Legacy:**
```json
{
  "point": true,
  "exercise": {
    "description": "You are joining a pet owners club. {v} Fill the form. (1-5 words)",
    "label": "Writing Part 1",
    "questions": [
      { "answers": ["x"], "title": "Name: {x}", "correct": 0 },
      { "answers": ["x"], "title": "Surname: {x}", "correct": 0 }
    ]
  }
}
```

**New:** `type: "writing_form"` with `wordLimit: "1-5 words"`, `reviewMode: "auto"`.

### Pattern 6: Writing Open

Questions with `subtitle` field → `type: "writing_open"` with question `subtitle` preserved.
Set `reviewMode: "human"` for longer writing tasks.

---

## Special Token Conversions

| Legacy Token | New Equivalent | Notes |
|--------------|----------------|-------|
| `{x}`        | `___`          | Standardized blank placeholder in prompts |
| `{x}`        | *(removed)*    | In speaking prompts, remove entirely |
| `{v}`        | `\n`           | Line break in description text |
| `answers: ["x"]` | *(no correctOptionId)* | Indicates open response |
| `correct: N` | `correctOptionId: options[N].id` | 0-based index → ID reference |
| `point: true` | `awardsProgress: true` (Section) + `xp: N` (interaction) | Progress tracking |
| `exam: true` | `examMode: true` (interaction) | Exam-style UI |
| `"A. text"`  | `"text"`       | Strip letter prefixes from answer options |
| `" 1. text"` | `"text"`       | Strip numeric prefixes from listening answers |

---

## ID Generation Strategy

All entities need stable, unique IDs. Recommended format:

```
{examProduct}-u{unitOrder}-{skill}-{blockType}-{sequenceNumber}
```

Examples:
- Unit: `aptis-u1`
- Section: `aptis-u1-grammar`
- Block: `aptis-u1-grammar-theory-1`
- Exercise: `aptis-u1-grammar-ex-1-mc`
- Question: `aptis-u1-grammar-ex-1-q1`
- Option: `aptis-u1-grammar-ex-1-q1-a`

---

## Migration Script Pseudocode

```typescript
function migrateCourse(legacy: LegacyJSON): Course {
  return {
    id: `${examType}-course-1`,
    examProduct: examType,
    title: "Aptis General — Complete Course",
    schemaVersion: "1.0.0",
    language: "en",
    totalUnits: legacy.units,
    units: legacy.views.map((view, i) => migrateUnit(view, i + 1)),
  };
}

function migrateUnit(view: LegacyView, order: number): Unit {
  return {
    id: `aptis-u${order}`,
    order,
    title: inferUnitTitle(view),  // From first theory heading
    sections: view.sections.map(s => migrateSection(s, order)),
  };
}

function migrateSection(section: LegacySection, unitOrder: number): Section {
  const skill = mapSkillType(section.as || section.type);
  return {
    id: `aptis-u${unitOrder}-${skill}`,
    skill,
    title: section.as || section.type,
    blocks: section.content.map((item, i) => migrateBlock(item, skill, unitOrder, i)),
    awardsProgress: section.content.some(c => c.point === true),
  };
}

function migrateBlock(item: LegacyContentItem, skill: string, unit: number, idx: number): Block {
  if (item.theory) return migrateTheoryBlock(item, skill, unit, idx);
  if (item.exercise) return migrateExerciseBlock(item, skill, unit, idx);
  throw new Error(`Unknown content item at index ${idx}`);
}

function migrateTheoryBlock(item: LegacyTheoryItem, ...): TheoryBlock {
  return {
    type: "theory",
    id: generateId(unit, skill, "theory", idx),
    heading: item.theory.heading || undefined,
    title: item.theory.title || undefined,
    body: item.theory.subheading ? parseHtmlToContentNodes(item.theory.subheading) : [],
    image: item.theory.imageUrl ? migrateImage(item.theory.imageUrl) : undefined,
  };
}

function migrateExerciseBlock(item: LegacyExerciseItem, ...): ExerciseBlock {
  const exerciseType = inferExerciseType(item, skill);
  return {
    type: "exercise",
    id: generateId(unit, skill, "ex", idx),
    exercise: migrateExercise(item.exercise, exerciseType, ...),
    interaction: {
      xp: item.point ? 10 : 5,
      retryable: true,
      shuffleOptions: false,
      scoringMode: inferScoringMode(exerciseType),
      examMode: item.exam === true,
    },
  };
}
```

---

## Validation After Migration

After migrating each course JSON, validate it against the Zod schema:

```typescript
import { CourseSchema } from "schemas/course/validation";

const result = CourseSchema.safeParse(migratedData);
if (!result.success) {
  console.error("Validation errors:", result.error.issues);
  // Each issue includes path, message, and expected type
}
```

---

## Incremental Migration Strategy

1. **Phase 1**: Create the migration script; generate new JSON files alongside legacy ones
2. **Phase 2**: Build new renderers that consume the new schema (TheoryView, ExerciseView, etc.)
3. **Phase 3**: Add a feature flag to switch between legacy and new renderers
4. **Phase 4**: Validate all 15 units render identically with both schemas
5. **Phase 5**: Remove legacy renderers and JSON files
