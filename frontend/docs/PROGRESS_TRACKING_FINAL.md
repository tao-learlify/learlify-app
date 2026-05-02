# Progress Tracking System - Final Implementation

## Overview

Real-time progress tracking system integrated with the existing backend API (`PUT /api/v1/advance`).

## API Integration

### Backend Endpoint

**PUT /api/v1/advance**

Request body:
```json
{
  "courseId": 123,
  "unit": 2,
  "last": 50,
  "completed": false
}
```

Response:
```json
{
  "response": {
    "id": 456,
    "userId": 789,
    "courseId": 123,
    "content": {
      "1": { "completed": true, "general": 100, "last": false },
      "2": { "completed": false, "general": 50, "last": true }
    }
  }
}
```

### Data Structure

**Backend (advance.content):**
- Keys are unit numbers as strings ("1", "2", etc.)
- Each unit has:
  - `completed`: boolean - whether unit is done
  - `general`: number - progress marker (0-100)
  - `last`: boolean - indicates current active unit (only one has `true`)

**Frontend (adapted structure):**
- `currentSectionIndex`: number - extracted from unit where `last: true`
- `sections`: object - mapped from `content` with structure:
  ```javascript
  {
    1: { xp: 100, completed: true, progressPercent: 1 },
    2: { xp: 50, completed: false, progressPercent: 0 }
  }
  ```

## Architecture

### 1. Core Hooks

#### useProgressTracking.js (86 lines)
**Purpose:** Track and report user progress with optimistic UI updates

**Functions:**
- `updateProgress(xp, exercisesCompleted, progressPercent)`
  - Updates local state immediately (optimistic)
  - Calls `PUT /advance` with `completed: false`
  - Maps: `sectionIndex → unit`, `xp → last`
  
- `completeSection(finalXp, examScore)`
  - Calls `PUT /advance` with `completed: true`
  - Dispatches `fetchAdvanceThunk` to refresh Redux state
  - Resets local progress

**Returns:** `{ updateProgress, completeSection, localProgress, localXp, loading, error }`

#### useProgressPolling.js (60 lines)
**Purpose:** Poll backend every 5s to sync graph with other sessions

**Behavior:**
- Polls every 5000ms
- Dispatches `fetchAdvanceThunk(courseId)`
- Skips if courseId is missing or component unmounts
- Auto-cleanup on unmount

**Returns:** `{ isPolling, error }`

#### useLearningPathWithSchema.js (Modified)
**Purpose:** Combine Redux data with Schema v2 definitions

**Key Changes:**
- Added adapter to convert `content` → `{ currentSectionIndex, sections }`
- Finds current section by looking for `last: true`
- Maps `content[key]` to expected `sections[key]` format

**Data Mapping:**
```javascript
// API: content["2"] = { completed: false, general: 45, last: true }
// Becomes: sections[2] = { xp: 45, completed: false, progressPercent: 0 }
// And: currentSectionIndex = 2
```

### 2. Integration Layer

#### ConnectedUnitView.js
**Purpose:** Bridge between API/CDN and UnitView

**Changes:**
- Extracts `currentSectionIndex` from `content` (finds `last: true`)
- Initializes `useProgressTracking` and `useProgressPolling`
- Passes handlers to `UnitView` as props

#### UnitView.tsx
**Purpose:** Root component for unit learning experience

**Changes:**
- Receives `onProgressUpdate` and `onSectionComplete` props
- Calculates `progressPercent = completedSections / totalSections`
- Calls `onProgressUpdate` after each exercise
- Auto-detects section completion and calls `onSectionComplete`

### 3. UI Components

#### LearningPath/index.js
**Enhancement:** SVG progress ring around current unit

Shows when: `isCurrent && unit.progressPercent > 0`
- Track: 40% opacity
- Fill: animated with strokeDasharray
- Transition: 0.3s ease-out

#### CourseUnitsGrid.js
**Enhancement:** Linear progress bar in unit cards

- Width: `progressPercent * 100%`
- Height: 4px
- Gradient: primary color
- Transition: 0.3s ease-out

## Data Flow

### Progress Update Flow

```
User completes exercise
  ↓
UnitView calculates progressPercent
  ↓
Calls onProgressUpdate(xp, exercisesCompleted, progressPercent)
  ↓
useProgressTracking.updateProgress()
  ├─→ Updates local state (instant UI feedback)
  └─→ Calls api.courses.updateAdvance({ courseId, unit, last, completed: false })
      ↓
      Backend updates advance.content["2"].general = last
      ↓
      Frontend polls every 5s via useProgressPolling
      ↓
      Dispatches fetchAdvanceThunk → Redux updated
      ↓
      useLearningPathWithSchema adapts content → sections
      ↓
      LearningPath/CourseUnitsGrid re-render with new progressPercent
```

### Section Completion Flow

```
User completes all exercises in section
  ↓
UnitView detects completion (useEffect)
  ↓
Calls onSectionComplete(finalXp, examScore)
  ↓
useProgressTracking.completeSection()
  └─→ Calls api.courses.updateAdvance({ courseId, unit, last, completed: true })
      ↓
      Backend updates:
        - advance.content["2"].completed = true
        - advance.content["2"].last = false
        - advance.content["3"].last = true (auto-advance)
      ↓
      Dispatches fetchAdvanceThunk → Redux updated
      ↓
      useLearningPathWithSchema adapts:
        - currentSectionIndex becomes 3
        - sections[2].completed = true
        - sections[3] becomes current
      ↓
      LearningPath moves indicator to unit 3
```

## API Mapping Reference

| Frontend Concept | Backend Field | Notes |
|------------------|---------------|-------|
| `sectionIndex` | `unit` | 1-based unit number |
| `xp` | `last` | Progress marker (0-100) |
| `progressPercent` | (not stored) | Calculated in frontend |
| `completed` | `completed` | Boolean completion status |
| `currentSectionIndex` | (derived) | Found via `last: true` |
| `examScore` | (not stored) | Currently not persisted |

## Testing Checklist

- [ ] Navigate to a course unit
- [ ] Complete an exercise → verify progress ring appears
- [ ] Check Network tab → verify `PUT /advance` with `completed: false`
- [ ] Complete all exercises → verify section marked complete
- [ ] Check Network tab → verify `PUT /advance` with `completed: true`
- [ ] Verify graph auto-advances to next unit
- [ ] Wait 5s → verify polling request
- [ ] Open same course in another tab → verify progress syncs

## Known Limitations

1. **Exam Scores**: `examScore` parameter not persisted in current API
2. **Last Accessed**: `lastAccessedAt` not available from API
3. **Progress Granularity**: Backend stores single `general` number, not per-exercise
4. **Multiple Units**: Only one unit can have `last: true` at a time

## Future Enhancements

Consider implementing dedicated progress endpoints as specified in `BACKEND_PROGRESS_ENDPOINTS.md`:
- `PUT /courses/:id/sections/:index/progress` - Granular updates
- `POST /courses/:id/sections/:index/complete` - Completion with metadata
- `GET /courses/:id/sections/:index/progress` - Per-section queries

Benefits:
- Store exam scores
- Track per-exercise progress
- Add timestamps
- Better analytics
