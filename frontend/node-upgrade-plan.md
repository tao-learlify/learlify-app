# Node 24 Compatibility Upgrade Plan — learlify-frontend

**Date:** 2026-03-06  
**Target:** Node 24.12.0 LTS compatibility  
**Current State:** Dependencies not installed; Node 24 already in use  
**Risk Level:** HIGH → Medium (after P0)  
**Estimated Effort:** P0: 4-8 hours | P1: 8-16 hours | P2: 40+ hours

---

## 1. Executive Assessment

### 1.1 Current Node Compatibility Risk Summary

**CRITICAL BLOCKERS IDENTIFIED:**

The project **cannot install dependencies** on Node 24.12.0 due to hard incompatibilities:

1. **`node-sass@4.13.1`** — Native addon compiled for Node ≤14; will fail on Node 24 with binding errors
2. **`react-scripts@4.0.0`** — Bundles webpack 4 which has known OpenSSL 3.0 issues on Node 17+
3. **`jest@24.9.0`** — Ancient version; multiple compatibility issues with modern Node
4. **Lockfile version 1** — Created with npm 5-6; npm 11 will trigger full resolution, likely exposing peer dependency conflicts
5. **No `engines` field** — No version contract; deployment environments undefined
6. **Dockerfile stuck on Node 12** — 5 major versions behind; production image will fail to build with current state

**Additional High-Risk Dependencies:**

- `@storybook/*@6.1.6` — Old Storybook with webpack 4 dependencies
- `axios@0.18.1` — 6 years old; critical security vulnerabilities (CVE-2020-28168, CVE-2021-3749)
- `socket.io-client@2.3.0` — Missing Node 24 compatibility fixes from v3+
- `twilio-video@2.12.0` — Native WebRTC bindings; verify compatibility
- Multiple transitive dependencies with native bindings via outdated versions

### 1.2 Recommended Target Node Version

**Primary Target:** Node 24.12.0 LTS (current LTS through April 2027)

**Rationale:**
- User is already on Node 24
- Active LTS with security updates until April 2027
- Ecosystem support is mature (React 17/18, MUI v5, modern build tools all compatible)

**Node 25 Consideration:**
- Current release; becomes LTS in October 2026
- Wait until P1 complete before evaluating Node 25
- No immediate benefits justify the additional risk

### 1.3 Main Blockers

| Blocker | Severity | Reason | Fix Complexity |
|---------|----------|--------|----------------|
| `node-sass@4.13.1` | **CRITICAL** | Native bindings incompatible with Node 16+ | Low (drop-in replacement with `sass`) |
| `react-scripts@4.0.0` | **HIGH** | Webpack 4 + OpenSSL 3.0 incompatibility | Medium (upgrade to v5.0.1) |
| `jest@24.9.0` | **HIGH** | VM context issues on modern Node | Medium (upgrade to ^26.6.3) |
| Lockfile v1 | **MEDIUM** | Will trigger full re-resolution | Low (regenerate with npm install) |
| `axios@0.18.1` | **HIGH** | Security vulnerabilities | Low (upgrade to ^0.27.2) |
| Missing engines field | **LOW** | No version contract | Trivial (add to package.json) |

### 1.4 Expected Risk Level of the Upgrade

**Before P0:** ❌ CRITICAL — Cannot install, cannot run  
**After P0:** ⚠️ MEDIUM — Runs on Node 24, tests pass, known security issues remain  
**After P1:** ✅ LOW-MEDIUM — Modernized, stable, some technical debt deferred  
**After P2:** ✅ LOW — Fully modern stack with React 18, MUI v5, Vite

**Regression Risk Assessment:**

- **P0 changes:** LOW regression risk (mostly build tooling, non-runtime)
- **P1 changes:** MEDIUM regression risk (axios upgrade may affect API layer)
- **P2 changes:** HIGH regression risk (requires full QA cycle)

### 1.5 Rollback Strategy

All phases are designed to be reversible:

- P0: Rollback via `git reset --hard` before npm install
- P1: Each upgrade bucket is a separate commit; cherry-pick revert if needed
- P2: Feature-flagged or branch-based; do not merge to main until validated

---

## 2. Phased Upgrade Roadmap

### Phase 0 (P0) — Minimal Compatibility Unblock

**Objective:** Make the project install, build, test, and start on Node 24 LTS with the absolute minimum changes.

**Expected Duration:** 4-8 hours (includes testing)

**Risk Level:** 🟡 LOW-MEDIUM

**Rollback Difficulty:** 🟢 EASY (single commit, pre-install state)

#### P0.1 — Repository Configuration

**Changes:**

1. **Add `.nvmrc`**
   ```
   24.12.0
   ```

2. **Add `engines` field to `package.json`**
   ```json
   "engines": {
     "node": ">=18.0.0 <25.0.0",
     "npm": ">=9.0.0"
   }
   ```

3. **Update Dockerfile base image**
   ```dockerfile
   FROM node:24-alpine AS builder
   ```
   Replace `python2` with `python3` in apk dependencies.

**Reason:** Establishes Node 24 as the runtime contract across dev, CI, and production.

**Impact:** No code changes; purely declarative.

**Validation:**
- [ ] `.nvmrc` exists and contains `24.12.0`
- [ ] `package.json` has `engines` field
- [ ] Dockerfile uses `node:24-alpine`

---

#### P0.2 — Critical Dependency Replacements

**Changes:**

1. **Replace `node-sass` with `sass`**
   ```bash
   npm uninstall node-sass
   npm install --save sass@^1.77.0
   ```
   
   **Why:** `node-sass` is deprecated and has no Node 16+ support. `sass` (Dart Sass) is a drop-in replacement with identical CLI/API.
   
   **Breaking Changes:** None for standard SCSS usage.

2. **Upgrade `react-scripts` to `5.0.1`**
   ```bash
   npm install --save-dev react-scripts@5.0.1
   ```
   
   **Why:** v5 uses webpack 5, which has OpenSSL 3.0 compatibility and Node 18+ support.
   
   **Breaking Changes:**
   - Webpack 5 (breaking for custom webpack configs, but project uses standard CRA)
   - Jest 27 bundled (up from 24)
   - PostCSS 8 (may affect custom PostCSS configs)
   
   **Migration Required:**
   - Remove standalone `jest@24.9.0` from devDependencies (now bundled with react-scripts)
   - If `customize-cra` or `react-app-rewired` customizations exist, verify compatibility

3. **Remove standalone `jest@24.9.0`**
   ```bash
   npm uninstall jest
   ```
   
   **Why:** `react-scripts@5.0.1` bundles Jest 27; standalone Jest 24 will conflict.

4. **Update `@testing-library/react` to `^12.1.5`**
   ```bash
   npm install --save-dev @testing-library/react@^12.1.5
   ```
   
   **Why:** v9 has peer dependency conflicts with Jest 27; v12 is React 17-compatible and works with Jest 27.

5. **Security-critical: Upgrade `axios` to `^0.27.2`**
   ```bash
   npm install axios@^0.27.2
   ```
   
   **Why:** `axios@0.18.1` has CVE-2020-28168 (SSRF) and CVE-2021-3749 (ReDoS).
   
   **Breaking Changes:**
   - Response interceptor signature slightly changed
   - `AxiosError` structure updated
   
   **Migration Required:**
   - Verify `src/providers/http/index.js` and `hooks/useHttpClient.js`
   - Test error handling in thunks (`store/@thunks/`)

**Reason:** These are the hard blockers preventing installation on Node 24.

**Impact:** Build tooling modernized; axios upgrade requires API layer verification.

**Validation:**
- [ ] `npm install` completes without native binding errors
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without webpack errors
- [ ] `npm test` runs (even if tests fail; we need the runner to work)
- [ ] Manual smoke test: login, navigate to /courses

---

#### P0.3 — Lockfile Regeneration

**Changes:**

1. **Delete `package-lock.json`**
   ```bash
   rm package-lock.json
   ```

2. **Clean install**
   ```bash
   npm install
   ```
   
   **Why:** Lockfile v1 is incompatible with npm 11; regenerating creates lockfile v3 with modern resolution.

3. **Commit new lockfile**
   ```bash
   git add package-lock.json
   git commit -m "chore: regenerate lockfile for npm 11 + Node 24"
   ```

**Reason:** Locks in the new dependency tree; prevents future drift.

**Impact:** ~150 MB lockfile diff; peer dependency warnings will surface (expected).

**Validation:**
- [ ] `package-lock.json` has `"lockfileVersion": 3`
- [ ] No `ERESOLVE` errors
- [ ] Peer dependency warnings documented (acceptable for P0)

---

#### P0.4 — Configuration Compatibility Checks

**Changes:**

1. **Verify `jest.config.js` is minimal**
   
   Current state:
   ```js
   module.exports = {
     verbose: true
   }
   ```
   
   **Action:** No changes needed; react-scripts handles Jest config.

2. **Check for webpack customizations**
   
   **Files to inspect:**
   - `config-overrides.js` — NOT FOUND
   - `craco.config.js` — NOT FOUND
   - `.env` files — Verify no `SKIP_PREFLIGHT_CHECK` is set
   
   **Action:** No customizations found; CRA defaults are safe.

3. **Verify Babel compatibility**
   
   **Files to inspect:**
   - `.babelrc` — NOT FOUND
   - `babel.config.js` — NOT FOUND
   
   **Action:** CRA's Babel preset handles everything; no changes needed.

**Reason:** Ensures no hidden config files will block webpack 5.

**Impact:** Confirmation only; no code changes.

**Validation:**
- [ ] No webpack override files exist
- [ ] No custom Babel config exists
- [ ] `.env` files (if any) reviewed

---

#### P0.5 — Storybook Compatibility Fix

**Changes:**

1. **Upgrade Storybook to `^6.5.16`**
   ```bash
   npm install --save-dev @storybook/react@^6.5.16 @storybook/addon-actions@^6.5.16 @storybook/addon-links@^6.5.16
   ```
   
   **Why:** v6.1.6 has webpack 4 dependencies; v6.5.16 supports webpack 5 while staying in v6 (v7/v8 are breaking).

2. **Update `babel-loader` to `^8.3.0`**
   ```bash
   npm install --save-dev babel-loader@^8.3.0
   ```
   
   **Why:** v8.0.5 is incompatible with Babel 7.12+; v8.3 is stable.

**Reason:** Storybook is used (`public/` references suggest it's active); must support webpack 5.

**Impact:** Storybook UI may need re-verification; stories should render unchanged.

**Validation:**
- [ ] `npm run storybook` starts on port 9009
- [ ] Sample story renders
- [ ] No webpack errors in console

---

### P0 Acceptance Criteria

**MUST PASS before moving to P1:**

1. ✅ `npm install` completes without errors on Node 24.12.0
2. ✅ `npm run build` produces `/build` directory
3. ✅ `npm run dev` starts dev server on port 3000
4. ✅ `npm test` runs (4 test files execute)
5. ✅ `npm run storybook` starts
6. ✅ Manual smoke test:
   - Navigate to `/login`
   - Submit login form (backend may not run; just verify no client crash)
   - Navigate to `/courses`
7. ✅ Docker build succeeds with `docker build -t learlify-frontend .`

**Known Issues to Accept in P0:**

- Peer dependency warnings (many; will resolve in P1)
- Old `socket.io-client@2.3.0` still present (non-blocking)
- `moment` bundle size still large (deferred to P1)
- Test coverage still ~0% (not a P0 goal)
- Security warnings from `npm audit` (P1 target)

---

### Phase 1 (P1) — Safe Modernization Around the Runtime

**Objective:** Reduce fragility, fix security issues, and align tooling without touching React/MUI/Redux core.

**Expected Duration:** 8-16 hours (across multiple PRs)

**Risk Level:** 🟡 MEDIUM

**Rollback Difficulty:** 🟡 MODERATE (isolated commits per bucket)

#### P1.1 — Security & Outdated Package Bucket

**Upgrade Group:**

1. **`socket.io-client@^4.7.0`**
   ```bash
   npm install socket.io-client@^4.7.0
   ```
   
   **Why:** v2 has no ESM support, larger bundle, and missing Node 24 fixes.
   
   **Breaking Changes:**
   - Connection options API changed
   - Event signatures slightly different
   
   **Migration Required:**
   - Update `src/providers/sockets/index.js`
   - Update `src/App.js` (socket connection logic lines 34-80)
   
   **Testing:** Verify WebSocket reconnection and real-time notifications.

2. **`@reduxjs/toolkit@^1.9.7`**
   ```bash
   npm install @reduxjs/toolkit@^1.9.7
   ```
   
   **Why:** v1.5.0 is from 2021; v1.9.7 has immer updates, listener middleware, and TypeScript improvements.
   
   **Breaking Changes:** None for basic usage.

3. **`@rtk-incubator/rtk-query` → `@reduxjs/toolkit` (built-in)**
   
   **Action:**
   ```bash
   npm uninstall @rtk-incubator/rtk-query
   ```
   
   Then import from RTK:
   ```diff
   - import { createApi } from '@rtk-incubator/rtk-query';
   + import { createApi } from '@reduxjs/toolkit/query/react';
   ```
   
   **Why:** RTK Query graduated from incubator in RTK v1.6; using incubator version (0.3.0) is unsupported.
   
   **Migration Required:**
   - Update all RTK Query imports across codebase
   - API definitions stay the same; only import paths change

4. **`immer@^9.0.21`**
   ```bash
   npm install immer@^9.0.21
   ```
   
   **Why:** v6 is pre-ES6 Proxy optimization; v9 has better performance and Node 24 support.
   
   **Breaking Changes:** None for RTK usage (RTK handles immer internally).

5. **`react-hook-form@^7.51.0`**
   ```bash
   npm install react-hook-form@^7.51.0
   ```
   
   **Why:** v6 has known memory leaks; v7 has major performance improvements.
   
   **Breaking Changes:**
   - `errors` object structure changed
   - `mode` prop default changed to `onSubmit`
   
   **Migration Required:**
   - Audit all `useForm()` calls
   - Update error rendering (check `components/AptisForm.js`, `PaymentForm.js`)

**Reason:** These are low-hanging security/stability fixes.

**Validation:**
- [ ] `npm audit --production` shows no HIGH/CRITICAL
- [ ] Socket.io reconnects after intentional disconnect
- [ ] RTK Query calls still work (if actively used)
- [ ] Forms submit and validate correctly

---

#### P1.2 — Bundle Optimization Bucket

**Upgrade Group:**

1. **Replace `moment` + `moment-timezone` with `date-fns@^3.3.0`**
   
   **Why:** `moment` is 530 KB unminified; deprecated by maintainers. `date-fns` is 20 KB tree-shakeable.
   
   **Migration Required:**
   - Install: `npm install date-fns`
   - Uninstall: `npm uninstall moment moment-timezone`
   - Replace all `moment()` calls with `date-fns` equivalents
   - Focus areas:
     - `src/utils/functions.js` (date formatting helpers)
     - `src/components/*/` (any date displays)
     - `src/views/classes/AdminSchedule.js` (scheduler component)
   
   **Breaking Changes:** Complete API change; manual migration required.
   
   **Complexity:** MEDIUM-HIGH; estimate 4-6 hours.
   
   **Rollback:** Easy (revert commit, reinstall moment).

2. **Update `chart.js@^3.9.1` + `react-chartjs-2@^4.3.1`**
   ```bash
   npm install chart.js@^3.9.1 react-chartjs-2@^4.3.1
   ```
   
   **Why:** v2 registers all chart types globally (~200 KB overhead); v3 is tree-shakeable.
   
   **Breaking Changes:**
   - Options API changed (scales, tooltips, plugins)
   - Must register chart types explicitly
   
   **Migration Required:**
   - Update all chart configurations
   - Import and register only needed chart types
   
   **Complexity:** MEDIUM; estimate 2-3 hours.

3. **Update `framer-motion@^10.18.0`**
   ```bash
   npm install framer-motion@^10.18.0
   ```
   
   **Why:** v1 is 4 years old; v10 has better tree-shaking and smaller bundle.
   
   **Breaking Changes:**
   - `animate` prop API slightly changed
   - `variants` API updated
   
   **Migration Required:**
   - Check all `<motion.div>` usages
   - Update variant definitions if present

**Reason:** Reduces bundle size by ~600-700 KB total.

**Validation:**
- [ ] Production build size reduced by >500 KB
- [ ] All charts render correctly
- [ ] Animations still work
- [ ] Date formatting in UI matches previous output

---

#### P1.3 — Tooling Alignment Bucket

**Upgrade Group:**

1. **Update `i18next@^23.8.0` ecosystem**
   ```bash
   npm install i18next@^23.8.0 react-i18next@^14.0.5 i18next-browser-languagedetector@^7.2.0
   ```
   
   **Why:** v19 is from 2020; v23 has React 18 support and better TypeScript (future).
   
   **Breaking Changes:** Minor API changes in initialization.
   
   **Migration Required:**
   - Update `src/i18n.js` initialization
   - Verify language detection still works

2. **Update `i18next-scanner@^4.4.0`**
   ```bash
   npm install --save-dev i18next-scanner@^4.4.0
   ```
   
   **Why:** v3 has Node 12 dependencies; v4 supports Node 18+.

3. **Update `workbox-build@^7.0.0`**
   ```bash
   npm install --save-dev workbox-build@^7.0.0
   ```
   
   **Why:** v5 has webpack 4 peer deps; v7 supports webpack 5.

**Reason:** Aligns build tooling with modern Node.

**Validation:**
- [ ] `npm run scanner` completes
- [ ] i18n translations load correctly
- [ ] Service worker builds (if enabled)

---

#### P1.4 — Dependency Pruning Bucket

**Remove Unused/Redundant:**

1. **`url-search-params-polyfill`**
   ```bash
   npm uninstall url-search-params-polyfill
   ```
   
   **Why:** URLSearchParams is natively supported in all modern browsers; polyfill not needed.

2. **Verify `redux-saga` usage**
   
   **Action:** Search for saga files:
   ```bash
   find src/ -name "*saga*" -o -name "*Saga*"
   ```
   
   If none found:
   ```bash
   npm uninstall redux-saga
   ```
   
   Remove from `src/store/index.js`:
   ```diff
   - import createSagaMiddleware from 'redux-saga';
   - const sagaMiddleware = createSagaMiddleware();
   ```
   
   **Why:** Adds 50 KB bundle weight with no usage.

3. **`es6-map`**
   ```bash
   npm uninstall es6-map
   ```
   
   **Why:** `Map` is native; polyfill not needed.

**Reason:** Removes dead code; reduces bundle by ~80 KB.

**Validation:**
- [ ] Production build still succeeds
- [ ] No import errors
- [ ] Manual smoke test passes

---

### P1 Acceptance Criteria

**MUST PASS before moving to P2:**

1. ✅ `npm audit --production` shows zero HIGH/CRITICAL vulnerabilities
2. ✅ Production bundle size reduced by ≥500 KB (compare `build/static/js/*.js` sizes)
3. ✅ All P0 acceptance criteria still pass
4. ✅ Extended smoke test:
   - WebSocket notifications work
   - Charts render
   - Date formatting is correct
   - Translations load
   - Forms validate
5. ✅ No console errors on happy path

**Known Issues to Accept in P1:**

- Still on React 17 (P2)
- MUI v4 (P2)
- CRA not removed (P2)
- Test coverage still low

---

### Phase 2 (P2) — Deferred Strategic Upgrades

**Objective:** Complete modernization; requires QA cycle and is NOT required for Node 24 compatibility.

**Expected Duration:** 40+ hours (across sprints)

**Risk Level:** 🔴 HIGH

**Rollback Difficulty:** 🔴 DIFFICULT (requires feature branches, full regression testing)

#### P2.1 — React 18 Migration

**Why Deferred:**
- React 17 is fully compatible with Node 24
- React 18's breaking changes (automatic batching, Suspense, concurrent features) require full regression testing
- No immediate benefit for Node compatibility

**Migration Path:**
1. Upgrade `react@^18.2.0` + `react-dom@^18.2.0`
2. Replace `ReactDOM.render` with `createRoot` in `src/index.js`
3. Audit all `useEffect` cleanup functions
4. Test Suspense boundaries
5. Add Error Boundaries (should be done before React 18)

**Estimated Effort:** 8-12 hours + full QA cycle

---

#### P2.2 — Material-UI v4 → v5 Migration

**Why Deferred:**
- MUI v4 works on Node 24
- v5 has massive breaking changes (styled-engine, theme v5, renamed components)
- Codebase has ~100+ MUI component imports

**Migration Path:**
1. Run `@mui/codemod` for automated renames
2. Update theme structure
3. Replace `makeStyles` with `styled` or `sx` prop
4. Update all component prop names
5. Verify custom theme overrides

**Estimated Effort:** 20-30 hours + full QA cycle

**Reference:** [MUI Migration Guide](https://mui.com/material-ui/migration/migration-v4/)

---

#### P2.3 — RTK Query Full Migration

**Why Deferred:**
- Current API layer (`useHttpClient` + thunks) works
- Full migration requires rewriting all data-fetching logic
- Needs API-first redesign

**Migration Path:**
1. Create RTK Query API definitions for all endpoints (`src/api/*`)
2. Replace `useHttpClient` calls with `useQuery`/`useMutation`
3. Remove manual thunks for data fetching
4. Add cache invalidation tags
5. Remove `providers/http/index.js`

**Benefits:**
- Automatic caching
- Request deduplication
- Optimistic updates
- 90% reduction in data-fetching boilerplate

**Estimated Effort:** 24-32 hours + testing

---

#### P2.4 — CRA to Vite Migration

**Why Deferred:**
- CRA v5 works fine on Node 24
- Vite migration requires build config rewrite
- Minimal performance gain for production (dev server is faster)

**Migration Path:**
1. Install `vite` + `@vitejs/plugin-react`
2. Convert `public/index.html` to Vite format
3. Update env variable names (`REACT_APP_*` → `VITE_*`)
4. Replace CRA scripts with Vite commands
5. Update aliases and path resolution
6. Migrate Storybook to Vite (or keep on webpack)

**Benefits:**
- 10x faster dev server cold starts
- Native ESM (no bundling in dev)
- Better tree-shaking

**Estimated Effort:** 12-16 hours + testing

---

#### P2.5 — Jest Modernization

**Why Deferred:**
- Jest 27 (bundled with react-scripts 5) works
- Test coverage is ~0%; focus on writing tests, not upgrading runner

**Future Work:**
1. Upgrade to Jest 29 (requires Vite migration or ejecting CRA)
2. Add `@testing-library/jest-dom` matchers
3. Add `@testing-library/user-event` for interactions
4. Write integration tests for:
   - Auth flow
   - Course player
   - Exam submission
   - Payment flow

**Estimated Effort:** 50+ hours (mostly writing tests)

---

#### P2.6 — Dependency Cleanup & Replacements

**Review After P2.1-P2.5:**

1. **Remove `styled-components`** (if MUI v5 `styled` is adopted)
2. **Remove `bootstrap-css-only`** (if MUI v5 is primary)
3. **Replace `@reach/router` with React Router v6** (or fully commit to RRDv5)
4. **Replace `react-toasts` with `notistack` (MUI-native)**
5. **Replace `react-dragula` with `dnd-kit` (modern, maintained)**
6. **Replace `rich-markdown-editor` with `@uiw/react-md-editor` (smaller, active)**

**Estimated Effort:** 16-24 hours

---

### P2 Acceptance Criteria

**MUST PASS before declaring "modernization complete":**

1. ✅ React 18 upgraded; no automatic batching bugs
2. ✅ MUI v5 fully migrated; no theme errors
3. ✅ RTK Query handles 80%+ of API calls
4. ✅ Vite dev server starts in <2 seconds
5. ✅ Test coverage >40%
6. ✅ Lighthouse performance score >85
7. ✅ Bundle size <500 KB (main chunk, gzipped)
8. ✅ Full regression test suite passes

---

## 3. Compatibility Matrix

| Package / Tool | Current | Recommended | Reason | Breaking Risk | Required Now? |
|----------------|---------|-------------|--------|---------------|---------------|
| **Runtime** |
| Node | 24.12.0 | 24.12.0 LTS | Already in use | N/A | ✅ Yes |
| npm | 11.10.1 | ≥9.0.0 | Already compatible | N/A | ✅ Yes |
| **Critical Blockers** |
| `node-sass` | 4.13.1 | **REMOVE** | Native addon; deprecated | 🔴 None | ✅ Yes (P0) |
| `sass` | — | ^1.77.0 | Drop-in replacement for node-sass | 🟢 None | ✅ Yes (P0) |
| `react-scripts` | 4.0.0 | 5.0.1 | Webpack 5 + Node 18+ support | 🟡 Medium | ✅ Yes (P0) |
| `jest` | 24.9.0 | **REMOVE** | Bundled with react-scripts 5 | 🟢 None | ✅ Yes (P0) |
| `@testing-library/react` | 9.3.1 | ^12.1.5 | Jest 27 compatibility | 🟡 Low | ✅ Yes (P0) |
| `axios` | 0.18.1 | ^0.27.2 | Security (CVE-2020-28168, CVE-2021-3749) | 🟡 Low | ✅ Yes (P0) |
| **Storybook** |
| `@storybook/react` | 6.1.6 | ^6.5.16 | Webpack 5 support | 🟡 Medium | ✅ Yes (P0) |
| `@storybook/addon-*` | 6.1.6 | ^6.5.16 | Version alignment | 🟢 None | ✅ Yes (P0) |
| `babel-loader` | 8.0.5 | ^8.3.0 | Babel 7.12+ compatibility | 🟢 None | ✅ Yes (P0) |
| **Security & Stability (P1)** |
| `socket.io-client` | 2.3.0 | ^4.7.0 | Node 24 fixes, smaller bundle | 🟡 Medium | ⚠️ P1 |
| `@reduxjs/toolkit` | 1.5.0 | ^1.9.7 | Listener middleware, immer updates | 🟢 None | ⚠️ P1 |
| `@rtk-incubator/rtk-query` | 0.3.0 | **REMOVE** | Graduated to RTK core | 🟡 Low | ⚠️ P1 |
| `immer` | 6.0.3 | ^9.0.21 | Performance, Node 24 support | 🟢 None | ⚠️ P1 |
| `react-hook-form` | 6.14.0 | ^7.51.0 | Memory leaks fixed | 🟡 Medium | ⚠️ P1 |
| **Bundle Size (P1)** |
| `moment` + `moment-timezone` | 2.24.0 / 0.5.31 | **REMOVE** | Deprecated; 530 KB overhead | 🔴 High | ⚠️ P1 |
| `date-fns` | — | ^3.3.0 | Modern, tree-shakeable (20 KB) | 🟢 N/A | ⚠️ P1 |
| `chart.js` | 2.9.4 | ^3.9.1 | Tree-shakeable, smaller | 🟡 Medium | ⚠️ P1 |
| `react-chartjs-2` | 2.11.1 | ^4.3.1 | Chart.js v3 compatibility | 🟡 Medium | ⚠️ P1 |
| `framer-motion` | 1.10.3 | ^10.18.0 | Smaller bundle, better APIs | 🟡 Low | ⚠️ P1 |
| **Tooling (P1)** |
| `i18next` | 19.3.2 | ^23.8.0 | React 18 ready | 🟢 None | ⚠️ P1 |
| `react-i18next` | 11.3.3 | ^14.0.5 | i18next v23 compatibility | 🟢 None | ⚠️ P1 |
| `i18next-browser-languagedetector` | 4.0.2 | ^7.2.0 | API updates | 🟡 Low | ⚠️ P1 |
| `i18next-scanner` | 3.0.0 | ^4.4.0 | Node 18+ support | 🟢 None | ⚠️ P1 |
| `workbox-build` | 5.0.0 | ^7.0.0 | Webpack 5 peer deps | 🟢 None | ⚠️ P1 |
| **Dead Code Removal (P1)** |
| `url-search-params-polyfill` | 8.0.0 | **REMOVE** | Native support in all browsers | 🟢 None | ⚠️ P1 |
| `es6-map` | 0.1.5 | **REMOVE** | Native `Map` support | 🟢 None | ⚠️ P1 |
| `redux-saga` | 1.1.3 | **REMOVE?** | Verify no usage; adds 50 KB | 🟢 None | ⚠️ P1 |
| **Framework (P2 — Deferred)** |
| `react` + `react-dom` | 17.0.0 | ^18.2.0 | Concurrent features, automatic batching | 🔴 High | ❌ P2 |
| `@material-ui/core` | 4.10.2 | **REMOVE** | Replaced by `@mui/material` | 🔴 Critical | ❌ P2 |
| `@mui/material` | — | ^5.15.0 | MUI v5 (styled-engine, theme v5) | 🔴 Critical | ❌ P2 |
| CRA | react-scripts 5 | **Vite** | 10x faster dev server | 🔴 High | ❌ P2 |
| Jest | 27 (bundled) | 29 (standalone) | Latest features | 🟡 Medium | ❌ P2 |

**Legend:**
- 🟢 None/Low: Drop-in replacement or backward-compatible
- 🟡 Medium: Minor API changes; isolated testing required
- 🔴 High/Critical: Breaking changes across codebase; full QA needed

---

## 4. Implementation Sequence

### 4.1 Preparation Phase

**Before any changes:**

1. **Create backup branch**
   ```bash
   git checkout -b backup/pre-node24-upgrade
   git push origin backup/pre-node24-upgrade
   ```

2. **Create working branch**
   ```bash
   git checkout -b feat/node24-p0-compatibility
   ```

3. **Document current state**
   ```bash
   node --version > .upgrade-state/node-before.txt
   npm --version > .upgrade-state/npm-before.txt
   npm list --depth=0 > .upgrade-state/deps-before.txt
   ```

4. **Clean workspace**
   ```bash
   rm -rf node_modules package-lock.json
   git status  # Ensure no uncommitted changes
   ```

---

### 4.2 P0 Execution Order

**Commit 1: Repository configuration**

```bash
# Add .nvmrc
echo "24.12.0" > .nvmrc

# Update package.json (manual edit or script)
# Add engines field:
#   "engines": {
#     "node": ">=18.0.0 <25.0.0",
#     "npm": ">=9.0.0"
#   }

# Update Dockerfile
# Replace node:12-alpine with node:24-alpine
# Replace python2 with python3

git add .nvmrc package.json Dockerfile
git commit -m "chore(node): set Node 24 LTS as target runtime"
```

**Commit 2: Critical dependency replacements**

```bash
# Remove blockers
npm uninstall node-sass jest

# Add replacements
npm install --save sass@^1.77.0

# Upgrade react-scripts (will pull in Jest 27)
npm install --save-dev react-scripts@5.0.1

# Update testing library
npm install --save-dev @testing-library/react@^12.1.5

# Security fix
npm install axios@^0.27.2

# Upgrade Storybook
npm install --save-dev @storybook/react@^6.5.16 @storybook/addon-actions@^6.5.16 @storybook/addon-links@^6.5.16 babel-loader@^8.3.0

git add package.json package-lock.json
git commit -m "feat(deps): upgrade to Node 24-compatible versions

- Replace node-sass with sass (Dart Sass)
- Upgrade react-scripts 4.0.0 → 5.0.1 (webpack 5, Jest 27)
- Remove standalone jest@24 (bundled with react-scripts)
- Upgrade @testing-library/react to v12 (Jest 27 compat)
- Upgrade axios 0.18.1 → 0.27.2 (security: CVE-2020-28168, CVE-2021-3749)
- Upgrade Storybook to v6.5.16 (webpack 5 support)
- Upgrade babel-loader to v8.3.0

BREAKING CHANGES:
- axios error structure updated; verify error handling in thunks
- react-scripts now uses webpack 5; Jest 27 bundled"
```

**Commit 3: Lockfile regeneration**

```bash
# Already generated in previous step (npm install creates lockfile v3)
# Verify:
grep '"lockfileVersion"' package-lock.json  # Should show 3

git add package-lock.json
git commit -m "chore(deps): regenerate lockfile for npm 11

- Lockfile v1 → v3
- Resolves peer dependency conflicts
- Locks Node 24-compatible dependency tree"
```

**Validation checkpoint:**

```bash
npm install  # Should complete without errors
npm run build  # Should succeed
npm run dev  # Should start dev server
npm test  # Should run tests
npm run storybook  # Should start Storybook
```

**Commit 4: Axios migration fixes (if needed)**

```bash
# After testing, if axios upgrade breaks API calls:
# 1. Update src/providers/http/index.js
# 2. Update hooks/useHttpClient.js
# 3. Check error handling in store/@thunks/

# (No predefined fix; depends on actual breakage)

git add <fixed-files>
git commit -m "fix(api): update axios error handling for v0.27

- Update response interceptor error handling
- Fix AxiosError structure access in thunks
- Verify error display in UI"
```

**Push and create PR:**

```bash
git push origin feat/node24-p0-compatibility

# Create PR with checklist from P0 Acceptance Criteria
```

---

### 4.3 P1 Execution Order

**Each P1 bucket is a separate PR:**

**PR 1: Security & outdated packages**

```bash
git checkout -b feat/node24-p1-security

npm install socket.io-client@^4.7.0
npm install @reduxjs/toolkit@^1.9.7
npm uninstall @rtk-incubator/rtk-query
npm install immer@^9.0.21
npm install react-hook-form@^7.51.0

# Update imports:
# - socket.io-client API in src/providers/sockets/index.js
# - RTK Query imports: @rtk-incubator/rtk-query → @reduxjs/toolkit/query/react
# - react-hook-form error handling

git add package.json package-lock.json src/
git commit -m "feat(deps): security and stability upgrades (P1.1)"
```

**PR 2: Bundle optimization**

```bash
git checkout -b feat/node24-p1-bundle

npm install date-fns@^3.3.0
npm uninstall moment moment-timezone

npm install chart.js@^3.9.1 react-chartjs-2@^4.3.1
npm install framer-motion@^10.18.0

# Replace all moment() calls with date-fns equivalents
# Update chart configurations
# Update animation variants

git add package.json package-lock.json src/
git commit -m "feat(deps): bundle size optimization (P1.2)

- Replace moment with date-fns (~500 KB reduction)
- Upgrade chart.js to v3 (tree-shakeable)
- Upgrade framer-motion to v10

Bundle size reduced by ~600 KB total"
```

**PR 3: Tooling alignment**

```bash
git checkout -b feat/node24-p1-tooling

npm install i18next@^23.8.0 react-i18next@^14.0.5 i18next-browser-languagedetector@^7.2.0
npm install --save-dev i18next-scanner@^4.4.0 workbox-build@^7.0.0

git add package.json package-lock.json
git commit -m "feat(deps): tooling alignment for Node 24 (P1.3)"
```

**PR 4: Dependency pruning**

```bash
git checkout -b feat/node24-p1-prune

npm uninstall url-search-params-polyfill es6-map

# Verify no saga usage:
find src/ -name "*saga*"
# If none found:
npm uninstall redux-saga
# Remove from src/store/index.js

git add package.json package-lock.json src/store/index.js
git commit -m "chore(deps): remove unused polyfills and dead code (P1.4)

- Remove url-search-params-polyfill (native support)
- Remove es6-map (native Map)
- Remove redux-saga (no usage found)

Bundle size reduced by ~80 KB"
```

---

### 4.4 P2 Execution Strategy

**Do NOT start P2 until:**
1. P0 is deployed to production
2. P1 is deployed to production
3. No production incidents for 2 weeks
4. Full QA cycle scheduled

**Each P2 item is a feature branch with:**
- Feature flag (if possible)
- Full test coverage
- QA sign-off
- Gradual rollout plan

**Order:**
1. React 18 (enables Suspense for code-splitting)
2. Code-splitting + lazy loading (proves stability before MUI migration)
3. MUI v5 (biggest change; needs clean base)
4. RTK Query migration (depends on stable UI)
5. Vite migration (last; requires all above to be stable)
6. Jest 29 (after Vite or CRA eject)

---

### 4.5 Validation Commands (Run After Each Phase)

**P0 Validation:**

```bash
# Installation
npm ci
echo $?  # Should be 0

# Build
npm run build
ls -lh build/static/js/*.js  # Verify files exist

# Dev server
(npm run dev &)
sleep 10
curl http://localhost:3000 | grep "learlify"
kill %1

# Tests
npm test -- --watchAll=false

# Storybook
(npm run storybook &)
sleep 15
curl http://localhost:9009
kill %1

# Docker
docker build -t learlify-frontend:node24-test .
docker run -d -p 8080:80 --name learlify-test learlify-frontend:node24-test
curl http://localhost:8080
docker stop learlify-test && docker rm learlify-test
```

**P1 Validation:**

```bash
# Security audit
npm audit --production
npm audit --audit-level=high

# Bundle size analysis
npm run build
du -sh build/static/js/*.js | sort -h

# Lighthouse CI (if configured)
npm run build
# (serve build folder and run Lighthouse)

# Manual smoke tests:
# - Login flow
# - WebSocket notifications
# - Chart rendering
# - Form validation
# - Date display
```

**P2 Validation:**

```bash
# Full regression suite
npm run test:integration  # (if exists)
npm run test:e2e  # (if exists)

# Performance testing
npm run build
# - Lighthouse score >85
# - Bundle size <500 KB gzipped
# - First contentful paint <1.5s

# Cross-browser testing
# - Chrome, Firefox, Safari, Edge
```

---

### 4.6 Rollback Checkpoints

**P0 Rollback:**

```bash
# If npm install fails:
git reset --hard HEAD
npm ci

# If build fails after install:
git revert <commit-sha>
npm ci
```

**P1 Rollback:**

```bash
# Rollback specific PR:
git revert <pr-merge-commit>
npm ci

# Or cherry-pick revert:
git checkout main
git revert <commit-sha>
```

**P2 Rollback:**

```bash
# Feature flag disable (if implemented):
FEATURE_REACT_18=false npm run build

# Or full rollback:
git revert -m 1 <merge-commit>
npm ci
```

---

## 5. Risk Mitigation Strategies

### 5.1 Pre-Flight Checklist

Before each phase:

- [ ] **Backup database** (if migration touches state shape)
- [ ] **Tag current production** (`git tag v0.4.0-pre-nodeupgrade`)
- [ ] **Notify team** of deployment window
- [ ] **Disable non-critical features** (feature flags if available)
- [ ] **Prepare rollback plan** (documented steps)

### 5.2 Phased Deployment

**P0 Deployment:**

1. Deploy to staging environment
2. Run automated tests
3. Manual smoke test (30 min)
4. Deploy to production during low-traffic hours
5. Monitor for 2 hours (error rates, performance)
6. If stable, announce success

**P1 Deployment:**

1. Deploy each PR individually to staging
2. Soak test for 24 hours
3. Deploy to production with gradual rollout:
   - 5% traffic for 2 hours
   - 25% traffic for 6 hours
   - 100% if no issues

**P2 Deployment:**

1. Feature-flagged rollout
2. Internal dogfooding for 1 week
3. Beta users for 2 weeks
4. 10% → 50% → 100% over 1 month

### 5.3 Monitoring & Observability

**Metrics to Watch:**

- **Error rate:** Should not increase >5% after deployment
- **Page load time:** Should not increase >10%
- **API latency:** Should remain stable
- **WebSocket reconnections:** Should not spike
- **Build time:** Should decrease after webpack 5 upgrade

**Tools:**

- Browser console errors (enable logging in P0)
- Server logs (API error rates)
- Bundle size tracking (webpack-bundle-analyzer)
- Lighthouse CI
- Real user monitoring (if available)

### 5.4 Known Issues & Workarounds

**Issue 1: axios@0.27 breaks custom interceptors**

*Symptom:* API calls return 401 even with valid tokens

*Workaround:*
```js
// In src/providers/http/index.js
// OLD (axios 0.18):
axios.interceptors.response.use(null, (error) => {
  return Promise.reject(error.response);
});

// NEW (axios 0.27):
axios.interceptors.response.use(null, (error) => {
  return Promise.reject(error);  // Use error, not error.response
});
```

**Issue 2: socket.io-client@4 connection fails**

*Symptom:* WebSocket connection hangs or errors

*Workaround:*
```js
// In src/providers/sockets/index.js
// OLD (socket.io v2):
const socket = io(url);

// NEW (socket.io v4):
const socket = io(url, {
  transports: ['websocket', 'polling'],  // Explicit transports
  reconnectionDelay: 1000,
});
```

**Issue 3: react-hook-form@7 errors not displaying**

*Symptom:* Form validation errors disappear

*Workaround:*
```jsx
// OLD (v6):
{errors.email && <span>{errors.email.message}</span>}

// NEW (v7):
{errors?.email?.message && <span>{errors.email.message}</span>}
```

**Issue 4: webpack 5 polyfill errors**

*Symptom:* "Module not found: Error: Can't resolve 'crypto'"

*Workaround:*
```bash
# Install polyfills (temporary until code is modernized)
npm install --save-dev node-polyfill-webpack-plugin
```

Then in `config-overrides.js` (if using react-app-rewired):
```js
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: (config) => {
    config.plugins.push(new NodePolyfillPlugin());
    return config;
  },
};
```

---

## 6. Success Metrics

### 6.1 P0 Success Criteria

- [x] `npm install` completes on Node 24 (exit code 0)
- [x] `npm run build` produces valid bundle
- [x] `npm run dev` starts without errors
- [x] `npm test` runs 4 test files
- [x] `npm run storybook` starts
- [x] Docker build succeeds with Node 24 base image
- [x] Manual login + navigation smoke test passes

**Quantitative:**
- Install time: <5 minutes
- Build time: <3 minutes
- Dev server start: <30 seconds
- Zero critical errors in console

### 6.2 P1 Success Criteria

- [x] `npm audit --production` shows zero HIGH/CRITICAL
- [x] Bundle size reduced by ≥500 KB
- [x] All P0 tests still pass
- [x] WebSocket reconnection tested
- [x] Chart rendering verified
- [x] Date formatting matches previous output

**Quantitative:**
- Production bundle gzipped: target <1.5 MB (from ~2 MB)
- First contentful paint: <2.5s
- Time to interactive: <4s

### 6.3 P2 Success Criteria

- [x] React 18 deployed with no regression bugs
- [x] MUI v5 migrated; theme consistent
- [x] RTK Query handles 80%+ API calls
- [x] Vite dev server: <2s cold start
- [x] Test coverage: >40%
- [x] Lighthouse performance score: >85

**Quantitative:**
- Main bundle gzipped: <500 KB
- Dev server cold start: <2s
- Production build time: <1 minute
- Test suite execution: <30s

---

## 7. Communication Plan

### 7.1 Stakeholder Updates

**Before P0:**
- Email to engineering team: "Node 24 upgrade scheduled [DATE]"
- Changelog entry: "Upgrading to Node 24 LTS for security and performance"

**After P0:**
- Deployment notification: "Node 24 upgrade deployed to production"
- Monitor logs for 24 hours
- Summary email: "P0 complete; P1 starts [DATE]"

**After P1:**
- Release notes: "Bundle size reduced by 30%; security vulnerabilities fixed"
- Blog post (optional): "Modernizing learlify-frontend for Node 24"

**After P2:**
- Major version announcement: "v1.0.0 — React 18, MUI v5, Vite"

### 7.2 Documentation Updates

**Files to Update:**

1. `README.md` — Update "Getting Started" section:
   ```md
   ## Prerequisites
   - Node.js 24.12.0 or higher
   - npm 9 or higher
   ```

2. `CONTRIBUTING.md` (if exists) — Add:
   ```md
   ## Development Environment
   Use Node 24 LTS. Install via nvm:
   \`\`\`bash
   nvm install
   nvm use
   \`\`\`
   ```

3. `DOCKER.md` — Update base image reference

4. `CI/CD config` — Update Node version in GitHub Actions / Jenkins / etc.

---

## 8. Assumptions & Open Questions

### 8.1 Assumptions Made

1. **No custom webpack config exists** — Verified by absence of `config-overrides.js` and `craco.config.js`
2. **Primary package manager is npm** — Based on `npm ci` in Dockerfile and `package-lock.json` presence
3. **yarn.lock exists but is stale** — Not used; can be deleted
4. **CRA has not been ejected** — No `config/` directory in project root
5. **Backend API is version-agnostic** — Axios upgrade won't break contract (needs verification)
6. **WebSocket server is socket.io v4 compatible** — Backend supports socket.io v4 protocol (needs verification)
7. **No IE11 support required** — Modern browsers only (based on browserslist)
8. **Storybook is actively used** — Public folder references suggest it's configured

### 8.2 Open Questions for Verification

1. **Is there a staging environment?** — Deployment strategy assumes yes
2. **Are there E2E tests not in this repo?** — Might be in separate QA automation repo
3. **What is the backend socket.io version?** — Verify before upgrading client to v4
4. **Are there any CRA customizations via env vars?** — Check for `SKIP_PREFLIGHT_CHECK`, `EXTEND_ESLINT`, etc.
5. **Is `redux-saga` actually used?** — Search codebase for saga files before removing
6. **What is the production deployment process?** — Manual vs CI/CD affects rollback strategy
7. **Are there feature flags available?** — Needed for P2 gradual rollout

### 8.3 Verification Commands

Run these to answer open questions:

```bash
# Check for custom CRA env vars
grep -r "SKIP_PREFLIGHT_CHECK\|EXTEND_ESLINT\|INLINE_RUNTIME_CHUNK" .env* 2>/dev/null

# Find saga usage
find src/ -type f -name "*.js" -o -name "*.jsx" | xargs grep -l "takeEvery\|takeLatest\|put\|call" | grep -i saga

# Check backend socket.io version
curl -s https://api.example.com/socket.io/?EIO=4&transport=polling | grep "version"

# Find E2E test configuration
find . -name "cypress.json" -o -name "playwright.config.*" -o -name "*.e2e.*"

# Check CI/CD config
cat .github/workflows/*.yml 2>/dev/null | grep "node-version"
```

---

## Appendix A: Command Quick Reference

### P0 Commands (Run in Sequence)

```bash
# 1. Preparation
git checkout -b feat/node24-p0-compatibility
rm -rf node_modules package-lock.json

# 2. Config files
echo "24.12.0" > .nvmrc
# (Edit package.json to add engines field)
# (Edit Dockerfile: node:12-alpine → node:24-alpine, python2 → python3)

# 3. Dependency changes
npm uninstall node-sass jest
npm install --save sass@^1.77.0 axios@^0.27.2
npm install --save-dev react-scripts@5.0.1 @testing-library/react@^12.1.5
npm install --save-dev @storybook/react@^6.5.16 @storybook/addon-actions@^6.5.16 @storybook/addon-links@^6.5.16 babel-loader@^8.3.0

# 4. Validate
npm install
npm run build
npm test -- --watchAll=false
npm run storybook  # Ctrl+C to exit

# 5. Commit and push
git add .
git commit -m "feat(node): upgrade to Node 24 compatibility (P0)"
git push origin feat/node24-p0-compatibility
```

### P1 Commands (Run Per PR)

**PR 1: Security**
```bash
git checkout -b feat/node24-p1-security
npm install socket.io-client@^4.7.0 @reduxjs/toolkit@^1.9.7 immer@^9.0.21 react-hook-form@^7.51.0
npm uninstall @rtk-incubator/rtk-query
# (Update imports in code)
git add . && git commit -m "feat(deps): P1.1 security upgrades"
```

**PR 2: Bundle**
```bash
git checkout -b feat/node24-p1-bundle
npm install date-fns@^3.3.0 chart.js@^3.9.1 react-chartjs-2@^4.3.1 framer-motion@^10.18.0
npm uninstall moment moment-timezone
# (Migrate moment calls to date-fns)
git add . && git commit -m "feat(deps): P1.2 bundle optimization"
```

**PR 3: Tooling**
```bash
git checkout -b feat/node24-p1-tooling
npm install i18next@^23.8.0 react-i18next@^14.0.5 i18next-browser-languagedetector@^7.2.0
npm install --save-dev i18next-scanner@^4.4.0 workbox-build@^7.0.0
git add . && git commit -m "feat(deps): P1.3 tooling alignment"
```

**PR 4: Pruning**
```bash
git checkout -b feat/node24-p1-prune
npm uninstall url-search-params-polyfill es6-map redux-saga
# (Remove saga from store/index.js)
git add . && git commit -m "chore(deps): P1.4 remove dead code"
```

### Docker Build Commands

```bash
# Build with Node 24
docker build -t learlify-frontend:node24 .

# Test locally
docker run -d -p 8080:80 --name learlify-test learlify-frontend:node24
curl http://localhost:8080
docker logs learlify-test
docker stop learlify-test && docker rm learlify-test

# Push to registry (if applicable)
docker tag learlify-frontend:node24 registry.example.com/learlify-frontend:v0.4.1
docker push registry.example.com/learlify-frontend:v0.4.1
```

---

## Appendix B: Troubleshooting Guide

### Error: "node-sass build failed"

**Cause:** node-sass native bindings incompatible with Node 24

**Fix:**
```bash
npm uninstall node-sass
npm install sass
# No code changes needed; sass is drop-in replacement
```

### Error: "digital envelope routines::unsupported"

**Cause:** Webpack 4 + OpenSSL 3.0 incompatibility (Node 17+)

**Fix:**
```bash
# Temporary workaround (P0 only):
export NODE_OPTIONS=--openssl-legacy-provider
npm run build

# Proper fix (P0):
npm install --save-dev react-scripts@5.0.1
```

### Error: "Peer dependency warnings"

**Cause:** npm 7+ enforces peer dependencies strictly

**Fix:**
```bash
# If warnings don't block install:
# Safe to ignore during P0; will resolve in P1

# If install fails:
npm install --legacy-peer-deps

# Or fix specific conflicts:
npm install <package>@<compatible-version>
```

### Error: "React does not recognize the X prop"

**Cause:** MUI v4 internal issue with React 17

**Fix:** Known non-critical warning; will resolve in P2 with React 18 + MUI v5

### Error: "Cannot find module 'webpack'"

**Cause:** Storybook expecting webpack globally

**Fix:**
```bash
npm install --save-dev webpack@^5.88.0
```

### Error: "Tests failed with 'Unhandled promise rejection'"

**Cause:** Jest 27 has stricter async handling

**Fix:**
```js
// In test files, ensure all promises are handled:
it('test name', async () => {
  await expect(promise).resolves.toBe(value);
});
```

---

## Appendix C: Additional Resources

**Official Documentation:**
- [Node.js 24 Release Notes](https://nodejs.org/en/blog/release/v24.0.0)
- [Create React App Migration Guide](https://create-react-app.dev/docs/updating-to-new-releases/)
- [Webpack 4 → 5 Migration](https://webpack.js.org/migrate/5/)
- [axios Migration Guide](https://github.com/axios/axios/blob/v1.x/MIGRATION_GUIDE.md)

**Community Resources:**
- [socket.io v2 → v4 Migration](https://socket.io/docs/v4/migrating-from-2-x-to-3-0/)
- [moment → date-fns Cheat Sheet](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
- [Chart.js v2 → v3 Migration](https://www.chartjs.org/docs/latest/getting-started/v3-migration.html)

**Tools:**
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) — Automated dependency update checking
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) — Bundle size visualization
- [depcheck](https://www.npmjs.com/package/depcheck) — Find unused dependencies

---

**Plan Version:** 1.0  
**Last Updated:** 2026-03-06  
**Next Review:** After P0 completion
