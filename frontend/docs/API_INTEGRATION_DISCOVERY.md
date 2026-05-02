# Courses API ↔ New Unit Runtime — Technical Discovery Report

**Date:** 2026-06-20  
**Scope:** Full mapping between the current backend API, the CDN course format, and the new `UnitView` TypeScript runtime  
**Methodology:** Static analysis of `src/api/`, `src/store/`, `src/schemas/course/`, `src/views/courses/`, and `aptis-course.json`

---

## 1. Current API Discovery

### 1.1 Endpoints

| Function | Method | Endpoint | Auth | Notes |
|---|---|---|---|---|
| `fetchCourses(model, demo, signal)` | `GET` | `/api/v1/courses?demo=&model=` | ✅ Bearer | Returns courses list + advance in single response |
| `fetchAdvance(course, signal)` | `GET` | `/api/v1/advance?course=` | ✅ Bearer | Not used by main flow; `fetchCourses` already embeds advance |
| `fetchCourse(resource, signal)` | `GET` | `{external_url}` | ❌ No auth | CDN / S3 fetch. URL comes from `course.views.url` in step 1 |
| `updateAdvance(advance)` | `PUT` | `/api/v1/advance` | ✅ Bearer | Full advance object; used after progress changes |
| `createAdvance(advance)` | `POST` | `/api/v1/advance` | ✅ Bearer | Creates first advance record for a user+course pair |

**Base URL:** `config.API_URL` (resolved from `VITE_API_URL` env var at build time).

### 1.2 Two-Step Content Load

The content fetch is a two-step pattern:

```
Step 1  GET /api/v1/courses  →  { response: { courses: [...], advance: [...] } }
                                           │
                                    courses[0].views.url  (S3 / CDN URL)
                                           │
Step 2  GET {cdn_url}        →  Legacy JSON object (aptis-course.json shape)
```

The CDN response is the full legacy course object — **not** a schema v2 `Course`. It must be transformed before the new runtime can use it.

### 1.3 Response Shape — `/api/v1/courses`

Derived from `fetchCoursesControllerFulfilled`:

```js
state.courses.data = action.payload.response.courses
state.advance.data = action.payload.response.advance
```

```json
{
  "response": {
    "courses": [
      {
        "views": { "url": "https://cdn.learlify.com/courses/aptis-1.json" }
        // ... other metadata fields (id, title, model, etc. — exact shape unknown without a live call)
      }
    ],
    "advance": [
      {
        "content": {
          "1": { "last": true,  "general": { /* unit 1 progress */ } },
          "2": { "last": false, "general": { /* unit 2 progress */ } }
        }
      }
    ]
  }
}
```

### 1.4 Advance Object Shape

From `getAdvance` in `src/views/courses/utils/index.js`:

```js
function getAdvance({ content } = { content: {} }) {
  // Finds the unit where `last === true` — the last unit the user was in
  const data = Object.entries(content).find(([key, value]) => value.last)
  if (data) {
    return { unit: Number.parseInt(data[0]) - 1, props: data[1] }
  }
}
```

`advance.content` is a `Record<unitNumberString, UnitProgress>`:
- Key = 1-based unit number as string (`"1"`, `"2"`, etc.)
- Value = `{ last: boolean, general: { ... } }` — `last` marks the "current" unit; `general` carries intra-unit progress (exact shape not reverse-engineered)

**Critical gap:** The exact shape of `general` is unknown without a live API call. It likely encodes which sections/exercises are completed, but in legacy terms (section index, exercise index) — **not** block IDs.

### 1.5 CDN Course Format

From `aptis-course.json` (the format returned by `fetchCourse(resource)`):

```json
{
  "course": { "order": 1 },
  "units": 15,
  "sections": [ { "category": "Grammar & Vocabulary", "explicit": "Grammar" }, ... ],
  "views": [
    {
      "sections": [
        {
          "type": "Grammar & Vocabulary",
          "as": "Grammar",
          "content": [
            {
              "point": true,
              "theory": {
                "title": "",
                "heading": "Present Simple",
                "subheading": "<div class='row'><div class='col-4'>...(Bootstrap HTML)...</div></div>"
              }
            },
            {
              "exercise": {
                "label": "Reading Part 3",
                "description": "Read the text and complete each gap...",
                "questions": [
                  {
                    "title": "Marc and Paul (1) {x} at some brand-name trainers.",
                    "answers": [
                      { "title": "A. are looking" },
                      { "title": "B. look" },
                      { "title": "C. is looking" }
                    ],
                    "correct": 0
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 2. Current Frontend Runtime Expectations

### 2.1 Entry Point — `UnitView`

```tsx
<UnitView
  unit={unit}              // Unit (schema v2) — REQUIRED
  onComplete?={() => void}
  onNextUnit?={() => void}
  onBackToCourse?={() => void}
/>
```

The `unit` prop must be a fully-formed schema v2 `Unit` object. Currently this is fulfilled by the hardcoded `unit1` sample from `src/schemas/course/samples/unit-1.ts`.

### 2.2 Schema v2 `Unit` Interface (Abbreviated)

```ts
interface Unit {
  id: string
  order: number
  title: string
  subtitle?: string
  learningObjective?: string
  estimatedDurationMin?: number
  difficulty?: CEFRLevel           // "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  theme?: UnitTheme                // { name, accent, accentSoft, surface, icon, mood }
  sections: Section[]
}

interface Section {
  id: string
  skill: SkillType                 // "grammar" | "vocabulary" | "listening" | "speaking" | "reading" | "writing"
  title: string
  blocks: Block[]
  awardsProgress: boolean
  unlockRule?: UnlockRule
}

type Block = TheoryBlock | ExerciseBlock | MediaBlock | InstructionBlock | DividerBlock

interface TheoryBlock {
  type: "theory"
  id: string
  heading?: string
  title?: string
  body: ContentNode[]              // RichContent — NOT raw HTML
  image?: ImageAsset
}

interface ExerciseBlock {
  type: "exercise"
  id: string
  exercise: Exercise               // Typed discriminated union
  interaction: ExerciseInteraction // { xp, retries?, scoringMode?, timeLimitSec?, shuffle? }
  review?: ExerciseReview
}
```

### 2.3 Progress State (In-Memory Only)

`useUnitProgress` in `src/views/courses/unit/hooks/useUnitProgress.ts`:

```ts
interface ProgressState {
  completedBlockIds: string[]          // block.id strings
  xpRecord: Record<string, number>     // blockId → xp earned
  currentBlockId: string | null
}
```

- **No persistence**: state is lost on page refresh
- **No API calls**: pure `useReducer`, no side effects
- `progress = earnedXP / totalXP * 100` (derived, not stored)
- Unlock rules evaluated against `completedBlockIds` + computed `completedSectionIds`

### 2.4 `ExerciseInteraction` Contract

Each `ExerciseBlock` carries an `interaction` object that the runtime reads:

```ts
interface ExerciseInteraction {
  xp: number              // XP awarded on correct completion — required
  retries?: number        // max retry attempts (undefined = unlimited)
  scoringMode?: ScoringMode   // "binary" | "partial" | "rubric" | "unscored"
  timeLimitSec?: number
  shuffle?: boolean
}
```

This has **no equivalent** in the legacy CDN format. The adapter must synthesize these values.

---

## 3. Field Mapping Table

### 3.1 Hierarchy Mapping

| Legacy CDN Format | New Schema v2 | Status | Notes |
|---|---|---|---|
| `views[n]` (array index) | `Unit` | ⚠️ Partial | No stable ID in legacy; must generate one |
| `course.order` | `Unit.order` | ✅ Direct | |
| (implicit index n+1) | `Unit.id` | ❌ Gap | Must generate: `unit-${n+1}` |
| (no equivalent) | `Unit.title` | ❌ Gap | Must synthesize: `"Unit ${n+1}"` |
| (no equivalent) | `Unit.subtitle` | ❌ Gap | No legacy equivalent |
| (no equivalent) | `Unit.learningObjective` | ❌ Gap | No legacy equivalent |
| (no equivalent) | `Unit.difficulty` | ❌ Gap | No legacy equivalent |
| (no equivalent) | `Unit.theme` | ❌ Gap | Must assign default themes by unit index |
| `views[n].sections[n]` | `Section` | ⚠️ Partial | |
| `section.type` + `section.as` | `Section.skill` | ✅ Mappable | See 3.2 |
| (no equivalent) | `Section.id` | ❌ Gap | Must generate |
| (no equivalent) | `Section.title` | ❌ Gap | Must synthesize from skill |
| `content[n].point === true` | `Section.awardsProgress` | ✅ Indirect | `awardsProgress = content.some(c => c.point)` |

### 3.2 Section Skill Mapping

| Legacy `type` | Legacy `as` | New `skill` |
|---|---|---|
| `"Grammar & Vocabulary"` | `"Grammar"` | `"grammar"` |
| `"Grammar & Vocabulary"` | `"Vocabulary"` | `"vocabulary"` |
| `"Listening"` | `null` | `"listening"` |
| `"Speaking"` | `null` | `"speaking"` |
| `"Reading"` | `null` | `"reading"` |
| `"Writing"` | `null` | `"writing"` |

### 3.3 Block / Theory Mapping

| Legacy CDN Format | New Schema v2 | Status | Notes |
|---|---|---|---|
| `content[n].theory` | `TheoryBlock` | ⚠️ Partial | |
| `theory.heading` | `TheoryBlock.heading` | ✅ Direct | |
| `theory.title` | `TheoryBlock.title` | ✅ Direct | |
| `theory.subheading` (raw HTML string) | `TheoryBlock.body: ContentNode[]` | ❌ **Critical gap** | HTML → ContentNode conversion required; cannot be trivially mapped |
| (no equivalent) | `TheoryBlock.id` | ❌ Gap | Must generate stable ID |

### 3.4 Exercise Mapping

| Legacy CDN Format | New Schema v2 | Status | Notes |
|---|---|---|---|
| `content[n].exercise` | `ExerciseBlock.exercise` | ⚠️ Partial | |
| `exercise.label` | `Exercise.label` | ✅ Direct | |
| `exercise.description` | `Exercise.description` | ✅ Direct | |
| `exercise.questions[]` | `Exercise.questions[]` | ⚠️ Partial | Field names differ |
| `question.title` | `ExerciseQuestion.prompt` | ⚠️ Renamed | `title` → `prompt`; also must strip `{x}` placeholder tokens |
| `question.answers[]` | `ExerciseQuestion.options[]` | ⚠️ Renamed | `answers` → `options`; `answer.title` → `option.text` |
| `question.correct` (number index) | `ExerciseQuestion.correctOptionId` (string ID) | ❌ **Critical gap** | Index-based → ID-based. Must generate option IDs and map `correct` to `options[correct].id` |
| (no equivalent) | `ExerciseBlock.interaction.xp` | ❌ Gap | Must synthesize. Suggested: `10 × questions.length` |
| (no equivalent) | `ExerciseBlock.interaction.scoringMode` | ❌ Gap | Default to `"binary"` for selection, `"partial"` for gap |
| (no equivalent) | `ExerciseBlock.id` | ❌ Gap | Must generate stable ID |
| (no equivalent) | `Exercise.id` | ❌ Gap | Must generate stable ID |
| (no equivalent) | `ExerciseQuestion.id` | ❌ Gap | Must generate stable ID |
| (no equivalent) | `Exercise.type` | ❌ Gap | Must infer from exercise structure (see 3.5) |

### 3.5 Exercise Type Inference

The legacy format does not carry an exercise type discriminant. Type must be inferred from the content structure:

| Legacy Structure Signals | Inferred `Exercise.type` |
|---|---|
| `question.answers[]` with `question.correct` (index), no audio on exercise | `"gap_select"` |
| Exercise has top-level `audio` field | `"listening_select"` |
| `question.answers[]` length === 2 and values are "True"/"False" (or similar) | `"true_false"` |
| `question.answers[]` length > 2, standard A/B/C choices | `"multiple_choice"` |
| `question.recordingUrl` or speaking-specific fields | `"speaking_open"` or `"speaking_image"` |
| `question.writing` or textarea-type fields | `"writing_open"` or `"writing_form"` |

> **Risk:** The legacy format uses identical structure for `gap_select` and `multiple_choice`. Distinguishing them requires heuristics or section context (`skill === "grammar"` and multi-option → `gap_select`).

### 3.6 Progress / Advance Mapping

| Legacy Advance Shape | New `ProgressState` | Status | Notes |
|---|---|---|---|
| `advance.content["1"].last === true` | Which unit is "current" | ⚠️ Partial | Indicates which unit to load; no block-level equivalent |
| `advance.content["1"].general` | `ProgressState` | ❌ **Unknown** | Exact shape of `general` requires a live API call to reverse-engineer |
| (no equivalent) | `completedBlockIds: string[]` | ❌ Gap | Block IDs are a new concept; legacy tracks by section/exercise index |
| (no equivalent) | `xpRecord: Record<string, number>` | ❌ Gap | XP is not tracked in the legacy advance model |

---

## 4. Gaps and Risks

### 4.1 Critical Gaps (Blockers)

| ID | Gap | Impact | Mitigation |
|---|---|---|---|
| G-1 | HTML → ContentNode conversion for `theory.subheading` | `TheoryBlock.body` cannot be populated without parsing the HTML | Ship an `htmlToContentNodes(html)` adapter using a lightweight HTML parser (e.g. `node-html-parser`) or regex heuristics for known patterns |
| G-2 | `correct` (array index) → `correctOptionId` (stable string ID) | All selection/gap exercises will break scoring | Generate option IDs deterministically during adaptation: `q${qi}-opt-${oi}` |
| G-3 | Exercise type inference | Incorrect type → wrong renderer component → broken exercises | Define a priority-ordered inference function with explicit heuristics; log unknowns |
| G-4 | `ExerciseInteraction` has no source in CDN data | XP system has no data to work from | Synthesize: `{ xp: 10 * questions.length, scoringMode: "binary" }` |
| G-5 | `advance.content[n].general` shape unknown | Cannot restore in-progress units | Make a live API call or inspect network panel; provide a safe fallback (start from zero) |
| G-6 | Unit metadata (title, subtitle, theme, difficulty) missing from CDN | `UnitHeader` and `UnitFlow` UI will have empty/default rendering | Synthesize from course-level metadata or hardcode defaults per unit index |

### 4.2 Secondary Risks

| ID | Risk | Impact |
|---|---|---|
| R-1 | The CDN URL from `course.views.url` may return content with different structure per course/unit | Adapter assumptions for Unit 1 may not hold for Units 2–15 | Build adapter with defensive fallbacks and Zod validation on output |
| R-2 | `advance` API body shape sent to `PUT /api/v1/advance` is the full advance object | Over-writing advance on every block completion will cause race conditions | Debounce and only write on section/unit completion, not per-block |
| R-3 | The new `ProgressState` (block IDs + XP) is fundamentally different from the legacy `content` shape | Cannot round-trip without a migration step | On first load with new runtime, drop legacy progress and start fresh OR provide a one-time migration function |
| R-4 | HTML parser may produce incorrect `ContentNode` trees for malformed Bootstrap HTML | Theory blocks may render incorrectly | Validate output against `ContentNodeSchema`; fall back to raw `ParagraphNode` with stripped text |
| R-5 | The `correct` field uses a 0-based index. Off-by-one errors will invert correct answers | Silent scoring bugs | Add unit tests for adapter with known Q/A pairs from `aptis-course.json` |

---

## 5. Recommended Integration Architecture

### 5.1 Overview

```
┌─────────────────────────────────────────────────────────┐
│  Route:  /courses/:courseId/units/:unitOrder            │
│                                                         │
│  useConnectedUnit(courseId, unitOrder)                  │
│    ├─ 1. fetchCoursesThunk → get courses + advance      │
│    ├─ 2. fetchCourse(course.views.url) → CDN JSON       │
│    ├─ 3. adaptLegacyCourse(json, unitOrder) → Unit      │
│    ├─ 4. deserializeProgress(advance, unitOrder) →      │
│    │      Partial<ProgressState>                        │
│    └─ returns: { unit, initialProgress, status }        │
│                                                         │
│  <UnitView unit={unit} ... />                           │
│    └─ (UnitProgressContext seeded with initialProgress) │
│         └─ on block complete → serializeProgress()      │
│              └─ debounced PUT /api/v1/advance           │
└─────────────────────────────────────────────────────────┘
```

### 5.2 New Files to Create

```
src/
├── views/courses/unit/
│   └── api/
│       ├── adaptLegacyCourse.js       — Legacy JSON → Unit (schema v2)
│       ├── adaptLegacyCourse.test.js  — Unit tests for known aptis-course.json content
│       ├── serializeProgress.js       — ProgressState → advance API body
│       ├── deserializeProgress.js     — advance API body → initial ProgressState
│       └── htmlToContentNodes.js      — HTML string → ContentNode[]
│
├── hooks/
│   └── useConnectedUnit.js            — Orchestration hook: fetch + adapt + seed progress
│
├── store/@thunks/
│   └── courses.js                     — ADD: saveAdvanceThunk (debounced PUT)
│
└── views/courses/
    └── ConnectedUnitView.js           — Route-level component: useConnectedUnit → UnitView
```

### 5.3 Adapter Interface

```js
// src/views/courses/unit/api/adaptLegacyCourse.js

/**
 * Transform one unit from the legacy CDN format into a schema v2 Unit.
 *
 * @param {Object} legacyJson   — raw response from fetchCourse(resource)
 * @param {number} unitIndex    — 0-based index into legacyJson.views[]
 * @returns {import('schemas/course/hierarchy').Unit}
 */
export function adaptLegacyCourse(legacyJson, unitIndex) { ... }
```

```js
// src/views/courses/unit/api/htmlToContentNodes.js

/**
 * Best-effort conversion of a legacy Bootstrap HTML string
 * into an array of ContentNodes.
 *
 * @param {string} html
 * @returns {import('schemas/course/content').ContentNode[]}
 */
export function htmlToContentNodes(html) { ... }
```

```js
// src/views/courses/unit/api/serializeProgress.js

/**
 * Map new runtime ProgressState → legacy advance.content body
 * for PUT /api/v1/advance.
 *
 * @param {ProgressState} progressState
 * @param {number} unitOrder  — 1-based unit number
 * @param {Object} existingAdvance  — current advance object (to preserve other units)
 * @returns {Object}  — advance body ready for updateAdvance()
 */
export function serializeProgress(progressState, unitOrder, existingAdvance) { ... }
```

```js
// src/views/courses/unit/api/deserializeProgress.js

/**
 * Map legacy advance.content → initial ProgressState seed for useUnitProgress.
 * Returns empty state if advance is absent or unreadable (safe fallback).
 *
 * @param {Object|null} advance  — advance record from API
 * @param {number} unitOrder     — 1-based unit number
 * @returns {Partial<ProgressState>}
 */
export function deserializeProgress(advance, unitOrder) { ... }
```

### 5.4 Hook Interface

```js
// src/hooks/useConnectedUnit.js

/**
 * Orchestrates the full data pipeline for a connected unit:
 * 1. Fetch courses list + advance from /api/v1/courses
 * 2. Fetch CDN course JSON from course.views.url
 * 3. Adapt legacy JSON → Unit (schema v2)
 * 4. Deserialize advance → initial progress seed
 *
 * @param {string} courseId
 * @param {number} unitOrder   — 1-based unit number
 * @returns {{ unit, initialProgress, advance, status: 'loading' | 'ready' | 'error', error }}
 */
export function useConnectedUnit(courseId, unitOrder) { ... }
```

### 5.5 Route Component

```js
// src/views/courses/ConnectedUnitView.js

// Replaces the hardcoded Unit1View. Reads courseId + unitOrder from route params.
// Passes real data + progress persistence callbacks to UnitView.
```

---

## 6. Progress Strategy

### 6.1 Persistence Approach

The new runtime uses block IDs; the legacy API uses a numeric position map. Both must coexist during the transition.

**Recommended:** Store the new `ProgressState` shape *alongside* the legacy shape in `advance.content[unitOrder]`:

```json
{
  "content": {
    "1": {
      "last": true,
      "general": { /* legacy fields kept for backward compat */ },
      "v2": {
        "completedBlockIds": ["u1-gr-theory-1", "u1-gr-ex-1"],
        "xpRecord": { "u1-gr-ex-1": 30 }
      }
    }
  }
}
```

This allows:
- New runtime reads from `content[n].v2` if present
- Legacy runtime ignores the `v2` key (it doesn't know about it)
- A future migration can drop the `general` key when the legacy runtime is retired

### 6.2 Save Trigger

Do **not** save on every block completion — that causes N API calls per unit.

```
On block completion  →  update local ProgressState (in-memory, instant)
                      →  enqueue a debounced save (1500ms delay)

On section complete  →  flush immediately (stronger checkpoint)
On unit complete     →  flush immediately + call onComplete callback
On unmount           →  flush any pending save before leaving
```

### 6.3 First-Time vs. Returning User

```
1. Load advance from API
2. Check for advance.content[unitOrder].v2
   ├── Found → deserialize into ProgressState (returning user)
   └── Not found → check advance.content[unitOrder].general
       ├── Found → best-effort migration to v2 ProgressState
       └── Not found → start fresh (new user / first attempt)
```

---

## 7. Step-by-Step Implementation Plan

### Phase 0 — Unblock (1–2 sessions)
1. **Make a live API call** to `/api/v1/courses` and inspect the full response shape  
   → Confirms: course object fields, `advance.content[n].general` shape  
   → Required before writing any adapter

2. **Reverse-engineer `general` shape**  
   → Look at what `updateWhenCountChanges` and the legacy view read from it  
   → Document the exact field names

### Phase 1 — Pure Adapter Logic (1 session, no UI changes)
3. Create `src/views/courses/unit/api/htmlToContentNodes.js`  
   → Input: Bootstrap HTML string  
   → Output: `ContentNode[]`  
   → Handle: `<div>`, `<h2>`, `<p>`, `<strong>`, `<em>`, `<ol>/<ul>/<li>`, `<span style="color:...">` → `color` mark  
   → Fallback: strip all HTML, wrap in `ParagraphNode`

4. Create `src/views/courses/unit/api/adaptLegacyCourse.js`  
   → Implement `adaptLegacyCourse(legacyJson, unitIndex)`  
   → Generate stable IDs with a deterministic scheme: `u${unitOrder}-${sectionSkill}-${blockIndex}`  
   → Infer exercise types  
   → Map `correct` index → `correctOptionId`  
   → Synthesize `interaction` (xp, scoringMode)

5. Write `src/views/courses/unit/api/adaptLegacyCourse.test.js`  
   → Use `aptis-course.json` as test fixture  
   → Assert: correct block count, correct exercise types, correct option IDs, scoring correctness

### Phase 2 — Progress Serialization (1 session)
6. Create `src/views/courses/unit/api/deserializeProgress.js`  
   → Reads `advance.content[unitOrder].v2` (new) or returns `{}`

7. Create `src/views/courses/unit/api/serializeProgress.js`  
   → Maps `ProgressState` → advance body  
   → Merges with existing advance to avoid overwriting other units

8. Add `saveAdvanceThunk` to `src/store/@thunks/courses.js`  
   → Wraps `updateAdvance` + handles create-if-not-exists logic

### Phase 3 — Orchestration Hook (1 session)
9. Create `src/hooks/useConnectedUnit.js`  
   → Dispatches `fetchCoursesThunk` if courses not loaded  
   → Calls `fetchCourse(course.views.url)` for CDN content  
   → Runs `adaptLegacyCourse(json, unitOrder)`  
   → Runs `deserializeProgress(advance, unitOrder)`  
   → Returns `{ unit, initialProgress, advance, status, error }`

### Phase 4 — Route Integration (1 session)
10. Seed `useUnitProgress` with `initialProgress` from the hook  
    → `UnitView` or a new `ConnectedUnitView` wrapper provides the seeded context

11. Wire block completion → debounced `saveAdvanceThunk`  
    → Add `onBlockComplete` prop pathway from `UnitView` to the route  
    → Or inject via context in a wrapper component

12. Create `src/views/courses/ConnectedUnitView.js`  
    → Uses `useConnectedUnit(courseId, unitOrder)`  
    → Renders `<FallbackMode>` while loading  
    → Renders `<UnitView>` when ready

13. Add route to `src/router/index.js` and constant to `src/utils/path.js`  
    → `/courses/:courseId/units/:unitOrder`

### Phase 5 — Validation (1 session)
14. Validate adapter output with `CourseSchema.safeParse(adapted)`  
    → Log and alert on Zod errors in development  
    → Never throw in production — fall back to sample data with error toast

15. QA full flow for Unit 1: load → resume progress → complete → advance saved

---

## 8. Backend Recommendations (Optional / Future)

These changes would eliminate the adapter layer entirely, but require backend work:

| Recommendation | Benefit |
|---|---|
| Serve course content in schema v2 format directly from `/api/v1/courses/:id/units/:order` | Eliminates CDN fetch + full adapter |
| Include `ExerciseInteraction` fields (xp, scoringMode) in the API response | Enables server-controlled XP economy |
| Accept new `v2` progress format natively in `/api/v1/advance` | Enables server-side progress analytics with block-level granularity |
| Add `Unit.title`, `Unit.subtitle`, `Unit.difficulty`, `Unit.theme` to the API response | Eliminates synthetic fallback values |
| Return unit-level CDN resource URLs directly (`/api/v1/courses/:id/units` → `[{ order, resourceUrl }]`) | Allows lazy-loading units instead of downloading the full 15-unit JSON |

---

## Summary

| Item | Status |
|---|---|
| API endpoints mapped | ✅ |
| CDN format fully analyzed | ✅ |
| Schema v2 runtime requirements mapped | ✅ |
| Field-level mapping table complete | ✅ |
| Critical gaps identified | ✅ (6 critical gaps) |
| Adapter architecture designed | ✅ |
| Progress persistence strategy | ✅ |
| Implementation plan (step-by-step) | ✅ |
| Live API call to verify shapes | ❌ Required before Phase 1 |
| `advance.content.general` shape known | ❌ Required before Phase 2 |
