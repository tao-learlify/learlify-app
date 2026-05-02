# Real-Time Progress Tracking — Integration Guide

## Quick Start

### For Exercise/Learning Components

When a user completes an exercise, call `updateProgress`:

```javascript
import { useProgressTracking } from 'hooks/useProgressTracking'

export function ExerciseComponent({ courseId, sectionIndex }) {
  const { updateProgress, completeSection, loading, error } = useProgressTracking(
    courseId,
    sectionIndex
  )

  const handleExerciseSubmit = async (exercise, userAnswers) => {
    // Calculate XP for this exercise
    const xp = calculateXP(exercise, userAnswers)
    
    // Update progress with current exercise count
    const totalExercises = SECTION_EXERCISES_COUNT  // e.g., 20
    const completedCount = userCompletedExercises.length + 1
    
    await updateProgress(xp, completedCount)
    
    // Visual feedback happens immediately (optimistic update)
    showNotification(`+${xp} XP`)
  }

  return (
    <div>
      {error && <Alert type="error">{error}</Alert>}
      <ExerciseView onSubmit={handleExerciseSubmit} />
    </div>
  )
}
```

### For Final Section Exam

When user submits the final section exam, call `completeSection`:

```javascript
export function FinalExamComponent({ courseId, sectionIndex, totalExercises }) {
  const { completeSection, loading, error } = useProgressTracking(
    courseId,
    sectionIndex
  )

  const handleExamSubmit = async (examAnswers) => {
    // Calculate final XP and score
    const { xp: finalXp, score: examScore } = gradeExam(examAnswers)
    
    // Mark section complete (backend auto-increments to next section)
    await completeSection(finalXp, examScore)
    
    // After backend confirms:
    // 1. Current unit shows completed badge ✅
    // 2. Next unit becomes "current"
    // 3. LearningPath graph animates to new position
    // 4. Celebration animation plays
    
    showCelebration('Section Completed! 🎉')
    navigateToNextUnit()
  }

  return (
    <div>
      {loading && <Spinner />}
      {error && <Alert type="error">{error}</Alert>}
      <ExamView onSubmit={handleExamSubmit} />
    </div>
  )
}
```

## Polling for Real-Time Updates

Add this at the view level to keep the graph in sync:

```javascript
// In ConnectedUnitView or Dashboard
import { useProgressPolling } from 'hooks/useProgressPolling'

export function ConnectedUnitView() {
  const courseId = useParams().courseId
  
  // Poll every 5 seconds for progress updates
  const { isPolling, error } = useProgressPolling(courseId, 5000)
  
  return (
    <div>
      {error && <Alert type="warning">Unable to sync progress</Alert>}
      {isPolling && <StatusIndicator type="syncing" />}
      
      {/* Course content here — LearningPath will auto-update */}
      <LearningPath courseId={courseId} />
    </div>
  )
}
```

## Data Structure Updates

When `updateProgress` or `completeSection` succeeds, Redux updates with new advance data:

```javascript
// Old structure (only at init):
state.courses.advance = {
  data: [
    {
      id: "...",
      currentSectionIndex: 1,
      sections: {
        1: { xp: 0, completed: false, lastAccessedAt: null }
      }
    }
  ]
}

// New structure (with tracking):
state.courses.advance = {
  data: [
    {
      id: "...",
      currentSectionIndex: 2,  // ← User advanced
      sections: {
        1: {
          xp: 520,              // ← Accumulated XP
          completed: true,      // ← Section done
          completedAt: "2024-01-15T15:10:00Z",
          examScore: 92
        },
        2: {
          xp: 0,
          completed: false,
          lastAccessedAt: "2024-01-15T15:15:00Z",
          progressPercent: 0    // ← New field (optional)
        }
      }
    }
  ]
}
```

## Visual Indicators

### Progress Bar (CourseUnitsGrid)
Shows in all unit cards except completed units:
- Current unit: always visible, width = progressPercent × 100%
- In-progress unit: visible when progressPercent > 0
- Completed unit: hidden
- Animation: 0.3s ease-out

```
[Unit Card]
┌─────────────────────────┐
│ Unit 1: Grammar         │
│ Learn past tense...     │
│ Level: B1  Duration: 45 │
│                      12% │ ← Progress bar fills up
└─────────────────────────┘
```

### Progress Ring (LearningPath)
SVG circle around current unit node:
- Appears only on current unit when progressPercent > 0
- Circumference = 175.8px (assuming r=28)
- Animation: `strokeDasharray` transition 0.3s ease-out
- Shadow: blue drop-shadow

```
Current state (at 45% completion):
  ┌─── strokeDasharray = 0.45 × 175.8 ≈ 79.1px
  ↓
     ◉  ← Current unit (blue) with animated ring
   ╱ ╲
  ●   ●  ← Upcoming units (gray)
```

## Error Handling

Both hooks return `error` and `loading` states:

```javascript
const { updateProgress, loading, error } = useProgressTracking(courseId, sectionIndex)

if (error === 'Network Error') {
  // Show offline indicator
  // Keep UI optimistic until reconnect
}

if (error === 'Unauthorized') {
  // Session expired, redirect to login
  history.push('/login')
}

if (loading) {
  // Request in flight, disable submit button
}
```

## Optimistic vs Confirmed Updates

**Optimistic (instant):**
```javascript
// Local state updates immediately
setLocalProgress(0.45)  // User sees bar move right now

// Background API call (async)
PUT /api/v1/courses/1/sections/1/progress
  → Response confirms or indicates error
```

**If API fails:**
```javascript
// Rollback optimistic update
setLocalProgress(previousValue)
showNotification('Failed to save progress. Retrying...')

// Retry with backoff
```

## Testing

### Unit Test Example
```javascript
describe('useProgressTracking', () => {
  it('updates local progress immediately', async () => {
    const { result } = renderHook(() => 
      useProgressTracking('course-1', 1)
    )
    
    act(() => {
      result.current.updateProgress(100, 5)
    })
    
    expect(result.current.localProgress).toBe(0.25)  // 5/20 exercises
  })
  
  it('calls backend API with correct data', async () => {
    const mockUpdateAPI = jest.fn()
    
    // ... render hook ...
    
    await act(async () => {
      await result.current.updateProgress(100, 5)
    })
    
    expect(mockUpdateAPI).toHaveBeenCalledWith(
      expect.objectContaining({
        xp: 100,
        exercisesCompleted: 5
      })
    )
  })
})
```

### Integration Test Example
```javascript
describe('Real-time progress in LearningPath', () => {
  it('shows progress bar in unit card', async () => {
    render(<CourseUnitsGrid units={[
      { unitOrder: 1, state: 'current', progressPercent: 0.45 }
    ]} />)
    
    const progressFill = screen.getByRole('progressbar')
    expect(progressFill).toHaveStyle('width: 45%')
  })
  
  it('animates progress ring on current unit', async () => {
    render(<LearningPath units={[
      { unitOrder: 1, state: 'current', progressPercent: 0.45 }
    ]} />)
    
    const ring = screen.getByTestId('progress-ring')
    expect(ring).toHaveClass('progressRing')
    // Check SVG stroke-dasharray
  })
})
```

## FAQ

**Q: What if user navigates away during exercise?**  
A: Polling will still keep graph in sync. Optimistic update rolls back if API fails.

**Q: What if backend is slow?**  
A: Optimistic update shows immediately. User continues learning. API responds eventually.

**Q: Can I customize animation speed?**  
A: Yes. Change `0.3s` in SCSS or pass duration to hook:
```javascript
useProgressTracking(courseId, sectionIndex, { animationDuration: '0.5s' })
```

**Q: What about mobile performance?**  
A: Progress bar uses CSS transitions (GPU-accelerated). Ring uses SVG circle (lightweight). Total overhead: <1ms per update.

**Q: Can I disable polling?**  
A: Yes:
```javascript
useProgressPolling(courseId, 0)  // Disabled
// or
useProgressPolling(courseId, 10000)  // Every 10s instead of 5s
```

## Related Files

- **Frontend Hooks:** `src/hooks/useProgressTracking.js`, `src/hooks/useProgressPolling.js`
- **API Layer:** `src/api/courses.js` (updateSectionProgress, completeSectionProgress)
- **Components:** `src/components/CourseUnitsGrid.js`, `src/components/ui/LearningPath/index.js`
- **Styling:** `*.module.scss` (progressBar, progressRing classes)
- **Specification:** `docs/PROGRESS_TRACKING_STATUS.md`
