# Duolingo Design System Reference

> Deep UI/UX analysis of Duolingo.com — extracted May 2026 via browser automation.  
> Intended as a design reference for building gamified learning applications.

---

## 1. Brand Identity

### 1.1 Name & Mascot
- **Product:** Duolingo
- **Mascot:** Duo — a friendly green owl
- **Personality:** Playful, encouraging, slightly cheeky; gamified but not infantilising
- **Tone of Voice:** Warm, friendly, casual. Uses phrases like "Hi there! I'm Duo!", "Let's get this party started!", "Awesome! You're working hard and learning new words!"

### 1.2 Logo
- Wordmark "Duolingo" in custom typeface (feather variant)
- Green colour, displayed top-left in navigation

### 1.3 Tagline
- "The free, fun, and effective way to learn a language!"

---

## 2. Typography

### 2.1 Font Families

| Role | Font | Fallback |
|------|------|----------|
| Headings (H1 large, H2) | **Feather** (custom) | sans-serif |
| Body, H1 small, buttons | **Din Round** (custom) | sans-serif |
| Default body | sans-serif | — |

Both are custom/proprietary typefaces. Feather is round, friendly, with distinctive character shapes. Din Round is geometric, modern, highly legible.

### 2.2 Type Scale

| Element | Font Family | Size | Weight | Colour |
|---------|------------|------|--------|--------|
| Hero H1 (marketing) | feather | 64px | 700 | `#042C60` (dark navy) or `#58CC02` (green) |
| Page H1 (app) | din-round | 32px | 700 | `#4B4B4B` (dark grey) |
| Section H2 (marketing) | feather | 48px | 700 | `#58CC02` (green) |
| Feedback H2 (app) | din-round | 24px | 700 | `#58A700` (dark green — success) or `#EA2B2B` (red — error) |
| Body text (p) | din-round | 17px | 500 | `#777777` (muted grey) |
| Body text dark | din-round | 17px | 400-500 | `#3C3C3C` (body grey) |
| Button text | din-round | 15-17px | 700 | `#FFFFFF` / varies |
| Caption/Learner count | din-round | 17px | 400-500 | `#777777` |
| "New word" label | din-round | 17px | 500 | `#3C3C3C` |
| "Previous mistake" label | din-round | 17px | 500 | `#3C3C3C` |
| Radio option labels | din-round | 17px | 500 | `#4B4B4B` |
| Cookie consent H2 | din-round | 19px | 700 | `#4B4B4B` |

### 2.3 Text Transform
- Buttons: UPPERCASE (e.g. "GET STARTED", "I ALREADY HAVE AN ACCOUNT", "CONTINUE", "SKIP", "CHECK")
- Headings: lowercase (e.g. "free. fun. effective.", "backed by science") — intentional anti-corporate styling
- Exercise headings: Sentence case ("Which one of these is "tea"?")
- Body: Sentence case

---

## 3. Colour System

### 3.1 Core Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Duolingo Green** | `#58CC02` | rgb(88, 204, 2) | Primary brand colour, H2 headings, CTA buttons |
| **Success Green** | `#58A700` | rgb(88, 167, 0) | "Nice!" feedback, correct answer states |
| **Error Red** | `#EA2B2B` | rgb(234, 43, 43) | "Correct solution:" header, wrong answer states |
| **Duo Navy** | `#042C60` | rgb(4, 44, 96) | Hero H1, secondary brand |
| **Dark Grey** | `#4B4B4B` | rgb(75, 75, 75) | H1 headings (app), body text |
| **Body Grey** | `#3C3C3C` | rgb(60, 60, 60) | Body text, labels |
| **Muted Grey** | `#777777` | rgb(119, 119, 119) | Paragraphs, subtitles, learner counts |
| **Disabled Grey** | `#AFAFAF` | rgb(175, 175, 175) | Disabled buttons, inactive text |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Backgrounds, text on dark/green |
| **Light Blue** | `#1CB0F6` | rgb(28, 176, 246) | Cookie accept button |

### 3.2 Background Colours
- Page background: `#FFFFFF`
- Containers: `transparent` (most elements use transparent bg, with parents providing colour)
- Green sections: green background via parent container, buttons transparent on top

### 3.3 Semantic Colours
- **Success:** `#58A700` (green — correct answer feedback)
- **Error:** `#EA2B2B` (red — wrong answer feedback, "Correct solution:")
- **Info/Neutral:** `#4B4B4B` / `#3C3C3C` (dark greys)
- **Disabled:** `#AFAFAF` (grey — inactive buttons)
- **Active/Enabled:** `#58CC02` (green — enabled buttons)

---

## 4. Spacing & Layout

### 4.1 Button Styles

| Variant | Bg | Text Colour | Border Radius | Padding | Font | Shadow |
|---------|-----|------------|---------------|---------|------|--------|
| Primary (CTA) | transparent (green parent) | `#FFFFFF` | 12-16px | 0px 16px | 15-17px, 700 | none |
| Secondary | transparent | `#AFAFAF` | 16px | 0px 16px | 17px, 700 | none |
| Ghost/Text | transparent | `#58CC02` | 16px | 0px 16px | 17px, 400 | none |
| Disabled | transparent | `#AFAFAF` | 16px | 0px 44px | 15px, 700 | — |
| Cookie accept | `#1CB0F6` | `#FFFFFF` | 12px | 13px 16px | 15px, 700 | none |
| "REJECT ALL" | transparent | — | — | — | — | — |
| Report | transparent | `#58A700` | — | — | 17px, 400 | — |
| Skip | transparent | `#AFAFAF` | 16px | 0px 16px | 17px, 700 | — |

**Key insight:** Primary buttons use transparent backgrounds. The green colour comes from the parent container. This suggests a layered design approach where colour blocks sit behind transparent interactive elements.

### 4.2 Radio Buttons / Option Cards

**Language selection cards:**
- Display: flex (vertical list or grid)
- Each option is a `<button>` with: flag image, language name (H2), learner count
- Width: approximately 200px per card
- Background: transparent, border: none
- Cursor: pointer
- Text: language name `17px, 700, #4B4B4B`, learner count `17px, #777777`

**Exercise option cards (multiple choice):**
- Displayed as a list of radio buttons
- Each option has: number badge, text label, decorative elements (flag icons)
- Selectable via click/tap anywhere on the card
- Disabled state after submission (all options disabled)
- Selected state: visual highlight (border/background change)
- Correct state: green highlight
- Incorrect state: red highlight

**Onboarding radio cards:**
- Icon + label layout
- Cards with images representing each option
- Full-width cards with rounded corners
- Selected state: visible border/highlight
- Labels: din-round, 17px, #4B4B4B

### 4.3 Progress Bar
- Horizontal bar at top of lesson screen
- Transparent background
- Height: ~16px
- Width: full viewport (1002px on desktop)
- Filled segment grows as exercises complete
- Green fill (brand colour)

### 4.4 Hearts/Lives Display
- Top bar, next to progress bar
- Heart icon + number (e.g., "5" → "4" after wrong answer)
- Decrements on incorrect answers
- Text: 17px, #3C3C3C
- Heart icon changes visually (filled/empty) when lost

### 4.5 Exercise Layout Structure
```
┌─────────────────────────────────────┐
│  [← Back] [====progress bar====] [♥ 5] │  ← Top bar
├─────────────────────────────────────┤
│  [Flag] New word                    │  ← Context label
│                                     │
│  Exercise Question (H1)             │  ← 32px, din-round, 700
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Prompt word / audio        │    │  ← Prompt area
│  └─────────────────────────────┘    │
│                                     │
│  ○ Option 1                        │  ← Radio options
│  ○ Option 2                        │     (word bank or
│  ○ Option 3                        │      radio buttons)
│                                     │
├─────────────────────────────────────┤
│  [Skip]              [Check]        │  ← Bottom bar
│  ─ OR ─                             │
│  [Report]  "Nice!"  [Continue]      │  ← Feedback bar
└─────────────────────────────────────┘
```

### 4.6 Cookie Banner (Modal)
- Position: Fixed bottom/sticky
- Background: White card
- Border radius: Rounded
- Title: "Duo loves cookies" (H2, 19px, din-round, 700)
- Body: Descriptive text with link to Cookie Policy
- Buttons: "REJECT ALL" + "ACCEPT COOKIES" (blue bg)
- Role: alertdialog with region landmark

### 4.7 Navigation
- **Landing page:**
  - Top bar: Logo (left), "Site language" selector (right)
  - Bottom: Language course grid (horizontal scroll)
  - Footer: Multi-column link sections
- **Onboarding:**
  - Top bar: Logo + progress bar + back button
  - No footer navigation
  - Linear flow with Continue button
- **Lesson:**
  - Top bar: Back button (close/X), progress bar, hearts
  - No other navigation during exercise
  - Tip/protip shown at bottom occasionally

---

## 5. Components

### 5.1 Buttons

#### Primary CTA Button
```
Shape: Rounded rectangle (12-16px border radius)
Size: Height ~50px (16px vertical padding + 17px font)
Text: UPPERCASE, din-round, 700, 15-17px, white
Bg: Transparent (green from parent)
States:
  - Enabled: white text on green parent bg
  - Disabled: grey text (#AFAFAF) on neutral parent bg
  - Hover: Slight scale/brightness change (not captured)
```

#### Secondary/Ghost Button
```
Same shape as primary
Text: UPPERCASE, din-round, 700, 17px
Colour: #AFAFAF (disabled/muted)
Used for: "SKIP", "I ALREADY HAVE AN ACCOUNT"
```

#### Text Button (Report)
```
No background, no border
Text: Sentence case, din-round, 400, 17px
Colour: #58A700 (green)
```

#### Word Bank Token Button
```
Shape: Rounded pill
Text: din-round, sentence case
Border: subtle
States:
  - Available: interactive, clickable
  - Selected: appears in answer area
  - Disabled: dimmed (after answer submitted)
```

### 5.2 Radio Buttons (Exercise)
- Custom styled (not native)
- Full-width touch targets
- Number badge (1, 2, 3) + text label
- Flag/icon decoration
- States: default, active (selected), checked (correct), checked-incorrect, disabled
- After submission: all options disabled, correct one highlighted

### 5.3 Progress Bar
- Horizontal bar, full width
- Segmented fill indicator
- Green colour for progress
- Smooth animation between states

### 5.4 Hearts Indicator
- Heart icon + count number
- Positioned top-right in lesson header
- Decrements with animation on wrong answer
- Visual: filled heart → empty/broken heart

### 5.5 Feedback Panel
- Appears below exercise area after answer submission
- **Correct:** "Nice!" (H2, 24px, #58A700) + "Report" button + green "Continue" button
- **Incorrect/Wrong:** "Correct solution:" (H2, 24px, #EA2B2B) + correct answer text + "Report" button + green "Continue" button
- **Skipped:** Same as incorrect format, shows the answer

### 5.6 "New Word" Label
- Flag icon + "New word" text
- Appears above exercise prompt when introducing new vocabulary
- Font: din-round, 17px, 500, #3C3C3C

### 5.7 "Previous Mistake" Label
- Same style as "New word" label
- Indicates question being revisited after a wrong answer
- Key UX: spaced repetition built into the lesson flow

### 5.8 Duo Character / Mascot
- Appears prominently during onboarding with full-body animations
- Speech bubbles with encouraging messages
- Multiple poses/expressions
- Used to:
  - Welcome users ("Hi there! I'm Duo!")
  - Encourage ("Let's get this party started!")
  - Remind ("I'll remind you to practice so it becomes a habit!")
  - Motivate during Super upsell ("It can be hard to stay motivated…")
  - Celebrate mid-lesson ("Awesome! You're working hard and learning new words!")

### 5.9 Character Avatars (Chat Exercises)
- Illustrated character icons (LIN, BEA, etc.)
- Small circular avatars in dialogue exercises
- Used to personify conversation participants

### 5.10 Audio/Speaker Button
- Small circular button with speaker icon
- Plays pronunciation audio
- Present on: prompt words, listening exercises, chat exercises

---

## 6. Animations & Micro-Interactions

### 6.1 Observed Animation Patterns
- **Onboarding transitions:** Smooth slide/fade between onboarding screens
- **Duo animations:** Multiple-frame character animations (idle, talking, celebrating)
- **Continue button:** Transitions from disabled (grey) to enabled (green) on selection
- **Correct answer:** Brief pause → feedback panel slides in → "Nice!" text appears
- **Wrong answer:** Red feedback, heart decrement animation, question re-queued as "Previous mistake"
- **Progress bar:** Smooth fill animation as exercises complete
- **Word bank tokens:** Animate into answer area on selection

### 6.2 Loading States
- Full-screen loading with Duo illustration
- "Loading..." text
- Pro-tip displayed during load: "Protip: Repeat each sentence in a lesson out loud."

### 6.3 Transitions
- Between onboarding steps: Fade/slide
- Between exercises: Quick transition with loading state
- Feedback panel: Slides up from bottom

---

## 7. Gamification Systems

### 7.1 Hearts / Lives System
- **5 hearts** max (shown as heart icon + number)
- **-1 heart** on wrong answer
- Hearts don't regenerate mid-lesson (free tier)
- Visual: Heart icon visibly changes
- Creates tension: limited mistakes before lesson fails

### 7.2 XP (Experience Points)
- Gained on completing lessons/exercises
- Displayed at lesson completion (not fully observed in this session)
- Used for leaderboards and level progression

### 7.3 Streaks
- Daily practice tracking
- Fire/flame icon commonly associated
- Referenced but not directly observed on web onboarding

### 7.4 Gems / Currency
- Gem icon shown in top bar area
- Used for: purchasing hearts refills, streak freezes, timer boosts
- Not directly interacted with in this session

### 7.5 Daily Goals
- Set during onboarding: 5/10/15/20 min per day
- Options presented as: Casual, Regular, Serious, Intense
- Tied to XP targets and streak maintenance

### 7.6 Leaderboards
- Not observed in this session (requires full account)
- Typically: Weekly leagues, promotion/demotion system

### 7.7 Achievements / Level-Ups
- Not fully observed
- Mid-lesson encouragement: "Awesome! You're working hard and learning new words!"
- Likely more elaborate at lesson completion

### 7.8 Super Duolingo Upsell
- Integrated into onboarding flow
- Two-part narrative: "It can be hard to stay motivated…" → "…so Duolingo is designed to be fun like a game!"
- Duo character with sad then happy expressions
- Pitch: Gamification makes learning sustainable

---

## 8. Exercise UX Patterns

### 8.1 Exercise Types Observed

| Type | Description | Interaction |
|------|-------------|-------------|
| **Multiple Choice (image)** | "Which one of these is X?" with 3 radio options, each with flag+word | Tap radio button |
| **Select Correct Meaning** | Given English word, choose Spanish translation from 3 options | Tap radio button |
| **Write This in English** | Given Spanish phrase, tap English words from word bank to compose translation | Tap word tokens in order |
| **Tap What You Hear** | Audio plays Spanish word/phrase; tap matching Spanish text from word bank | Tap word tokens |
| **Select Matching Pairs** | Multiple English and Spanish words shown; tap matching pairs | Tap pairs sequentially |
| **Complete the Chat** | Dialogue exercise with character avatars; choose correct response | Tap radio button |

### 8.2 Exercise Flow

```
1. Question appears
   ├── Context label ("New word" / "Previous mistake")
   ├── Prompt (word, phrase, audio, or dialogue)
   └── Answer options

2. User selects answer (or taps word bank tokens)
   └── "Check" button enables (white text on green)

3. User taps "Check"
   ├── CORRECT:
   │   ├── Correct option highlighted green
   │   ├── All options disabled
   │   ├── "Nice!" feedback (24px, green)
   │   ├── "Report" button (ghost, green text)
   │   └── "Continue" button (green bg, white text)
   │
   ├── INCORRECT:
   │   ├── Wrong option highlighted red
   │   ├── All options disabled
   │   ├── "Correct solution:" + answer (24px, red)
   │   ├── Heart count decrements (5→4)
   │   ├── "Report" button
   │   ├── "Continue" button
   │   └── Question re-queued as "Previous mistake"
   │
   └── SKIP:
       ├── All options disabled
       ├── "Correct solution:" + answer shown
       └── "Continue" button

4. Tap "Continue" → next exercise
```

### 8.3 Feedback Timing
- **Immediate** on check: correct/incorrect shown instantly
- No delay before showing the right answer
- Continue requires explicit tap (no auto-advance)

### 8.4 Hint System
- Hover tooltip: "Remember that you can always hover over words to see what they mean."
- Speaker button: Tap to hear pronunciation
- "Can't listen now" option on listening exercises (accessibility)

### 8.5 Skip Mechanics
- "Skip" button available on most exercises
- Skipping shows the correct answer (no heart lost)
- Skips DON'T count as wrong — hearts preserved
- Skipped questions may still re-appear as review

### 8.6 Spaced Repetition
- "Previous mistake" label indicates wrong answers are re-presented
- Re-presentation happens within the same lesson
- Creates natural review cycle during the lesson

---

## 9. Onboarding Flow

### 9.1 Flow Steps (in order)

1. **Landing Page** → "Get started" button
2. **Language Selection** → "I want to learn…" — grid of language cards with learner counts
3. **Duo Intro #1** → "Hi there! I'm Duo!" — mascot introduction
4. **Duo Intro #2** → "Let's get this party started!" — tone-setting
5. **How did you hear?** → Radio group: TikTok, Google, News, TV, YouTube, Friends, Facebook, Other
6. **Why are you learning?** → Radio group: Travel, Productivity, Career, Education, Fun, Connect, Other
7. **Proficiency** → "How much Spanish do you know?" — 5 levels from new to fluent
8. **Course Overview** → "Here's what you can achieve!" — 3 value props (confidence, vocabulary, habit)
9. **Daily Goal** → "What's your daily learning goal?" — 5/10/15/20 min (Casual/Regular/Serious/Intense)
10. **Notification Permission** → "I'll remind you to practice so it becomes a habit!" + browser prompt
11. **Choose Path** → "Start from scratch" vs "Find my level" (placement test)
12. **Super Duolingo Pitch #1** → "It can be hard to stay motivated…"
13. **Super Duolingo Pitch #2** → "…so Duolingo is designed to be fun like a game!"
14. **First Lesson** → Begins immediately

### 9.2 Onboarding Design Principles
- **Progressive disclosure:** One question per screen
- **Low friction:** Maximum one choice per step
- **Duo as guide:** Character appears on most screens with contextual animations
- **Social proof:** Language cards show learner counts (e.g., "43M learners")
- **No forced account creation:** Lesson starts before sign-up
- **Personalisation:** Learning reason + proficiency used to tailor experience
- **Gamification introduced naturally:** Daily goals, streak system explained by Duo
- **Super upsell integrated smoothly:** Narrative approach (problem → solution) rather than hard sell

### 9.3 Question Design
- All use radio groups (single select)
- Each option has an illustrative icon
- Clear, conversational language
- "Other" option always available
- Continue button disabled until selection made
- Progress bar shows onboarding progress

---

## 10. Copy & Tone

### 10.1 Voice Characteristics
- **Friendly:** "Hi there!", "Awesome!"
- **Encouraging:** "You're working hard and learning new words!"
- **Playful:** "Let's get this party started!", "Duo loves cookies"
- **Casual:** Lowercase headings ("free. fun. effective.")
- **Supportive:** "It can be hard to stay motivated… so Duolingo is designed to be fun like a game!"
- **Clear & Direct:** Exercise instructions are concise and action-oriented

### 10.2 Copy Patterns

**Onboarding questions:**
- "I want to learn…"
- "How did you hear about Duolingo?"
- "Why are you learning Spanish?"
- "How much Spanish do you know?"
- "What's your daily learning goal?"

**Encouragement:**
- "Nice!" (correct answer)
- "Awesome! You're working hard and learning new words!" (mid-lesson)
- "Here's what you can achieve!" (value props)

**Instructions:**
- "Which one of these is "tea"?"
- "Select the correct meaning"
- "Write this in English"
- "Tap what you hear"
- "Select the matching pairs"
- "Complete the chat"

**Microcopy:**
- "Protip: Repeat each sentence in a lesson out loud." (loading screen)
- "Remember that you can always hover over words to see what they mean." (tooltip)
- "Can't listen now" (accessibility option)
- "Use keyboard" (input alternative)
- "Report" (flag incorrect content)

**Marketing:**
- "The free, fun, and effective way to learn a language!"
- "free. fun. effective."
- "backed by science"
- "stay motivated"
- "personalized learning"
- "learn anytime, anywhere"

### 10.3 Language Style
- Second person ("you", "your")
- Active voice
- Short sentences
- No jargon
- Inclusive, gender-neutral
- Encouraging without being condescending

---

## 11. Accessibility

### 11.1 Observed Practices
- **Semantic HTML:** Proper heading hierarchy (h1, h2), landmark roles (banner, main, contentinfo, navigation)
- **ARIA roles:** alertdialog (cookie banner), radiogroup, radio, progressbar, button
- **Alternative input:** "Use keyboard" option on word bank exercises
- **Audio alternatives:** "Can't listen now" on listening exercises → falls back to text
- **Report button:** Users can flag problematic content
- **Alt text:** Images have alt attributes (e.g., "Duolingo", "badge-app-store")

### 11.2 Colour Contrast
- White text (#FFF) on green (#58CC02): ~3.8:1 ratio — borderline for WCAG AA
- Dark grey (#4B4B4B) on white (#FFF): ~8.5:1 — passes AAA
- Muted grey (#777) on white (#FFF): ~4.5:1 — passes AA for large text
- Red (#EA2B2B) on white (#FFF): ~4.7:1 — passes AA for large text

### 11.3 Focus States
- Buttons and interactive elements use cursor: pointer
- Focus indicators not specifically captured but likely present

### 11.4 Keyboard Navigation
- Tab order follows visual layout
- Radio groups navigable via arrow keys
- "Use keyboard" option provides text input alternative to word bank

---

## 12. Responsive Patterns

### 12.1 Desktop (Observed)
- Full-width layout
- Centred content area for exercises
- Side padding for breathing room
- Language selection: multi-column grid
- Navigation: horizontal top bar

### 12.2 Mobile (Inferred from Design)
- Mobile-first design philosophy
- Large touch targets (minimum ~44px)
- Single-column layout for exercises
- Bottom-anchored action buttons
- Language selection: likely single column scrollable list
- Cookie banner: fixed bottom

### 12.3 Layout Approach
- The app uses a single-column centred layout for the core exercise experience
- Top bar and bottom bar are fixed/sticky
- Content scrolls between them
- This pattern works for both mobile and desktop without breakpoints

---

## 13. Design Tokens Summary

### 13.1 Quick Reference Table

```css
/* Typography */
--font-heading: 'feather', sans-serif;
--font-body: 'din-round', sans-serif;
--font-size-h1-hero: 64px;
--font-size-h1: 32px;
--font-size-h2-marketing: 48px;
--font-size-h2: 24px;
--font-size-body: 17px;
--font-size-button: 15px;
--font-weight-bold: 700;
--font-weight-medium: 500;
--font-weight-regular: 400;

/* Colours */
--color-green: #58CC02;
--color-green-dark: #58A700;
--color-red: #EA2B2B;
--color-navy: #042C60;
--color-dark-grey: #4B4B4B;
--color-body-grey: #3C3C3C;
--color-muted-grey: #777777;
--color-disabled-grey: #AFAFAF;
--color-white: #FFFFFF;
--color-blue-light: #1CB0F6;

/* Spacing */
--radius-button: 12px;
--radius-button-lg: 16px;
--padding-button-h: 16px;
--padding-button-v: 13px;
--padding-button-cta: 0px 44px; /* disabled state */
--padding-button-normal: 0px 16px;

/* Layout */
--exercise-max-width: ~600px;
--top-bar-height: ~60px;
--bottom-bar-height: ~60px;
```

---

## 14. Key Design Insights

### 14.1 What Makes Duolingo's Design Effective

1. **Immediate value delivery** — Lesson starts before sign-up. No friction to try the product.

2. **Progressive complexity** — Starts with simple multiple choice, graduates to word bank, listening, and conversation.

3. **Emotionally intelligent feedback** — "Nice!" is warmer than "Correct!" — and comes with a green colour that feels rewarding, not clinical.

4. **Duo as emotional anchor** — The owl mascot isn't decoration; it's the face of encouragement, reminders, and gentle pressure. It makes the app feel alive.

5. **Transparent button architecture** — Buttons are transparent, placed over coloured containers. This creates clean, flat design while maintaining interactivity.

6. **Mistakes as learning opportunities** — Wrong answers become "Previous mistakes" that reappear. No punishment, just more practice.

7. **Hearts as meaningful constraints** — Limited mistakes create real stakes without being punitive. The skip option provides an escape valve.

8. **Lowercase headings** — The anti-corporate typography ("free. fun. effective.") signals the product is friendly and approachable.

9. **Gamification woven into narrative** — The Super Duolingo pitch frames gamification as the solution to a universal problem (staying motivated), not as a feature list.

10. **Onboarding as conversation** — Each screen asks one question, with Duo as the friendly interviewer. It feels like a chat, not a form.

### 14.2 Lessons for Building Similar Apps

- **Don't gate the product behind sign-up** — Let users experience value first
- **Use a mascot consistently** — It creates emotional connection and brand recall
- **One decision per screen in onboarding** — Reduces cognitive load
- **Make feedback warm, not robotic** — "Nice!" > "Correct answer"
- **Mistakes should teach, not punish** — Re-present wrong answers
- **Transparent buttons over coloured containers** — Clean visual design pattern
- **Progressive exercise difficulty** — Multiple choice → word bank → free text → conversation
- **Skip as safety valve** — Always provide an escape from frustration
- **Pro-tips during loading** — Turn dead time into learning moments
- **Accessibility as default** — "Can't listen now", "Use keyboard", semantic HTML

---

## 15. Screenshots Taken

All screenshots saved in workspace root:

| File | Screen |
|------|--------|
| `screenshot-01-landing.png` | Duolingo landing page |
| `screenshot-02-language-select.png` | Language selection grid |
| `screenshot-03-duo-welcome.png` | Duo welcome — "Hi there! I'm Duo!" |
| `screenshot-03b-welcome-transition.png` | Welcome screen transition state |
| `screenshot-04-how-did-you-hear.png` | "How did you hear about Duolingo?" |
| `screenshot-05-why-learning.png` | "Why are you learning Spanish?" |
| `screenshot-06-proficiency.png` | "How much Spanish do you know?" |
| `screenshot-07-course-overview.png` | "Here's what you can achieve!" |
| `screenshot-08-daily-goal.png` | "What's your daily learning goal?" |
| `screenshot-09-notifications.png` | Notification permission prompt |
| `screenshot-10-choose-path.png` | "Start from scratch" vs "Find my level" |
| `screenshot-11-super-upsell.png` | Super Duolingo pitch part 1 |
| `screenshot-12-fun-like-game.png` | Super Duolingo pitch part 2 |
| `screenshot-13-exercise-1.png` | Exercise: "Which one of these is tea?" |
| `screenshot-14-correct-feedback.png` | Correct answer feedback: "Nice!" |
| `screenshot-15-wrong-answer.png` | Wrong answer: "Correct solution:" + heart loss |
| `screenshot-16-write-exercise.png` | Exercise: "Write this in English" (word bank) |
| `screenshot-17-tap-what-you-hear.png` | Exercise: "Tap what you hear" (listening) |
| `screenshot-18-complete-chat.png` | Exercise: "Complete the chat" (dialogue) |
| `screenshot-19-mid-lesson-cheer.png` | Mid-lesson encouragement |
| `screenshot-20-after-cheer.png` | Exercise after encouragement |
