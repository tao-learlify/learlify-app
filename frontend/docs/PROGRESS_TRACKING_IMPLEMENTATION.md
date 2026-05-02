# Progress Tracking & Graph Animation — Technical Plan

## Current State Analysis

### Frontend Structure
```
Redux State:
├── state.courses.courses[] — Course definitions
├── state.courses.advance.data[] — Progress data
│   └── advance[0]
│       ├── id
│       ├── currentSectionIndex — 1-based (1-15) — **KEY FIELD**
│       ├── sections — Object keyed by section number
│       │   └── N: { xp, completed, lastAccessedAt }
│       └── createdAt/updatedAt

Hook Flow:
useLearningPathWithSchema()
├── Loads 15 schema units
├── Maps advance.sections to unit states (completed/current/locked)
├── Returns { units[], currentSection, completedSections }

Component Flow:
CoursesOverview / Dashboard
├── CourseUnitsGrid OR LearningPath
├── Renders units with state badges
└── OnUnitClick → navigate to /courses/:courseId/units/:unitOrder
```

### Problems Identified

**❌ Problem #1: No Real-Time Progress Updates**
- Progress only loads at app init via `fetchCoursesThunk`
- When user completes a section, Redux state doesn't update
- Graph stays static (no animation)
- User navigates back to dashboard → still shows old state

**❌ Problem #2: No Progress Tracking Backend Events**
- Backend doesn't send progress updates during learning
- No webhook/SSE/polling mechanism for live updates
- Manual API calls needed (but not implemented in UI)

**❌ Problem #3: Graph Animation Not Implemented**
- LearningPath component has static node positions
- No animation towards next unit
- No progress bar within a unit
- No "in progress" state for current unit

**❌ Problem #4: Missing Endpoints**
- No endpoint to update progress mid-section
- No endpoint to mark section complete
- No endpoint for progress delta updates (XP increments)

---

## Solution Architecture

### Backend Changes Required

**New/Updated Endpoints:**

```javascript
// 1. UPDATE section progress (mid-learning)
PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress
{
  "xp": 45,           // XP earned in this section
  "durationSeconds": 180,
  "completed": false, // Still working on it
  "lastAccessedAt": "2026-04-23T14:30:00Z"
}
→ Response:
{
  "advance": {
    "id": 61,
    "currentSectionIndex": 3,
    "sections": {
      "3": {
        "xp": 45,
        "completed": false,
        "progressPercent": 0.45  // ← NEW: Progress within section
      }
    }
  }
}

// 2. MARK section complete
POST /api/v1/courses/:courseId/sections/:sectionIndex/complete
{
  "examScore": 85,
  "totalXp": 100,
  "completedAt": "2026-04-23T14:35:00Z"
}
→ Response:
{
  "advance": {
    "id": 61,
    "currentSectionIndex": 4,  // ← AUTO-INCREMENTED
    "sections": {
      "3": {
        "xp": 100,
        "completed": true,
        "completedAt": "2026-04-23T14:35:00Z"
      },
      "4": {
        "xp": 0,
        "completed": false,
        "progressPercent": 0
      }
    }
  }
}

// 3. GET current progress (for polling/refresh)
GET /api/v1/courses/:courseId/progress
→ Response: Same advance structure
```

**Data Structure Enhancement:**

```javascript
// Add to each section:
{
  "xp": 45,
  "completed": false,
  "progressPercent": 0.45,    // ← NEW: 0-1, shows partial progress
  "lastAccessedAt": "2026-04-23T14:30:00Z",
  "completedAt": null,         // ← NEW: When finished
  "exercises": {
    "completed": 5,            // ← NEW: Exercises done
    "total": 10
  }
}
```

---

### Frontend Implementation

#### 1. New Hook: `useProgressTracking()`

```javascript
// src/hooks/useProgressTracking.js
export function useProgressTracking(courseId, sectionIndex) {
  const dispatch = useDispatch()
  const [localXp, setLocalXp] = useState(0)
  const [localProgress, setLocalProgress] = useState(0)
  
  // Update progress mid-section
  const updateProgress = useCallback(async (xp, exercisesCompleted) => {
    setLocalProgress(exercisesCompleted / totalExercises)
    setLocalXp(xp)
    
    // Dispatch to backend
    dispatch(updateSectionProgressThunk({
      courseId,
      sectionIndex,
      xp,
      progressPercent: exercisesCompleted / totalExercises
    }))
  }, [])
  
  // Mark section complete
  const completeSection = useCallback(async (finalXp, examScore) => {
    dispatch(completeSectionThunk({
      courseId,
      sectionIndex,
      totalXp: finalXp,
      examScore
    }))
    
    // Trigger refresh to get new currentSectionIndex
    setTimeout(() => {
      dispatch(fetchAdvanceThunk(courseId))
    }, 500)
  }, [])
  
  return { updateProgress, completeSection, localProgress, localXp }
}
```

#### 2. Update LearningPath for Animated Nodes

```javascript
// src/components/ui/LearningPath/index.js
// Existing code + enhancements:

function UnitNode({ unit, unitIndex, onUnitClick }) {
  const { state, progressPercent } = unit  // ← NEW
  
  return (
    <div
      className={clsx(
        styles.node,
        state === 'current' && styles.nodeCurrent,
        state === 'completed' && styles.nodeCompleted
      )}
      style={{
        '--progress-percent': `${progressPercent * 100}%`  // ← NEW
      }}
    >
      {/* Progress indicator for current node */}
      {state === 'current' && (
        <div className={styles.progressRing}>
          <svg>
            <circle
              cx={32}
              cy={32}
              r={28}
              style={{
                strokeDasharray: `${progressPercent * 175.8} 175.8`,
                transition: 'stroke-dasharray 0.3s ease-out'
              }}
            />
          </svg>
        </div>
      )}
      
      {/* Existing node UI */}
    </div>
  )
}

// Add to LearningPath.module.scss:
.progressRing {
  position: absolute;
  inset: -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  circle {
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 3;
    transition: stroke-dasharray 0.3s ease-out;
  }
}
```

#### 3. Update CourseUnitsGrid for Visual Feedback

```javascript
// src/views/courses/CourseUnitsGrid.js
// Add progress bar to each unit card:

<div className={styles.unitCard}>
  {/* ... existing content ... */}
  
  {/* NEW: Progress bar for current/in-progress units */}
  {(isCurrent || (completionPercent > 0 && !isCompleted)) && (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${completionPercent * 100}%` }}
      />
    </div>
  )}
</div>

// In CourseUnitsGrid.module.scss:
.progressBar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent-green));
  transition: width 0.3s ease-out;
}
```

#### 4. Real-Time Updates Strategy

**Option A: Polling (Simpler, No Backend Socket Need)**
```javascript
// src/hooks/useProgressPolling.js
export function useProgressPolling(courseId, interval = 5000) {
  const dispatch = useDispatch()
  const timerRef = useRef(null)
  
  useEffect(() => {
    // Poll every 5 seconds when on a learning page
    timerRef.current = setInterval(() => {
      dispatch(fetchAdvanceThunk(courseId))
    }, interval)
    
    return () => clearInterval(timerRef.current)
  }, [courseId, interval, dispatch])
}

// Usage in ConnectedUnitView:
useProgressPolling(courseId, 5000)
```

**Option B: WebSocket (Real-time, Requires Backend Socket.io)**
```javascript
// src/providers/websocket/index.js
// Already exists in the project — use for progress events:
socket.on('progress:update', (data) => {
  dispatch(updateAdvanceState(data))
})
```

---

## Implementation Priority

### Phase 1: Essential (MVP)
- [x] Backend: `PUT /api/v1/courses/:courseId/sections/:sectionIndex/complete`
- [x] Backend: Add `progressPercent` to section data
- [ ] Frontend: `useProgressTracking` hook
- [ ] Frontend: Update `CourseUnitsGrid` with progress bar
- [ ] Frontend: Polling mechanism (5s interval)

### Phase 2: Enhanced (Nice-to-Have)
- [ ] Backend: `PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress` (mid-section)
- [ ] Frontend: Progress ring animation on LearningPath nodes
- [ ] Frontend: WebSocket for real-time updates
- [ ] Frontend: XP delta notifications

### Phase 3: Polish
- [ ] Celebration animations when section completes
- [ ] Streak notifications
- [ ] Sound effects for milestones
- [ ] Local optimistic updates (instant feedback)

---

## Data Flow Diagram

```
User Completes Exercise
        ↓
ConnectedUnitView calls updateProgress()
        ↓
useProgressTracking.updateProgress()
        ↓
Updates local state (instant UI feedback)
        ↓
Dispatches updateSectionProgressThunk()
        ↓
PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress
        ↓
Backend updates DB
        ↓
Backend returns new advance state
        ↓
Redux advances.data updated
        ↓
useLearningPathWithSchema() recomputes units
        ↓
LearningPath re-renders with new progress
        ↓
Animation plays (progress ring fills, next node lights up)
```

---

## Questions for Backend Team

1. **Sections complete endpoint ready?**
   - What's the response when section completes?
   - Does it auto-increment `currentSectionIndex`?
   - What XP logic is applied?

2. **Progress tracking mid-section?**
   - Can we send partial progress updates?
   - Does `progressPercent` need backend tracking?
   - Or is it only calculated on frontend?

3. **Data retention?**
   - Keep all historical section data or just current?
   - How long do we track exercise-level progress?

4. **Real-time updates?**
   - Is WebSocket infrastructure available?
   - Or should we use polling (5s interval)?
   - Any rate limiting?

---

## Testing Checklist

- [ ] Complete section → next unit becomes "current"
- [ ] Progress bar animates smoothly (0% → 100%)
- [ ] Refresh page → progress persists
- [ ] Multiple tabs → progress syncs
- [ ] Offline → optimistic updates, sync on reconnect
- [ ] Mobile → animations performant
- [ ] Dark mode → progress colors visible

---

## Files to Create/Update

**New Files:**
- `src/hooks/useProgressTracking.js`
- `src/hooks/useProgressPolling.js`
- `src/store/@thunks/progress.js` (if separate from courses)
- `src/store/@controllers/progress.js`

**Modified Files:**
- `src/components/ui/LearningPath/index.js` — Add progress ring
- `src/components/ui/LearningPath/LearningPath.module.scss`
- `src/views/courses/CourseUnitsGrid.js` — Add progress bar
- `src/views/courses/CourseUnitsGrid.module.scss`
- `src/views/courses/ConnectedUnitView.js` — Use polling
- `src/store/@thunks/courses.js` — Add progress endpoint calls
- `src/api/courses.js` — New endpoints

**Backend Files (not in this repo):**
- `PUT /api/v1/courses/:courseId/sections/:sectionIndex/complete`
- Schema changes to add `progressPercent`, `exercises`
