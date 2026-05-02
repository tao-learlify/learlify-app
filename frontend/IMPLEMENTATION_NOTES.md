# Course Units Visualization Implementation

## Overview
Implemented a complete course units visualization system that displays all 15 course units with progress data, learning objectives, and interactive navigation.

## Components Created

### 1. **useLearningPathWithSchema Hook** 
**File:** `/src/hooks/useLearningPathWithSchema.js`

Combines Redux course/progress data with Schema v2 unit definitions:
- Loads all 15 schema units asynchronously
- Maps section indices from API to unit data
- Enriches progress data with unit metadata (titles, learning objectives, difficulty, themes)
- Returns structured units with state (locked/current/completed) and progress (xp, completed status)

**Returns:**
```javascript
{
  units: [
    {
      unitOrder: 1,
      title: "Unit 1 — Daily Routines",
      subtitle: "Talking about habits and schedules",
      learningObjective: "...",
      difficulty: "A2",
      theme: { name, accent, accentSoft, icon, mood },
      estimatedDurationMin: 90,
      state: 'completed' | 'current' | 'locked',
      xp: 100,
      completed: false,
      lastAccessedAt: "2024-04-23T..."
    },
    // ... units 2-15
  ],
  courseTitle: "Aptis",
  courseId: 1,
  totalSections: 15,
  completedSections: 3,
  loading: boolean,
  error: Error | null
}
```

### 2. **CourseUnitsGrid Component**
**File:** `/src/components/CourseUnitsGrid.js`  
**Styles:** `/src/components/CourseUnitsGrid.module.scss`

Responsive grid component displaying units with visual indicators:
- **UnitCard** - displays regular lessons with:
  - Status badge (completed, current, locked)
  - Unit title and subtitle
  - Learning objective in styled box
  - Metadata tags (difficulty, duration)
  - XP badge
  - "Last accessed" indicator
  - Hover/active states
  
- **ChallengeCard** - displays exam challenges with:
  - Premium/free badge
  - Completion status
  - XP reward
  - Separate styling

**Features:**
- Responsive grid (1-3 columns depending on screen size)
- Theme colors from unit schema
- Interactive click handling
- Accessible with proper ARIA labels
- Separate sections for regular units and challenges

### 3. **CoursesOverview View**
**File:** `/src/views/courses/CoursesOverview.js`  
**Styles:** `/src/views/courses/CoursesOverview.module.scss`

Main course navigation page that brings together:
- Header with course title, progress bar, and user info
- Course progress tracking (X of Y units completed)
- CourseUnitsGrid displaying all units
- Error handling with fallback UI
- Loading states

**Features:**
- Back button to dashboard
- Overall progress visualization
- User XP display
- Responsive design
- Error boundaries

## Data Flow

```
Redux Store (courses, advance)
    ↓
useLearningPathWithSchema Hook
    ├→ Loads all schema units (unit-1 through unit-15)
    └→ Maps progress data to unit metadata
    ↓
CoursesOverview View
    ├→ Displays header with progress
    └→ Renders CourseUnitsGrid
         └→ Renders unit cards
            └→ On click → Navigate to ConnectedUnitView (/courses/:courseId/units/:unitOrder)
```

## Integration Points

### Router Configuration
**File:** `/src/router/index.js`
- Added import: `CoursesOverview`
- Added route: `{ path: '/courses', component: CoursesOverview }`

### Navigation Flow
1. Dashboard → "View Courses" link → `/courses` → CoursesOverview
2. CoursesOverview → Click unit card → `/courses/:courseId/units/:unitOrder` → ConnectedUnitView
3. ConnectedUnitView loads unit content with sample schema or backend CDN data

## UI Features

### Unit Card States
- **Locked:** Disabled, 70% opacity, gray lock icon
- **Current:** Blue highlight, play icon, subtle background glow
- **Completed:** Green accent, checkmark icon
- **Hover:** Subtle elevation, smooth transitions

### Responsive Design
- **Desktop:** 3-column grid (300px+ columns)
- **Tablet:** 2-column grid for challenges, 3 for units
- **Mobile:** Single column layout

### Theme Integration
- Each unit displays its theme accent color
- Color used for left border, badges, and interactive states
- Fallback to blue (#3B82F6) if no theme

## Progress Visualization

- **Progress Bar:** Linear gradient (blue → green) showing completion %
- **Unit Badges:** 
  - Completed: Green checkmark
  - Current: Colored play button
  - Locked: Gray lock icon
- **XP Display:** Color-coded badge with gradient background
- **Streak & Stats:** Displayed in header (from Redux user state)

## Usage Example

```javascript
import CoursesOverview from 'views/courses/CoursesOverview'

// Automatically handles:
// - Loading all 15 units from schema
// - Fetching progress from Redux
// - Combining data
// - Displaying with proper states
// - Handling navigation to individual units
```

## Redux Dependencies

The implementation uses:
- `useCourses()` - Gets course list and loading state
- `useAdvance()` - Gets user progress (sections completed, XP, etc.)
- `useModels()` - Gets current model/exam type
- `useExams()` - Gets exam challenges to interleave
- `useAuthProvider()` - Gets user profile (name, XP, streak)

## Schema Integration

All 15 units from the schema include:
- **Metadata:** Title, subtitle, learning objective, difficulty
- **Theme:** Name, accent colors, icon, mood
- **Content:** 6 sections (grammar, vocabulary, listening, speaking, reading, writing)
- **Exercises:** gap_select and true_false types

## Testing

To test the implementation:
1. Navigate to `http://localhost:3000/courses`
2. Should see all 15 units in a grid
3. Units 1-3 show as "completed" (based on mock data)
4. Unit 4 shows as "current"
5. Units 5-15 show as "locked"
6. Click on an unlocked unit → navigates to `/courses/1/units/unitOrder`
7. Hover effects and responsive layout should work

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS variables for theming
- Phosphor Icons for UI elements

## Future Enhancements
- Unit preview modal on hover
- Drag-and-drop reordering (for admin)
- Achievement badges for milestones
- Unit statistics (average score, time spent)
- Completion certificates
- Social sharing of progress
