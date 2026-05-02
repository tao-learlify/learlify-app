# Backend Requirements — Real-Time Progress Tracking

## Executive Summary

Frontend is ready for real-time progress tracking. We need **2 new API endpoints** to complete the feature.

**Status:** ✅ Frontend Complete | ⏳ Backend Pending

---

## Endpoint #1: Mid-Section Progress Update

**Purpose:** User completes an exercise → frontend reports progress mid-way through section.

### Request

```
PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress
Content-Type: application/json
Authorization: Bearer <token>

{
  "xp": 120,
  "progressPercent": 0.45,
  "exercisesCompleted": 9,
  "lastAccessedAt": "2024-01-15T14:32:05Z"
}
```

### Query Parameters
- `courseId` (path) — User's course ID
- `sectionIndex` (path) — Section number (1-based, 1 to 6 per unit)

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `xp` | integer | ✅ | XP earned in this update (not cumulative; use PATCH to add to existing if needed) |
| `progressPercent` | float | ✅ | Progress as 0.0-1.0 (e.g., 0.45 = 45%) |
| `exercisesCompleted` | integer | ✅ | Number of exercises completed (for tracking) |
| `lastAccessedAt` | ISO 8601 | ✅ | Timestamp of this access |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Progress updated successfully",
  "advance": {
    "id": "user-123-course-1",
    "currentSectionIndex": 1,
    "sections": {
      "1": {
        "xp": 120,
        "progressPercent": 0.45,
        "exercisesCompleted": 9,
        "completed": false,
        "lastAccessedAt": "2024-01-15T14:32:05Z"
      }
    },
    "updatedAt": "2024-01-15T14:32:05Z"
  }
}
```

### Error Responses

```json
// 400 Bad Request
{
  "success": false,
  "error": "Invalid sectionIndex. Must be 1-6."
}

// 401 Unauthorized
{
  "success": false,
  "error": "Unauthorized"
}

// 404 Not Found
{
  "success": false,
  "error": "Course not found"
}
```

### Implementation Notes
- ✅ Don't require user to complete section
- ✅ Just update the `sections[sectionIndex]` object
- ✅ Return the entire updated `advance` object
- ✅ Use UPSERT (create section entry if it doesn't exist)

---

## Endpoint #2: Complete Section (Auto-Increment)

**Purpose:** User completes final exam for section → mark complete + auto-advance to next section.

### Request

```
POST /api/v1/courses/:courseId/sections/:sectionIndex/complete
Content-Type: application/json
Authorization: Bearer <token>

{
  "xp": 500,
  "examScore": 92,
  "completedAt": "2024-01-15T15:10:00Z"
}
```

### Query Parameters
- `courseId` (path) — User's course ID
- `sectionIndex` (path) — Section number (1-based)

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `xp` | integer | ✅ | Final XP for this section |
| `examScore` | integer | ✅ | Exam score 0-100 |
| `completedAt` | ISO 8601 | ✅ | Timestamp of completion |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Section completed. Advancing to next section.",
  "advance": {
    "id": "user-123-course-1",
    "currentSectionIndex": 2,
    "sections": {
      "1": {
        "xp": 500,
        "completed": true,
        "completedAt": "2024-01-15T15:10:00Z",
        "examScore": 92
      },
      "2": {
        "xp": 0,
        "completed": false,
        "lastAccessedAt": null
      }
    },
    "updatedAt": "2024-01-15T15:10:00Z"
  }
}
```

### Error Responses

```json
// 400 Bad Request — Already completed
{
  "success": false,
  "error": "Section already completed"
}

// 400 Bad Request — Invalid score
{
  "success": false,
  "error": "Exam score must be between 0 and 100"
}

// 401 Unauthorized
{
  "success": false,
  "error": "Unauthorized"
}
```

### Implementation Notes
- ✅ Set `completed: true` on current section
- ✅ **Auto-increment** `currentSectionIndex` to next section (up to 6)
- ✅ Create new section entry with `{ xp: 0, completed: false }`
- ✅ Return entire updated advance object
- ✅ Don't allow re-completing a section (return 400 error)
- ✅ If section 6 completed, set `currentSectionIndex: 7` (or handle as "course completed")

---

## Data Model Reference

### Advance Object Structure

```javascript
{
  id: "user-123-course-1",
  userId: "user-123",
  courseId: "course-1",
  currentSectionIndex: 2,        // 1-based, 1-15 total
  sections: {
    "1": {
      xp: 500,                   // Cumulative or reset per update? → Spec: reset per update
      progressPercent: 1.0,      // 0-1 (optional field)
      exercisesCompleted: 20,    // Track for analytics
      completed: true,
      completedAt: "ISO8601",
      examScore: 92,
      lastAccessedAt: "ISO8601"
    },
    "2": {
      xp: 250,
      progressPercent: 0.45,
      exercisesCompleted: 9,
      completed: false,
      lastAccessedAt: "ISO8601"
    }
    // ... sections 3-6 (only if accessed)
  },
  createdAt: "ISO8601",
  updatedAt: "ISO8601"
}
```

---

## Expected Behavior Flow

### Scenario 1: User Doing Exercises

```
1. User opens section 1
   → Frontend calls GET /api/v1/courses/1/sections/1 (already works)
   → Displays exercises

2. User completes 5 exercises (total 100 XP)
   → Frontend: updateProgress(100, 5)
   → Backend: PUT /api/v1/courses/1/sections/1/progress
   → Response: advance.sections[1] = { xp: 100, progressPercent: 0.25, ... }
   → Frontend: Progress bar animates to 25%

3. User completes 10 more exercises (100 XP more)
   → Frontend: updateProgress(100, 10)
   → Backend: PUT (same endpoint)
   → Response: advance.sections[1] = { xp: 100, progressPercent: 0.5, ... }
   → Frontend: Progress bar animates to 50%

4. User attempts final exam
   → 20 questions, user scores 92/100
   → Frontend: completeSection(500, 92)
   → Backend: POST /api/v1/courses/1/sections/1/complete
   → Response: currentSectionIndex = 2, section 1 marked complete
   → Frontend: 
     - Section 1 shows ✅ badge
     - LearningPath animates to next node
     - Section 2 becomes "current"
     - User can now take section 2
```

### Scenario 2: User Navigates Away & Back

```
1. User on section 1 (45% progress)
   → Frontend: useProgressPolling every 5 seconds
   → Backend: GET /api/v1/courses/1 (existing endpoint)
   → Frontend sees currentSectionIndex=1, displays progress

2. User navigates away
   → Polling continues in background

3. User comes back 10 minutes later
   → Polling fetches latest advance
   → Graph shows exact current state
   → User can resume from section 1, 45% where they left off
```

---

## Testing Checklist for Backend

- [ ] Endpoint #1: Can update progress without completing section
- [ ] Endpoint #2: Auto-increments currentSectionIndex correctly
- [ ] Endpoint #2: Doesn't allow re-completion of same section
- [ ] Both endpoints return full advance object
- [ ] Both endpoints require authentication
- [ ] Both endpoints validate input (score 0-100, sectionIndex 1-6)
- [ ] Concurrent updates don't cause race conditions
- [ ] Invalid courseId returns 404
- [ ] Invalid sectionIndex returns 400

---

## Integration Checklist for Frontend

After backend implements these endpoints:

- [ ] Test updateProgress in exercise flow
- [ ] Test completeSection in final exam flow
- [ ] Verify progress bar animates
- [ ] Verify progress ring animates
- [ ] Test polling keeps graph in sync
- [ ] Test error handling (network, 401, 400)
- [ ] Test on mobile devices
- [ ] Performance: measure round-trip latency

---

## Timeline

**Estimated backend effort:** 2-3 hours  
- Endpoint #1: 1 hour (simple update)
- Endpoint #2: 1 hour (increment logic + validation)
- Testing: 1 hour

**Blockers:** None — frontend is ready now

---

## Questions?

Contact frontend team with questions on:
- Data structure format
- Field naming conventions
- Error response format
- Edge cases (e.g., user completes all 6 sections — what does currentSectionIndex become?)

Frontend team is ready to test and integrate as soon as endpoints are available. 🚀
