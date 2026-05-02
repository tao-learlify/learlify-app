---
description: "Connect a dashboard component's hardcoded course/unit data to real API. Use when replacing static units arrays with real courses + advance progress data from the Redux store and CDN."
agent: agent
argument-hint: "Component name or description of the hardcoded data to connect"
---

You are a Senior Frontend Architect working in the Learlify Frontend codebase (React 17, Redux Toolkit, JavaScript + JSDoc).

## Context

The codebase has two data sources for course progress:

**1. Redux store — courses + advance (already fetched)**
- `useCourses()` → `{ data: Course[], loading }` where `Course = { id, name, views: { url } }`
- `useAdvance()` → `{ data: [{ content: { "1": { last: bool }, "2": {...} } }] }`
- `advance.data[0].content` keys are 1-based section indices; `last: true` = current section
- `getAdvance({ content })` from `views/courses/utils/index.js` returns `{ unit: number (0-based) }`

**2. CDN JSON — fetched via `api.courses.fetchCourse(course.views.url)`**
- Returns the full course payload (sections, exercises, theory blocks)
- Already adapted by `adaptLegacyCourse(raw, unitIndex)` → `Unit` (schema v2)
- `Unit.sections[].skill` = `'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing'`
- `Unit.sections[].blocks[]` = exercise + theory blocks with `block.interaction.xp`

**3. Exams — from `useExams()` → `{ data: Exam[], loading }`**
- Exams map to "challenge" milestone nodes in the LearningPath

## LearningPath prop shape

```js
// Each unit node the component expects:
{ id, title, state: 'completed'|'current'|'locked', xp, type?: 'challenge'|'challenge-premium', examId? }
```

## Task

The user has a component with a hardcoded `units` array like:
```jsx
<LearningPath units={[ { id: 1, title: 'Basics', state: 'completed', xp: 20 }, ... ]} />
```

Replace it with real data by following these steps:

### Step 1 — Explore the component

Read the file containing the hardcoded data. Identify:
- What prop shape the component needs
- What data is already available via existing hooks in the file

### Step 2 — Create `useCourseLearningPath.js` in `src/hooks/`

Follow this pattern:
```js
import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import api from 'api'
import useCourses from 'hooks/useCourses'
import useAdvance from 'hooks/useAdvance'
import useModels from 'hooks/useModels'
import { fetchCoursesThunk } from 'store/@thunks/courses'
import { adaptLegacyCourse } from 'views/courses/unit/api/adaptLegacyCourse'
import { getAdvance } from 'views/courses/utils/index'

function useCourseLearningPath() {
  // 1. Redux state
  // 2. Dispatch fetchCoursesThunk if courses.data is empty
  // 3. Fetch CDN JSON from course.views.url when course is available
  // 4. Call adaptLegacyCourse(raw, 0) to get normalized Unit
  // 5. Derive currentSectionIndex from getAdvance(advance.data[0])
  // 6. Map Unit.sections → { id, title, state, xp }
  //    - index < current → 'completed'
  //    - index === current → 'current'
  //    - index > current → 'locked'
  // 7. Return { units, courseTitle, loading }
}
```

**Section XP**: sum `block.interaction.xp` across all exercise blocks in the section.

**Section title**: map skill to display string:
```js
const SKILL_TITLE = { grammar: 'Grammar', vocabulary: 'Vocabulary', listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing' }
```

### Step 3 — Inject exam challenge nodes

After building the sections array, interleave exam nodes from `useExams()` data:
- Use the exams `data[]` array — each exam has `{ id, title, ... }`
- Insert a challenge node after every N regular sections (ask the user for the grouping rule if unclear)
- Challenge node shape: `{ id: exam.id, title: exam.title, state: ..., xp: 200, type: 'challenge', examId: exam.id }`

### Step 4 — Update the view

Replace the hardcoded `units={[...]}` with:
```jsx
const { units, courseTitle, loading } = useCourseLearningPath()
// ...
<LearningPath units={units} courseTitle={courseTitle} ... />
```

Remove any hardcoded data that is now provided by the hook.

### Step 5 — Verify

- `useCourses` is NOT called twice in the same component (hook already calls it)
- `fetchCoursesThunk` is not dispatched if courses are already in Redux
- CDN fetch is aborted on unmount
- `loading` state propagates to the Template `withLoader` prop if present

### Step 6 — Stabilize useEffect dependencies (CRITICAL — prevents 429s)

Redux selectors return new array/object references on every render. Using them directly as `useEffect` dependencies causes infinite re-fetches.

**Always extract primitive values before the effect:**

```js
// ❌ WRONG — coursesData is a new array reference every render
useEffect(() => { ... }, [coursesData])

// ✅ CORRECT — cdnUrl is a stable string primitive
const cdnUrl = coursesData[0]?.views?.url || null
useEffect(() => { ... }, [cdnUrl])
```

```js
// ❌ WRONG — model is a new object reference every render
useEffect(() => { ... }, [model])

// ✅ CORRECT — model.name is a stable string primitive
useEffect(() => { ... }, [model?.name])
```

Apply this pattern for every array/object from Redux used in a `useEffect` dependency array.

### Step 7 — Guard the dispatch with useRef (CRITICAL — prevents retry loops)

The condition `coursesData.length === 0 && !coursesLoading` is NOT safe alone:
- If the thunk **rejects**, `loading` returns to `false` and `data` stays empty → guard re-passes → infinite retry.
- In React 17 StrictMode, effects fire **twice** on mount → two requests before the first `pending` state commits.

**Always use a `useRef` flag for one-shot dispatches:**

```js
import { useRef } from 'react'

const fetchDispatchedRef = useRef(false)

useEffect(() => {
  // Guard: skip if already dispatched, data already loaded, or still in-flight
  if (fetchDispatchedRef.current || coursesData.length > 0 || coursesLoading || !model?.name) return
  fetchDispatchedRef.current = true
  dispatch(fetchCoursesThunk({ model: model.name, demo: false }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [coursesData.length, coursesLoading, dispatch, model?.name])
```

The ref survives re-renders but is scoped to the hook instance, so the thunk is dispatched at most once per mount.

## Rules

- Do NOT modify `UnitView`, `BlockRenderer`, or exercise components
- Keep `adaptLegacyCourse` as the only HTML→ContentNode conversion point
- Follow the `api → thunk → controller → reducer → selector → hook → view` pattern
- Do NOT introduce RTK Query or sagas
- Do NOT hardcode course URLs or section titles
