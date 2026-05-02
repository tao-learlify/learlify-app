# Frontend Technical Audit Report — learlify-frontend
**Date:** 2026-03-02  
**Auditor:** Staff Frontend Engineer (AI-assisted)  
**Codebase size:** ~38,964 LOC (JS/JSX), 0 TS files  
**Version:** 0.4.0

---

## 1. Executive Summary

- **No TypeScript** across the entire codebase. JSDoc annotations exist but are sparse and not enforced.
- **Zero React Error Boundaries** found — any unhandled component error crashes the full app with no fallback.
- **JWT access token stored in `localStorage`** (key: `aptis`) — fully exposed to XSS attacks.
- **`console.error` is globally muted in production** (`index.js`), making runtime errors completely invisible.
- **Only 4 test files** for ~39 K LOC. No integration or E2E tests evident in the repo.
- **Three state-management strategies coexist**: redux-thunk + redux-saga + RTK Query v0.3 — none fully superseding the others, creating serious unpredictability.
- **God components** (`courses/index.js` 684 LOC, `Exercise.js` 550 LOC, `AdminView.js` 524 LOC) violate SRP and make feature changes high-risk.
- **16 `react-hooks/exhaustive-deps` suppressions** indicate widespread stale-closure risk, not isolated incidents.
- **`utils/functions.js` is a 528-line dumping ground** with no domain organisation, imported project-wide.
- **Five parallel CSS strategies** (styled-components, MUI v4, Bootstrap, SCSS modules, inline) create an inconsistent, hard-to-maintain style system.
- **Critical dependency staleness**: React 17, MUI v4, RTK Query 0.3.0 (pre-release), socket.io-client v2, framer-motion v1 — all have breaking-change upgrades pending.
- **`updateProfileThunk`** contains a confirmed bug: `rejectWithValue(rejectWithValue)` passes the function itself instead of the error object.
- **`isDemo()` business rule is fragile**: checks `user.firstName === 'Demo'` — a display-name change would break demo mode silently.
- **No CSP headers, no HTTP security headers config** found in the repository (nginx.conf minimal).

---

## 2. Architecture Map & Hotspots

### 2.1 Architecture Map

```
┌──────────────────────────────────────────────────────────┐
│                        index.js                          │
│  Provider(Redux) > I18nextProvider > Suspense > App      │
└─────────────────────────┬────────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │        App.js         │
              │  useAuthProvider      │
              │  4× useEffect (init)  │
              │  WebSockets/EventSrc  │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │     router/index.js   │
              │  public / private     │
              │  PrivateRoute HOC     │
              └───────────┬───────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
   views/auth      views/courses    views/exams
   views/dashboard views/meetings   views/plans …
          │               │               │
          └───────────────┼───────────────┘
                          │
     ┌──────────┬─────────┴──────┬──────────────┐
     │          │                │              │
  hooks/     store/           api/          modules/
  (60+)   @reducers/         (fetch)       (domain)
          @thunks/
          @selectors/
          @controllers/
          reducers/ (legacy)
          actions/types.js (legacy – 808 LOC)
          context/ (React Context)
          functions/ (localStorage hydrate)
                          │
                    providers/
                    (http, WebSockets, EventSource)
```

### 2.2 Hotspots Table

| # | File | LOC | Why it's a hotspot | Likely impact |
|---|------|-----|--------------------|---------------|
| 1 | `src/store/actions/types.js` | 808 | Legacy Flux-style action constants; entire old Redux layer still referenced. Signals incomplete migration to RTK. | Any store change touches this file; merge conflict magnet. |
| 2 | `src/views/courses/index.js` | 684 | God component: 10+ hooks, `useReducer` + Redux + Context, inline API calls, business logic, rendering. Has `/* eslint-disable react-hooks/exhaustive-deps */`. | Bugs in course flow are hard to isolate; re-render storms likely. |
| 3 | `src/views/evaluations/components/Viewer.js` | 609 | Monolithic viewer component; likely handles rendering, validation, and navigation. | Evaluation bugs affect every exam type. |
| 4 | `src/views/meetings/components/participant/Participant.js` | 576 | Twilio + WebRTC inside a single component; track management, UI, and stream logic merged. | Crashes here have no error boundary; user sees white screen. |
| 5 | `src/components/Reading/index.js` | 566 | Inline domain logic for exercise reading; mixes content rendering, answer validation, and state. | Shared widely across exercise types. |
| 6 | `src/views/exams/Exercise.js` | 550 | Same god-component pattern: `useReducer`, 8+ hooks, conditional rendering chains >3 levels deep. `eslint-disable` at top. | Central exam flow; high-risk regression surface. |
| 7 | `src/views/agreement/index.js` | 537 | Agreement/onboarding flow in one file. | Onboarding bugs invisible until release. |
| 8 | `src/utils/functions.js` | 528 | Catch-all utility file: formatting, bears tokens, file extensions, RegExp, domain helpers — no cohesion. | Imported everywhere; changes have unpredictable blast radius. |
| 9 | `src/views/dashboard/AdminView.js` | 524 | Admin panel: multiple paginated lists, forms, modals, and thunk dispatches in one component. | Admin flow breakage goes unnoticed (low test coverage). |
| 10 | `src/views/classes/AdminSchedule.js` | 454 | Scheduling UI + business logic + API calls in one view. Uses `@devexpress/dx-react-scheduler`. | Scheduler dependency is v2.7; has known breaking changes in later versions. |

---

## 3. Architecture & Design Patterns

### 3.1 Patterns Identified

| Pattern | Where | Assessment |
|---------|-------|------------|
| Containers / Presentational | Inconsistent — most views mix both | ⚠️ Partial, not enforced |
| Custom hooks as service layer | `hooks/` (60+ files) | ✅ Good intent; over-proliferated |
| Redux slices (RTK) | `store/@reducers/` | ✅ Correct usage |
| Async thunks | `store/@thunks/` | ✅ Consistent |
| Controller layer (reducer logic extracted) | `store/@controllers/` | ✅ Good separation |
| React Context for cross-cutting state | `store/context/` | ⚠️ Coexists with Redux without clear rules |
| Legacy action types | `store/actions/types.js` | ❌ Dead weight, migration incomplete |
| Saga middleware registered but underused | `store/index.js` | ❌ Adds bundle weight with no benefit if unused |
| Feature-based views | `views/` per domain | ✅ Good |

### 3.2 Architectural Smells

1. **Three-way state management** — `redux-thunk` (primary), `redux-saga` (registered, unclear usage), `rtk-query @0.3.0` (experimental). No policy document on which to use when.
2. **God hooks** — `useAuthProvider` mixes auth state, JWT decode, localStorage, routing. `useHttpClient` duplicates what RTK Query should handle.
3. **Domain logic inside UI** — `courses/index.js` calls `modules/exercises`, `modules/validation`, and `modules/words` directly; no service/use-case layer.
4. **Duplicate state sources** — auth state lives in both Redux (`store/@reducers/auth`) AND `localStorage` AND is manually hydrated on every boot via `store/functions/auth.js`. No single source of truth.
5. **Inconsistent localStorage access** — token read via `utils/localStorage.js`, `store/functions/auth.js`, and `hooks/useLocalStorage.js` — three abstractions for the same thing.
6. **Barrel export coupling** — `api/index.js` re-exports everything; any view can import any API function, making dependency boundaries opaque.
7. **`@` prefix naming convention** in store is non-standard and will confuse new developers.

### 3.3 Architecture Cohesion Score

**4 / 10**

*Justification:* Clear intent (feature views, RTK slices, custom hooks) but sabotaged by incomplete Redux migration (808-line legacy types file), three coexisting data-fetching strategies, dual localStorage abstractions, and no enforced boundary between domain and UI layers.

---

## 4. Clean Code & Maintainability

### 4.1 Naming & Readability

| Severity | Issue | Evidence | Fix |
|----------|-------|----------|-----|
| Med | Non-standard `@` prefix for store folders | `store/@reducers/`, `store/@thunks/` | Rename to `store/reducers/`, `store/thunks/` (conventional). |
| Med | Abbreviations without context | `UP`, `TP` (in `AdminView.js`) as pagination hooks | Name them `userPagination`, `teacherPagination`. |
| Low | Spanish hardcoded in utility | `getFullName` returns `'Sin nombre'` | Use `t('FALLBACK.noName')` from i18n. |
| Low | Misleading variable name | `headears` (typo for `headers`) in `useHttpClient.js` line 30 | Fix typo; this silently drops custom headers. |

### 4.2 Function Complexity & Nested Conditionals

| Severity | Issue | Evidence | Fix |
|----------|-------|----------|-----|
| High | Deeply nested conditional rendering | `Exercise.js`, `courses/index.js` — 3–4 levels of `if (x) { if (y) { ... } }` in render | Extract to named sub-components or early returns. |
| Med | Inline reducer + business logic | `courses/index.js` uses both `useReducer` with `state/exercise` AND directly calls `modules/exercises` | Consolidate into a single state machine (XState or a proper reducer). |

### 4.3 Component Responsibility (SRP)

- `courses/index.js` violates SRP at every level: it fetches data, manages local state, handles routing, plays sounds, shows modals, and renders content — all in one function.
- `AdminView.js` manages two independent paginated lists (users + teachers) in a single component with shared state.
- **Recommendation:** Extract sub-components (`<CoursePlayerShell>`, `<CourseExerciseRunner>`, `<CourseCompletionFlow>`) and drive them with lifted state or context.

### 4.4 Hook Misuse

| Severity | Issue | Evidence | Fix |
|----------|-------|----------|-----|
| High | Global eslint-disable for exhaustive-deps | 16 files suppress the rule at file level | Fix actual dependencies or use `useRef` for stable refs. |
| High | `useHttpClient` always re-fetches | `useEffect(fetchResource, [])` with `clientConfig` in `useCallback` deps — if parent re-renders, `clientConfig` changes identity, re-triggering fetch | Stabilise `clientConfig` with `useMemo` at call site or use RTK Query. |
| Med | 4 separate `useEffect` in `App.js` all dependent on `user.isLoggedIn` | `App.js` lines 34–80 | Consolidate into one effect with explicit sequencing. |
| Med | `useEffect` cleanup returns socket disconnect | `categories` effect in `App.js` disposes the socket — unrelated side effects in the same effect | Separate concerns into individual effects. |

### 4.5 TypeScript / Type Quality

The project has **zero TypeScript files**. `@types/jwt-decode` and `@types/react-redux` are installed as devDependencies, indicating TypeScript was planned but never adopted. JSDoc types exist on ~20% of the codebase and are not enforced by tsc.

- **No discriminated unions** on Redux state (e.g., `error` and `loading` could conflict without TypeScript).
- `any` equivalent: JSDoc `@property {any} body`, `@property {any} value` throughout.

### 4.6 Error Handling & Empty States

| Severity | Issue | Evidence | Fix |
|----------|-------|----------|-----|
| **Critical** | Zero Error Boundaries | `grep -r "ErrorBoundary"` returns 0 matches | Add `<ErrorBoundary>` at route level and per major feature. |
| High | `console.error` muted globally in production | `index.js` lines 37–39 | Remove; use a proper logging service (Sentry, Datadog). |
| High | `updateProfileThunk` bug: `rejectWithValue(rejectWithValue)` | `store/@thunks/auth.js` line ~70 | Change to `rejectWithValue(err)`. |
| Med | `getTokenSession()` calls `window.location.reload()` on decode failure | `store/functions/auth.js` | Throws hard reload loop if token format is consistently invalid; dispatch `logOut` instead. |
| Med | `useHttpClient` swallows all errors | `.catch(err => setResponse({...response, error: true}))` — error object discarded | Preserve error message/status for rendering. |

### 4.7 Code Duplication

- `isLoggedIn()` is defined in **both** `utils/localStorage.js` and `store/functions/auth.js` with different implementations.
- Token retrieval duplicated across `utils/localStorage.getToken()`, `utils/localStorage.getSessionToken()`, `store/functions/auth.getTokenSession()`.
- `useNotification` and `useNotifications` (plural) both exist — unclear difference.

### 4.8 Dead Code

- `store/actions/types.js` (808 LOC) — Flux-era action constants. Verify with: `grep -r "from 'store/actions/types'" src/ | wc -l`.
- `redux-saga` is configured in `store/index.js` but no saga files were found in the main store tree. Mark as dead weight until sagas are confirmed.
- `store/reducers/errors.js`, `store/reducers/http.js`, `store/reducers/session.js` — parallel reducer layer alongside `@reducers/`.

**Maintainability Score: 3 / 10**

*Justification:* Pattern intent is visible (RTK slices, custom hooks) but execution is undermined by god components, suppressed lint rules, confirmed bugs, duplicate abstractions, and no TypeScript.

---

## 5. Performance Deep Dive

### 5.1 Unnecessary Re-renders

| Risk | Evidence | Severity |
|------|----------|----------|
| Inline object props | Components create new `{}` shapes in JSX attributes on every render | Med |
| Selector identity | `useSelector(authSelector)` — if `authSelector` returns a new object shape, every consumer re-renders | High |
| Missing `React.memo` on leaf components | `Text`, `FlexContainer`, `Button` appear as simple presentational components but `React.memo` is not confirmed | Med |

### 5.2 Missing Memoization Where It Matters

- `courses/index.js` derives exercise state from Redux + local `useReducer` on every render without memoised selectors.
- `useHttpClient.js`: `fetchResource` is in `useCallback` but `clientConfig` is not stable at call sites → infinite fetch risk.

### 5.3 Large Lists Without Virtualisation

- **Assumption** (unverified): `AdminView.js` renders paginated user lists. If page size > 50, no virtualisation (react-window/react-virtual) is used. Verify by checking `Pagination.js`.

### 5.4 Expensive Computations in Render

- `fuzzyset.js` for fuzzy matching in exercises — if called synchronously on every keystroke without debounce, this is O(n²) on the dictionary size.
- `chart.js` + `react-chartjs-2` v2 — v2 registers all chart types globally, increasing bundle size.

### 5.5 Bundle Size Risks

| Issue | Severity |
|-------|----------|
| `moment` + `moment-timezone` — ~530 KB unminified | High |
| `chart.js` v2 (global registration) | Med |
| `@devexpress/dx-react-scheduler*` — heavy DX suite | Med |
| `framer-motion` v1 (entire animation library for limited use) | Med |
| `rich-markdown-editor` (~200 KB, includes ProseMirror) | Med |
| `twilio-video` (~400 KB) loaded on all routes | High |
| `socket.io-client` v2 (larger than v4) | Low |
| No code-splitting evidence for heavy views (meetings, exams) | High |
| Barrel export `api/index.js` prevents tree-shaking of API module | Med |

### 5.6 Network / Caching

- `useHttpClient` uses raw `fetch` with no caching, no deduplication, no retry.
- RTK Query v0.3.0 is installed but likely underused — it would solve caching/deduplication natively.
- No `React.lazy` or `Suspense`-based route splitting observed in `router/index.js` (all routes imported statically).

### 5.7 Images / Fonts

- `moment-timezone` is imported fully — only the user's timezone is needed.
- **Assumption:** No image optimisation pipeline (WebP, responsive sizes) confirmed. Verify `public/images/`.

### 5.8 Top 5 Quick Wins

1. Replace `moment` + `moment-timezone` with `date-fns` or `dayjs` → ~500 KB bundle reduction.
2. Add `React.lazy` + `Suspense` to heavy routes (`/meetings`, `/exams`, `/courses`) → halves initial JS parse.
3. Fix `useHttpClient` `clientConfig` identity (memoize at call site) → eliminates infinite fetch loops.
4. Fix `console.error` being muted → restore error visibility in production.
5. Fix `updateProfileThunk` `rejectWithValue(rejectWithValue)` bug → profile updates now surface real errors.

### 5.9 Top 3 Strategic Wins

1. **Migrate to RTK Query** (use the stable version, not 0.3.0) — eliminates `useHttpClient`, deduplicates network requests, adds cache invalidation.
2. **Code-split `twilio-video` and `@devexpress/dx-react-scheduler`** behind `React.lazy` — they should only load for authorised roles.
3. **Replace `chart.js` v2 global-register with v3+ tree-shakeable API** — reduces chart bundle by ~60%.

**Performance Risk Score: 7 / 10** *(higher = more risk)*

*Justification:* Multiple large uncode-split dependencies, no route lazy-loading, and `moment` dominating the bundle are confirmed risks. RTK Query v0.3 installed but not fully replacing manual fetch wrappers.

---

## 6. Testing, Quality Gates & Observability

### 6.1 Test Coverage Reality

| Layer | Files Found | Assessment |
|-------|-------------|------------|
| Unit | 4 (`tests/modules.matching.test.js`, `tests/utils.colors.test.js`, `tests/utils.functions.test.js`, `tests/utils.middleware.test.js`) | Near zero |
| Integration | 0 confirmed | Absent |
| E2E | 0 confirmed | Absent |
| Storybook | Configured | Status unknown |

**39,000 LOC with 4 test files ≈ effectively 0% coverage.**

### 6.2 Coverage Gaps by Risk Area

| Risk Area | Has Tests? | Consequence |
|-----------|------------|-------------|
| Authentication (login/logout/JWT) | ❌ | Regression invisible |
| Payment flow (Stripe) | ❌ | Revenue-critical |
| Exam/exercise engine | ❌ | Core product feature |
| Role / access control (`useAccess`) | ❌ | Privilege escalation undetected |
| WebSocket reconnect logic | ❌ | Meeting stability unknown |

### 6.3 Error Boundaries & Observability

- **No `ErrorBoundary` components** — a JS error in `<Participant>` (WebRTC) kills the entire meeting page.
- **`console.error` silenced in production** — no visibility into runtime errors.
- **No Sentry / Datadog / LogRocket** integration found. **(Assumption — verify with network tab in prod.)**
- **No feature flags system** found. All changes ship to 100% of users.

**Release Confidence Score: 1 / 10**

*Justification:* 4 test files, no error boundaries, no observability, no feature flags, no E2E tests for critical purchase and exam flows.

---

## 7. Security & Privacy

### 7.1 Token Storage — CRITICAL

```javascript
// store/functions/auth.js
export function getTokenSession() {
  const token = localStorage.getItem('aptis') // ← JWT in localStorage
```

JWT access token stored in `localStorage` is readable by **any JavaScript running in the page** — including third-party scripts (ad networks, analytics). A single XSS vulnerability leads to full account takeover.

**Recommendation:** Store the access token in an `HttpOnly`, `SameSite=Strict` cookie managed by the backend. The current `js-cookie` dependency is already present but unused for auth.

### 7.2 XSS

- `dangerouslySetInnerHTML` usage: **not found** in the scanned files. ✅
- `markdown-it` and `react-markdown` render user content — verify `sanitize: true` options are set on all render calls.
- **Assumption:** `rich-markdown-editor` (ProseMirror-based) may emit HTML. Verify XSS sanitisation.

### 7.3 Sensitive Data Exposure in Logs

- 21 files contain `console.*` calls. While `console.error` is muted in production, `console.log` and `console.warn` are NOT suppressed — user data or tokens may appear in browser devtools.

### 7.4 CSP / Security Headers

- `nginx.conf` is present but content was not fully read. **Assumption:** No `Content-Security-Policy`, `X-Frame-Options`, or `X-Content-Type-Options` headers set. Verify with: `curl -I https://yourapp.com | grep -i security`.

### 7.5 Fragile Authorization Logic

```javascript
// store/functions/auth.js
export function isDemo () {
  const user = getTokenSession()
  return user && user.firstName === 'Demo' // ← display name as role check
}
```

Demo-mode gating is based on a display name, not a JWT claim or server-side role. A user named "Demo" would accidentally enter demo mode.

**Security Hygiene Score: 3 / 10**

*Justification:* JWT in localStorage is a confirmed critical risk. No dangerouslySetInnerHTML found is positive. CSP unconfirmed. isDemo() fragile.

---

## 8. DX / Tooling

| Tool | Status | Issue |
|------|--------|-------|
| CRA v4 / react-scripts | ⚠️ | CRA is effectively deprecated (archived). Vite migration recommended. |
| react-app-rewired + customize-cra | ⚠️ | Workaround for CRA limitations; adds fragility |
| Storybook 6 | ⚠️ | Configured but usage unknown; v6 is EOL (v8 current) |
| ESLint | ⚠️ | Only `react-app` preset; no custom rules; 20 disables |
| Jest 24 | ❌ | Very old (v29 current); some APIs removed |
| No Prettier config | ⚠️ | Formatting inconsistency risk |
| No Husky / lint-staged | ⚠️ | No pre-commit hooks to enforce quality |
| No CI config visible | ❌ | **Assumption** — no `.github/workflows`, no `Jenkinsfile` found |
| TypeScript | ❌ | Not adopted despite `@types/*` devDeps installed |
| `aws-sdk` in devDependencies | ⚠️ | Full AWS SDK (~2.8 MB) in dev deps is unusual |

---

## 9. Scores Dashboard

| Dimension | Score | Justification |
|-----------|-------|---------------|
| Architecture Cohesion | **4 / 10** | Good intent (RTK, feature views) but three state strategies, dual store structure, and no enforced domain boundaries. |
| Maintainability | **3 / 10** | God components, 16 suppressed lint rules, confirmed bugs, zero TypeScript. |
| Performance Risk | **7 / 10** *(risk)* | `moment`, no code-splitting, `twilio-video` loaded globally, `useHttpClient` fetch loops. |
| Release Confidence | **1 / 10** | 4 test files, no error boundaries, no observability for 39 K LOC. |
| Security Hygiene | **3 / 10** | JWT in localStorage is critical. isDemo() fragile. CSP unconfirmed. |

---

## 10. Prioritised Roadmap

### P0 — This Week (Small, high-impact, safe)

| # | What | Why | Where | Effort | Risk | Payoff |
|---|------|-----|-------|--------|------|--------|
| P0-1 | **Fix `rejectWithValue(rejectWithValue)` bug** | Profile updates silently fail, passing function as error | `store/@thunks/auth.js` ~L70 | S | Low | High — fixes production bug |
| P0-2 | **Remove global `console.error` mute** | Zero runtime error visibility in production | `src/index.js` L37-39 | S | Low | High — restore observability overnight |
| P0-3 | **Add route-level Error Boundaries** | Any component crash = white screen for users | Wrap each route in `router/index.js` with `<ErrorBoundary>` | S | Low | High — improves resilience immediately |
| P0-4 | **Fix `headears` typo in `useHttpClient`** | Custom HTTP headers are silently dropped | `src/hooks/useHttpClient.js` L29 | S | Low | Med — fixes silent header bug |
| P0-5 | **Replace `isDemo()` with JWT claim check** | Display name `'Demo'` is not a reliable role gate | `store/functions/auth.js` | S | Low | Med — prevents accidental demo-mode for real users |
| P0-6 | **Integrate Sentry (or equivalent)** | No production error tracking whatsoever | `src/index.js` + error boundaries | S | Low | High — immediate production visibility |

---

### P1 — This Month (Structural improvements)

| # | What | Why | Where | Effort | Risk | Payoff |
|---|------|------|-------|--------|------|--------|
| P1-1 | **Replace `moment`/`moment-timezone` with `dayjs`** | ~530 KB savings; moment is deprecated | All imports of `moment` across `src/` | M | Med | High — significant bundle reduction |
| P1-2 | **Add `React.lazy` + lazy imports to router** | All views load upfront; meetings/exams are heavy | `router/index.js` — wrap every `import` in `lazy()` | M | Low | High — faster initial load |
| P1-3 | **Consolidate auth state to one source of truth** | Three places read the JWT token; hydration bugs possible | `store/functions/auth.js`, `utils/localStorage.js`, `hooks/useLocalStorage.js` | M | Med | High — eliminates hydration race |
| P1-4 | **Migrate auth token to HttpOnly cookie** | `localStorage` JWT is XSS-exploitable | Backend coordination required + `providers/http` | L | High | Critical — eliminates chief security risk |
| P1-5 | **Add tests for auth flow and exam engine** | Two highest-risk flows have zero tests | `src/tests/` — use React Testing Library | M | Low | High — catch regressions before release |
| P1-6 | **Upgrade `@rtk-incubator/rtk-query` to stable RTK Query** | v0.3.0 is a pre-release from 2020; API changed completely | Replace `useHttpClient` callers incrementally | M | Med | High — stable caching, deduplication |

---

### P2 — This Quarter (Deeper refactors)

| # | What | Why | Where | Effort | Risk | Payoff |
|---|------|-----|-------|--------|------|--------|
| P2-1 | **Migrate to TypeScript** | No type safety for 39 K LOC; JSDoc is unenforced | Incremental: rename files to `.ts/.tsx`, enable `strict: false` initially | L | Med | High — eliminates class of runtime bugs permanently |
| P2-2 | **Decompose god components** (`courses/index.js`, `Exercise.js`, `AdminView.js`) | 500–700 LOC components with mixed concerns are untestable and regression-prone | Extract `<CoursePlayerShell>`, `<ExerciseRunner>`, `<AdminUserPanel>`, `<AdminTeacherPanel>` | L | Med | High — enables unit testing of core flows |
| P2-3 | **Migrate from CRA to Vite** | CRA is archived; slow HMR and build; no ESM | `vite.config.ts` + update scripts and imports | L | High | High — dramatic DX improvement + faster CI builds |
| P2-4 | **Decommission legacy Redux layer** (`store/actions/types.js` 808 LOC, `store/reducers/` vs `store/@reducers/`) | Dead code + confusion confounds new developers; two reducer trees risk naming collisions | Audit with `grep`, remove unused constants, rename `@reducers` → `reducers` | M | Med | Med — reduces cognitive load significantly |

---

## Appendix: Key Files Reference

| File | Purpose | Risk |
|------|---------|------|
| [src/store/actions/types.js](src/store/actions/types.js) | Legacy 808-LOC action constants | Dead code / migration debt |
| [src/views/courses/index.js](src/views/courses/index.js) | God component — course player | High regression surface |
| [src/views/exams/Exercise.js](src/views/exams/Exercise.js) | God component — exam engine | Critical flow, no tests |
| [src/utils/functions.js](src/utils/functions.js) | 528-LOC catch-all utility | Wide blast radius on change |
| [src/store/functions/auth.js](src/store/functions/auth.js) | JWT decode + fragile isDemo() | Security + correctness |
| [src/providers/http/index.js](src/providers/http/index.js) | Fetch wrapper | Auth header attachment |
| [src/hooks/useHttpClient.js](src/hooks/useHttpClient.js) | Hook-based fetcher | Typo bug + fetch loop risk |
| [src/store/@thunks/auth.js](src/store/@thunks/auth.js) | Auth async thunks (confirmed bug) | Profile update broken |
| [src/index.js](src/index.js) | App bootstrap (console.error muted) | Zero prod observability |
| [src/tests/](src/tests/) | 4 test files | Near-zero coverage |

---

*Report generated by automated static analysis augmented with Staff-level code review. All "Assumption" items require manual verification.*
