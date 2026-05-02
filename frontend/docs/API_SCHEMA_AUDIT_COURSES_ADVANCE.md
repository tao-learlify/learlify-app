# API Schema Audit: `/api/courses` → LearningPath

**Document Purpose:** Frontend-Backend contract specification to fix the courses/advance API response schema.

**Audience:** Backend team, Frontend team leads

**Status:** 🔴 **CRITICAL** — Multiple blocking issues require backend changes before frontend integration can proceed.

---

## Executive Summary

The current `/api/courses` response has **7 structural and semantic issues** that force the frontend into workarounds and prevent reliable progress tracking. This audit specifies the exact changes needed to align the API response with frontend requirements.

| Issue | Severity | Frontend Impact | Fix Complexity |
|-------|----------|-----------------|-----------------|
| All sections marked `"last": true` | 🔴 CRITICAL | Cannot detect current section | Low (1 field rename) |
| Field `"general"` is ambiguous | 🔴 CRITICAL | Cannot determine data type/usage | Low (rename to `xp`) |
| Missing section indices (7, 13) | 🟠 HIGH | Index mapping breaks | Medium (clarify intent) |
| `completed: false` on all sections | 🟠 HIGH | No progress indication | Low (logic fix) |
| Redundant `courses[].advances[]` | 🟡 MEDIUM | Payload bloat, sync risk | Low (remove nesting) |
| No section XP in advance | 🟡 MEDIUM | Forced to fetch CDN for every metric | Low (add field) |
| Confusing timestamps | 🟡 MEDIUM | Unclear what `createdAt` represents | Low (clarify/add fields) |

---

## Current Response (Problematic)

```json
{
  "message": "Courses Obtained Successfully",
  "response": {
    "advance": [
      {
        "id": 61,
        "content": {
          "1": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "2": {
            "last": true,
            "general": 30,
            "completed": false
          },
          "3": {
            "last": true,
            "general": 31,
            "completed": false
          },
          "4": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "5": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "6": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "8": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "9": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "10": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "11": {
            "last": true,
            "general": 2,
            "completed": false
          },
          "12": {
            "last": true,
            "general": 0,
            "completed": false
          },
          "14": {
            "last": true,
            "general": 6,
            "completed": false
          },
          "15": {
            "last": true,
            "general": 3,
            "completed": false
          }
        },
        "createdAt": "2020-04-26T14:37:35.000Z"
      }
    ],
    "courses": [
      {
        "id": 1,
        "createdAt": "2020-02-17T15:40:44.000Z",
        "advances": [
          {
            "id": 61,
            "content": { /* identical to above */ }
          }
        ],
        "model": {
          "id": 1,
          "name": "Aptis"
        },
        "views": {
          "url": "https://dkmwdxc6g4lk7.cloudfront.net/courses/aptis.json",
          "createdAt": "2020-02-17T15:40:44.000Z"
        }
      }
    ]
  },
  "statusCode": 200
}
```

### Problems Annotated

```json
"content": {
  "1": {
    "last": true,              // ❌ PROBLEM #1: ALL sections have "last": true
    "general": 0,              // ❌ PROBLEM #2: "general" is semantically ambiguous (XP? Score? Status?)
    "completed": false         // ❌ PROBLEM #4: No sections marked completed despite user having progress
  },
  "2": { "last": true, "general": 30, "completed": false },   // ← Contradicts "only one section is current"
  "3": { "last": true, "general": 31, "completed": false },
  "4": { "last": true, "general": 0, "completed": false },
  "5": { "last": true, "general": 0, "completed": false },
  "6": { "last": true, "general": 0, "completed": false },
  "7": null,                   // ❌ PROBLEM #3: Missing keys (7, 13 not in content)
  "8": { "last": true, "general": 0, "completed": false },
  // ...
  "13": null,
  "14": { "last": true, "general": 6, "completed": false }
}

"courses": [{
  "advances": [ /* DUPLICATE of advance[] above */ ]    // ❌ PROBLEM #5: Redundant nesting
}]
```

---

## Desired Response (Fixed)

```json
{
  "message": "Courses Obtained Successfully",
  "response": {
    "advance": [
      {
        "id": 61,
        "currentSectionIndex": 2,
        "sections": {
          "1": {
            "xp": 0,
            "completed": true,
            "completedAt": "2020-04-26T10:15:00.000Z"
          },
          "2": {
            "xp": 30,
            "completed": false,
            "lastAccessedAt": "2020-04-26T14:37:35.000Z"
          },
          "3": {
            "xp": 31,
            "completed": false
          },
          "4": {
            "xp": 0,
            "completed": false
          },
          "5": {
            "xp": 0,
            "completed": false
          },
          "6": {
            "xp": 0,
            "completed": false
          }
        },
        "createdAt": "2020-04-26T14:37:35.000Z",
        "updatedAt": "2020-04-26T14:37:35.000Z"
      }
    ],
    "courses": [
      {
        "id": 1,
        "createdAt": "2020-02-17T15:40:44.000Z",
        "totalSections": 6,
        "model": {
          "id": 1,
          "name": "Aptis"
        },
        "views": {
          "url": "https://dkmwdxc6g4lk7.cloudfront.net/courses/aptis.json",
          "createdAt": "2020-02-17T15:40:44.000Z"
        }
      }
    ]
  },
  "statusCode": 200
}
```

### Changes Annotated

```diff
- ❌ "content": { "1": { "last": true, "general": 0, ... } }
+ ✅ "currentSectionIndex": 2,
+ ✅ "sections": {
+   "1": { "xp": 0, "completed": true, "completedAt": "..." },
+   "2": { "xp": 30, "completed": false, "lastAccessedAt": "..." },
+   ...
+ }

- ❌ "courses[].advances": [ /* duplicate */ ]
+ ✅ "courses[]": removed advances (use advance[] at root level)

+ ✅ "courses[].totalSections": 6
```

---

## Rationale: Why Each Change Matters

### Change #1: Single `currentSectionIndex` (instead of `"last": true` on each)

**Problem:**
```js
// Frontend currently has to search for "current":
const [key, value] = Object.entries(content).find(([k, v]) => v.last)
const currentIdx = parseInt(key) - 1
```

**With fix:**
```js
// Direct assignment, unambiguous:
const currentIdx = advance.currentSectionIndex - 1
```

**Impact:**
- ✅ O(1) instead of O(n) lookup
- ✅ Semantically clear: exactly one section is "current"
- ✅ Prevents bugs where multiple sections could have `last: true`

---

### Change #2: Rename `"general"` → `"xp"`

**Problem:**
- What is `"general": 30`?
  - 30 experience points?
  - 30% completion?
  - 30 points earned on exercises?
  - A rank/level?
- Frontend has no type safety; must guess

**With fix:**
```json
"xp": 30  // Clear: 30 experience points
```

**Impact:**
- ✅ Self-documenting field name
- ✅ Frontend can display: `"Section 2: 30 XP earned"`
- ✅ No ambiguity across API consumers

---

### Change #3: Fix `completed` logic

**Problem:**
```json
"2": { "last": true, "general": 30, "completed": false }
```
- User has 30 XP earned but `completed: false`
- What does "not completed" mean?
  - User hasn't finished all exercises?
  - User hasn't marked it as complete manually?
  - User hasn't watched all theory?

**With fix:**
```json
"1": { "xp": 0, "completed": true, "completedAt": "2020-04-26T10:15:00.000Z" },
"2": { "xp": 30, "completed": false, "lastAccessedAt": "2020-04-26T14:37:35.000Z" }
```

**Impact:**
- ✅ Frontend displays clear states:
  - ✅ "Section 1: Completed on Apr 26"
  - 📍 "Section 2: In Progress (30 XP) — Last accessed Apr 26"
  - 🔒 "Section 3–6: Locked"

---

### Change #4: Remove key gaps OR clarify soft-deletes

**Problem:**
```json
{
  "1": {...}, "2": {...}, "3": {...}, "4": {...}, "5": {...}, "6": {...},
  // Missing: 7
  "8": {...}, "9": {...}, "10": {...}, "11": {...}, "12": {...},
  // Missing: 13
  "14": {...}, "15": {...}
}
```

- Frontend can't reliably iterate `1..totalSections`
- Can't map CDN section indices to advance progress
- Is section 7 intentionally deleted, or a data gap?

**With fix — Option A (Omit soft-deleted sections):**
```json
"sections": {
  "1": {...}, "2": {...}, "3": {...}, "4": {...}, "5": {...}, "6": {...}
}
// totalSections: 6
// Soft-deleted sections (7, 8–15) simply don't appear
```

**With fix — Option B (Mark explicitly, if needed for analytics):**
```json
"sections": {
  "1": {...}, "2": {...}, ..., "6": {...},
  "7": { "deleted": true, "deletedAt": "2023-01-01T00:00:00.000Z" }
}
```

**Impact:**
- ✅ Frontend can safely map: `CDN.sections[i] → advance.sections[i+1]`
- ✅ No ambiguity about "is section 7 real or corrupted?"

---

### Change #5: Remove redundant `courses[].advances[]` nesting

**Problem:**
```json
{
  "response": {
    "advance": [
      { "id": 61, "content": {...} }         // ← Source of truth
    ],
    "courses": [{
      "advances": [
        { "id": 61, "content": {...} }       // ← DUPLICATE
      ]
    }]
  }
}
```

**Payload cost:**
- Advance object repeated = ~500 bytes × 2 = unnecessary 500 bytes per request
- Risk: if backend updates one but not the other, frontend gets inconsistent data

**With fix:**
```json
{
  "response": {
    "advance": [ { "id": 61, ... } ],        // ← Single source of truth
    "courses": [{ /* no advances here */ }]  // ← Clean
  }
}
```

**Impact:**
- ✅ 50% smaller payload
- ✅ Single source of truth, no sync bugs

---

### Change #6: Add `totalSections` metadata

**Problem:**
- Frontend doesn't know how many sections exist in the course
- Must fetch CDN JSON just to count sections
- Can't validate "is section N out of bounds?"

**With fix:**
```json
"courses": [{
  "id": 1,
  "totalSections": 6,
  "model": { "id": 1, "name": "Aptis" },
  "views": { "url": "..." }
}]
```

**Frontend usage:**
```js
if (sectionIndex > courses[0].totalSections) {
  throw new Error('Section does not exist')
}
```

**Impact:**
- ✅ Frontend can validate without fetching CDN
- ✅ Enables optimized routing & error boundaries
- ✅ Fast upfront validation

---

### Change #7: Clarify timestamps

**Problem:**
```json
"advance": { "createdAt": "2020-04-26T14:37:35.000Z" },
"courses": { "createdAt": "2020-02-17T15:40:44.000Z" }
```

- Which `createdAt`?
  - When the course was created (2020-02-17)?
  - When the user started the course (2020-04-26)?
  - When the user last accessed it?

**With fix:**
```json
"advance": {
  "createdAt": "2020-04-26T14:37:35.000Z",   // ← When user enrolled
  "updatedAt": "2020-04-26T14:37:35.000Z",   // ← When last changed
  "sections": {
    "1": { "completedAt": "2020-04-26T10:15:00.000Z" },
    "2": { "lastAccessedAt": "2020-04-26T14:37:35.000Z" }
  }
}
```

**Impact:**
- ✅ Frontend can display "Completed on Apr 26, 10:15 AM"
- ✅ Analytics can track engagement timeline

---

## Clarifying Questions for Backend Team

### Question 1: Total Sections & Soft Deletes

> How many total sections exist in the Aptis course?

- Is it **6 sections** (and keys 7, 8–15 are soft-deleted)?
- Or is it **15 sections** (and the missing keys are data gaps)?
- If soft-deleted, should we include them with a `"deleted": true` flag for analytics?

**Answer needed to:** Finalize the `totalSections` field and section mapping logic.

---

### Question 2: Semantics of `completed` field

> What does `completed: true` mean for a section?

- User finished **all exercises** in that section?
- User finished **all theory blocks** in that section?
- User manually clicked "Mark Complete"?
- Something else?

**Answer needed to:** Determine if frontend should infer `completed` from `xp > 0` or trust the backend flag.

---

### Question 3: Is `general` field the total XP earned in a section?

> Does `"general": 30` represent:

- Total XP earned by the user in section 2?
- Score percentage (0–100)?
- Cumulative XP from all previous sections?
- Something else?

**Answer needed to:** Rename field correctly and display it in progress bars.

---

### Question 4: Why is `advance` nested inside `courses[].advances[]`?

> Is the relationship:

- **1:1** — Each course has exactly one active advance (current user's progress)?
- **1:N** — Each course has multiple advances (past user sessions, other users)?
- Should the frontend receive the **current user's advance only**, or all advances?

**Answer needed to:** Determine if we should remove the redundant nesting or keep it for historical data.

---

### Question 5: What do the timestamp fields represent?

> For the `advance` object:

- `createdAt` = When the user enrolled in the course?
- Or when the course was created?
- Should we also have `updatedAt` for when the advance last changed?
- Should section-level timestamps track `completedAt` and `lastAccessedAt`?

**Answer needed to:** Add appropriate timestamp fields for frontend UI.

---

## Implementation Tasks (Frontend — Ready After Backend Fixes)

Once backend team confirms and updates `/api/courses`:

- [ ] **Update `useCourseLearningPath.js`**
  - Read `advance.currentSectionIndex` instead of searching for `last: true`
  - Use `sections[i].xp` instead of `sections[i].general`
  - Use `sections[i].completed` directly without transformation

- [ ] **Update `buildLearningPathUnits()` helper**
  - Simplify section state logic: now just `currentSectionIndex` comparison
  - Display `completedAt` timestamps in LearningPath UI

- [ ] **Update `ConnectedUnitView.js`**
  - Validate `:unitOrder` against `courses[0].totalSections`
  - Show 404 if section doesn't exist (before CDN fetch)

- [ ] **Remove CDN fallback for XP**
  - No longer need to parse CDN for section XP
  - Advance already provides it

- [ ] **Add tests for new schema**
  - Test currentSectionIndex mapping
  - Test completed/current/locked state computation
  - Test totalSections validation

- [ ] **Update documentation**
  - Update [connect-dashboard-to-courses-api.prompt.md](../prompts/connect-dashboard-to-courses-api.prompt.md)
  - Document new `advance.sections` structure

---

## Recommendation

**This document should be shared with the backend team as a formal specification.** Not as a request or suggestion, but as the contract the frontend needs to function correctly.

### Timeline

- **Backend**: Implement changes — **1–2 days**
- **QA**: Test new schema — **1 day**
- **Frontend**: Integrate new schema — **2–4 hours**
- **E2E Testing**: Full flow — **1 day**

**Total: ~4–5 days** vs current workaround approach (~10 days of technical debt).

---

## Sign-Off

**Generated:** 2026-04-23

**For:** Frontend team (Learlify)

**Prepared by:** Senior Backend-Frontend Contract Specialist

**Status:** 🔴 **BLOCKED** — Waiting for backend schema update before frontend integration can proceed.
