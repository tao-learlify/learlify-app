# Node 24 Upgrade Checklist

**Engineer:** _______________________  
**Date Started:** _______________________  
**Target Completion:** P0: Same day | P1: 1 week | P2: Deferred

---

## Pre-Flight Checklist

- [ ] Read [node-upgrade-plan.md](./node-upgrade-plan.md) in full
- [ ] Verify current Node version: `node --version` (should show 24.12.0)
- [ ] Verify npm version: `npm --version` (should show ≥9.0.0)
- [ ] Create backup branch: `git checkout -b backup/pre-node24-upgrade && git push origin backup/pre-node24-upgrade`
- [ ] Clean workspace: `git status` (no uncommitted changes)
- [ ] Document current state:
  ```bash
  mkdir -p .upgrade-state
  node --version > .upgrade-state/node-before.txt
  npm --version > .upgrade-state/npm-before.txt
  npm list --depth=0 > .upgrade-state/deps-before.txt 2>&1
  ```

---

## Phase 0 (P0): Minimal Compatibility Unblock

**Objective:** Make project install, build, and run on Node 24  
**Risk:** 🟡 LOW-MEDIUM  
**Time:** 4-8 hours

### P0.1: Repository Configuration

- [ ] Create working branch: `git checkout -b feat/node24-p0-compatibility`
- [ ] Create `.nvmrc` file:
  ```bash
  echo "24.12.0" > .nvmrc
  ```
- [ ] Edit `package.json` — Add `engines` field after `proxy`:
  ```json
  "engines": {
    "node": ">=18.0.0 <25.0.0",
    "npm": ">=9.0.0"
  }
  ```
- [ ] Edit `Dockerfile`:
  - Line 3: `FROM node:12-alpine AS builder` → `FROM node:24-alpine AS builder`
  - Line 6: `RUN apk add --no-cache python2 make g++` → `RUN apk add --no-cache python3 make g++`
  - Line 42: `FROM node:12-alpine AS development` → `FROM node:24-alpine AS development`
  - Line 45: `RUN apk add --no-cache python2 make g++` → `RUN apk add --no-cache python3 make g++`
- [ ] Commit config changes:
  ```bash
  git add .nvmrc package.json Dockerfile
  git commit -m "chore(node): set Node 24 LTS as target runtime

  - Add .nvmrc with 24.12.0
  - Add engines field to package.json
  - Update Dockerfile to use node:24-alpine
  - Replace python2 with python3 in Docker build"
  ```

### P0.2: Critical Dependency Replacements

- [ ] Remove blockers:
  ```bash
  rm -rf node_modules package-lock.json
  npm uninstall node-sass jest
  ```
- [ ] Install Node 24-compatible versions:
  ```bash
  npm install --save sass@^1.77.0
  npm install --save axios@^0.27.2
  npm install --save-dev react-scripts@5.0.1
  npm install --save-dev @testing-library/react@^12.1.5
  npm install --save-dev @storybook/react@^6.5.16 @storybook/addon-actions@^6.5.16 @storybook/addon-links@^6.5.16
  npm install --save-dev babel-loader@^8.3.0
  ```
- [ ] Verify installation completed without errors
- [ ] Commit dependency changes:
  ```bash
  git add package.json package-lock.json
  git commit -m "feat(deps): upgrade to Node 24-compatible versions

  - Replace node-sass@4.13.1 with sass@^1.77.0 (Dart Sass)
  - Upgrade react-scripts 4.0.0 → 5.0.1 (webpack 5, Jest 27)
  - Remove standalone jest@24 (now bundled with react-scripts)
  - Upgrade @testing-library/react 9.3.1 → ^12.1.5 (Jest 27 compat)
  - Upgrade axios 0.18.1 → ^0.27.2 (security fixes)
  - Upgrade Storybook to v6.5.16 (webpack 5 support)
  - Upgrade babel-loader to v8.3.0

  BREAKING CHANGES:
  - axios error structure updated; verify error handling
  - react-scripts now uses webpack 5 and Jest 27"
  ```

### P0.3: Validation

- [ ] **Test 1: Clean install**
  ```bash
  rm -rf node_modules
  npm ci
  echo "Exit code: $?"  # Should be 0
  ```
- [ ] **Test 2: Production build**
  ```bash
  npm run build
  ls -lh build/static/js/*.js  # Verify files created
  ```
- [ ] **Test 3: Dev server**
  ```bash
  npm run dev  # Should start without errors
  # In browser: http://localhost:3000
  # Verify: No console errors, login page loads
  # Ctrl+C to stop
  ```
- [ ] **Test 4: Test suite**
  ```bash
  npm test -- --watchAll=false
  # Should run 4 test files
  ```
- [ ] **Test 5: Storybook**
  ```bash
  npm run storybook
  # In browser: http://localhost:9009
  # Verify: Storybook UI loads
  # Ctrl+C to stop
  ```
- [ ] **Test 6: Docker build**
  ```bash
  docker build -t learlify-frontend:node24-test .
  # Should complete without errors
  docker run -d -p 8080:80 --name learlify-test learlify-frontend:node24-test
  curl http://localhost:8080 | grep "learlify"
  docker stop learlify-test && docker rm learlify-test
  docker rmi learlify-frontend:node24-test
  ```

### P0.4: Manual Smoke Test

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:3000
- [ ] Test login page:
  - [ ] Login form renders
  - [ ] Input fields accept text
  - [ ] Submit button clickable
  - [ ] No console errors
- [ ] Test navigation (if backend available):
  - [ ] Navigate to /courses
  - [ ] Navigate to /dashboard
  - [ ] Check browser console for errors

### P0.5: Code Review & Verification

- [ ] Check for axios usage in error handling:
  ```bash
  grep -r "error.response" src/providers/http/ src/hooks/useHttpClient.js src/store/@thunks/
  ```
  If found, verify error handling still works (may need updates for axios 0.27)

- [ ] Verify SCSS imports still work:
  ```bash
  grep -r "import.*\.scss" src/components/ | head -n 5
  # Should find .module.scss files; no changes needed (sass handles them)
  ```

- [ ] Check lockfile version:
  ```bash
  grep '"lockfileVersion"' package-lock.json
  # Should show 3
  ```

### P0.6: Push & Create PR

- [ ] Final validation before push:
  ```bash
  npm run build
  npm test -- --watchAll=false
  ```
- [ ] Push to remote:
  ```bash
  git push origin feat/node24-p0-compatibility
  ```
- [ ] Create Pull Request with title: "feat(node): upgrade to Node 24 LTS compatibility (P0)"
- [ ] Add PR description from checklist
- [ ] Request review from senior engineer
- [ ] Tag as `priority:high` and `type:infrastructure`

### P0 Acceptance Criteria (All Must Pass)

- [x] `npm ci` completes without errors
- [x] `npm run build` produces bundle in `/build`
- [x] `npm run dev` starts dev server on port 3000
- [x] `npm test` runs 4 test files successfully
- [x] `npm run storybook` starts on port 9009
- [x] Docker build succeeds with Node 24 base image
- [x] Login page loads and renders correctly
- [x] No critical console errors in browser

**If ANY criterion fails, DO NOT MERGE. Debug and re-validate.**

---

## Phase 1 (P1): Safe Modernization

**Objective:** Fix security issues, reduce bundle size, align tooling  
**Risk:** 🟡 MEDIUM  
**Time:** 8-16 hours (across 4 PRs)

**PREREQUISITE:** P0 merged and deployed to production successfully

### P1.1: Security & Stability Upgrades (PR #1)

- [ ] Create branch: `git checkout -b feat/node24-p1-security`
- [ ] Upgrade packages:
  ```bash
  npm install socket.io-client@^4.7.0
  npm install @reduxjs/toolkit@^1.9.7
  npm install immer@^9.0.21
  npm install react-hook-form@^7.51.0
  npm uninstall @rtk-incubator/rtk-query
  ```
- [ ] **Code Changes Required:**
  
  **socket.io-client v4 migration:**
  - [ ] Update `src/providers/sockets/index.js`:
    ```diff
    - const socket = io(url);
    + const socket = io(url, {
    +   transports: ['websocket', 'polling'],
    +   reconnectionDelay: 1000,
    + });
    ```
  - [ ] Update `src/App.js` (WebSocket connection around lines 34-80)
  - [ ] Test: Verify socket connection, reconnection, and real-time events
  
  **RTK Query migration:**
  - [ ] Find all RTK Query imports:
    ```bash
    grep -r "@rtk-incubator/rtk-query" src/
    ```
  - [ ] Replace with:
    ```diff
    - import { createApi } from '@rtk-incubator/rtk-query';
    + import { createApi } from '@reduxjs/toolkit/query/react';
    ```
  
  **react-hook-form v7 migration:**
  - [ ] Find all `useForm` usages:
    ```bash
    grep -r "useForm" src/ --include="*.js" --include="*.jsx"
    ```
  - [ ] Update error access:
    ```diff
    - {errors.email && <span>{errors.email.message}</span>}
    + {errors?.email?.message && <span>{errors.email.message}</span>}
    ```
  - [ ] Test all forms (login, registration, payment, etc.)

- [ ] Validate:
  ```bash
  npm run build
  npm test -- --watchAll=false
  ```
- [ ] Manual test:
  - [ ] WebSocket connection works
  - [ ] Real-time notifications appear
  - [ ] Forms validate and submit
  - [ ] RTK Query calls work (if actively used)

- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "feat(deps): security and stability upgrades (P1.1)

  - Upgrade socket.io-client 2.3.0 → ^4.7.0
  - Upgrade @reduxjs/toolkit 1.5.0 → ^1.9.7
  - Migrate @rtk-incubator/rtk-query → @reduxjs/toolkit/query
  - Upgrade react-hook-form 6.14.0 → ^7.51.0
  - Upgrade immer 6.0.3 → ^9.0.21

  BREAKING CHANGES:
  - socket.io connection API updated
  - react-hook-form error structure changed"
  
  git push origin feat/node24-p1-security
  ```
- [ ] Create PR, get review, merge after approval

---

### P1.2: Bundle Size Optimization (PR #2)

- [ ] Create branch: `git checkout -b feat/node24-p1-bundle`
- [ ] **Replace moment with date-fns:**
  
  ```bash
  npm install date-fns@^3.3.0
  npm uninstall moment moment-timezone
  ```
  
  - [ ] Find all moment usage:
    ```bash
    grep -r "moment(" src/ --include="*.js" --include="*.jsx"
    grep -r "from 'moment'" src/
    ```
  
  - [ ] Replace common patterns:
    ```diff
    - import moment from 'moment';
    - moment().format('YYYY-MM-DD')
    + import { format } from 'date-fns';
    + format(new Date(), 'yyyy-MM-dd')
    ```
    
    ```diff
    - moment().add(1, 'day')
    + import { addDays } from 'date-fns';
    + addDays(new Date(), 1)
    ```
    
    ```diff
    - moment(date).fromNow()
    + import { formatDistanceToNow } from 'date-fns';
    + formatDistanceToNow(new Date(date), { addSuffix: true })
    ```
  
  - [ ] Focus on high-traffic files:
    - `src/utils/functions.js`
    - `src/views/classes/AdminSchedule.js`
    - `src/components/*/` (any date displays)
  
  - [ ] Test date formatting in UI; verify output matches previous display

- [ ] **Upgrade Chart.js:**
  ```bash
  npm install chart.js@^3.9.1 react-chartjs-2@^4.3.1
  ```
  
  - [ ] Find chart components:
    ```bash
    grep -r "Chart" src/ --include="*.js" | grep import
    ```
  
  - [ ] Update chart config (example):
    ```diff
    - import { Chart } from 'chart.js';
    + import { Chart, registerables } from 'chart.js';
    + Chart.register(...registerables);
    
    // Or register only what's needed:
    + import { Chart, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js';
    + Chart.register(LineController, LineElement, PointElement, LinearScale, Title);
    ```
  
  - [ ] Update options (scales API changed):
    ```diff
    options: {
      scales: {
    -   yAxes: [{ ticks: { beginAtZero: true } }]
    +   y: { beginAtZero: true }
      }
    }
    ```
  
  - [ ] Test all charts render correctly

- [ ] **Upgrade framer-motion:**
  ```bash
  npm install framer-motion@^10.18.0
  ```
  
  - [ ] Find motion components:
    ```bash
    grep -r "motion\." src/ --include="*.js"
    ```
  
  - [ ] Verify animations still work (API mostly backward-compatible)

- [ ] Validate bundle size:
  ```bash
  npm run build
  du -h build/static/js/*.js | sort -h
  # Main chunk should be ~30% smaller than before
  ```

- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "feat(deps): bundle size optimization (P1.2)

  - Replace moment with date-fns (~500 KB reduction)
  - Upgrade chart.js 2.9.4 → ^3.9.1 (tree-shakeable)
  - Upgrade react-chartjs-2 2.11.1 → ^4.3.1
  - Upgrade framer-motion 1.10.3 → ^10.18.0

  Bundle size reduced by ~600 KB total"
  
  git push origin feat/node24-p1-bundle
  ```
- [ ] Create PR, add bundle size comparison in description

---

### P1.3: Tooling Alignment (PR #3)

- [ ] Create branch: `git checkout -b feat/node24-p1-tooling`
- [ ] Upgrade i18n ecosystem:
  ```bash
  npm install i18next@^23.8.0 react-i18next@^14.0.5 i18next-browser-languagedetector@^7.2.0
  npm install --save-dev i18next-scanner@^4.4.0 workbox-build@^7.0.0
  ```
- [ ] Update i18n initialization (if needed):
  - [ ] Check `src/i18n.js` or `src/lang/index.js`
  - [ ] Verify language detection still works
  - [ ] Test translation loading
- [ ] Validate:
  ```bash
  npm run scanner  # Should complete without errors
  npm run build
  ```
- [ ] Manual test:
  - [ ] Switch language in app
  - [ ] Verify translations load
  - [ ] Check browser console for warnings
- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "feat(deps): tooling alignment for Node 24 (P1.3)

  - Upgrade i18next 19.3.2 → ^23.8.0
  - Upgrade react-i18next 11.3.3 → ^14.0.5
  - Upgrade i18next-browser-languagedetector 4.0.2 → ^7.2.0
  - Upgrade i18next-scanner 3.0.0 → ^4.4.0
  - Upgrade workbox-build 5.0.0 → ^7.0.0"
  
  git push origin feat/node24-p1-tooling
  ```
- [ ] Create PR

---

### P1.4: Dependency Pruning (PR #4)

- [ ] Create branch: `git checkout -b feat/node24-p1-prune`
- [ ] Remove polyfills:
  ```bash
  npm uninstall url-search-params-polyfill es6-map
  ```
- [ ] Verify redux-saga usage:
  ```bash
  find src/ -name "*saga*" -o -name "*Saga*"
  ```
  
  If no saga files found:
  ```bash
  npm uninstall redux-saga
  ```
  
  - [ ] Edit `src/store/index.js`:
    ```diff
    - import createSagaMiddleware from 'redux-saga';
    - const sagaMiddleware = createSagaMiddleware();
    - middleware: [...getDefaultMiddleware(), thunk, sagaMiddleware],
    + middleware: [...getDefaultMiddleware(), thunk],
    ```

- [ ] Validate:
  ```bash
  npm run build
  npm test -- --watchAll=false
  ```
- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "chore(deps): remove unused dependencies (P1.4)

  - Remove url-search-params-polyfill (native support)
  - Remove es6-map (native Map)
  - Remove redux-saga (no usage found)

  Bundle size reduced by ~80 KB"
  
  git push origin feat/node24-p1-prune
  ```
- [ ] Create PR

---

### P1 Acceptance Criteria (All Must Pass)

- [x] All 4 PRs merged to main
- [x] `npm audit --production` shows zero HIGH/CRITICAL vulnerabilities
- [x] Production bundle size reduced by ≥500 KB (compare gzipped sizes)
- [x] All P0 tests still pass
- [x] WebSocket notifications work
- [x] Charts render correctly
- [x] Date formatting matches previous output
- [x] Forms validate and submit
- [x] Translations load in all supported languages

---

## Phase 2 (P2): Strategic Upgrades — DEFERRED

**STOP HERE for Node 24 compatibility. P2 is follow-up work.**

P2 includes:
- React 18 migration
- Material-UI v5 migration
- CRA to Vite migration
- RTK Query full adoption
- Jest 29 upgrade

**See [node-upgrade-plan.md](./node-upgrade-plan.md) section 2.2.4 for P2 details.**

---

## Post-Deployment Checklist

### After P0 Deployment

- [ ] Monitor error rates for 24 hours
- [ ] Check build logs in CI/CD
- [ ] Verify production app loads correctly
- [ ] Test WebSocket connection in production
- [ ] Confirm no regressions in critical flows:
  - [ ] User login
  - [ ] Course enrollment
  - [ ] Payment processing (if applicable)

### After P1 Deployment

- [ ] Compare bundle sizes (before vs. after)
- [ ] Run Lighthouse audit; verify score unchanged or improved
- [ ] Check `npm audit` results
- [ ] Monitor performance metrics for 1 week
- [ ] Gather user feedback on UI changes (if any)

### Documentation Updates

- [ ] Update `README.md`:
  ```md
  ## Prerequisites
  - Node.js 24.12.0 or higher
  - npm 9 or higher
  ```
- [ ] Update `CONTRIBUTING.md` (if exists):
  ```md
  Use Node 24 LTS:
  \`\`\`bash
  nvm install
  nvm use
  \`\`\`
  ```
- [ ] Update CI/CD config:
  - [ ] GitHub Actions: Update `node-version: 24`
  - [ ] Jenkins/CircleCI: Update Node Docker image
  - [ ] Netlify/Vercel: Update Node version in settings

---

## Rollback Plan

### If P0 Breaks Production

1. **Immediate rollback:**
   ```bash
   git checkout main
   git revert <p0-merge-commit-sha>
   git push origin main
   ```

2. **Redeploy previous version:**
   ```bash
   git checkout backup/pre-node24-upgrade
   npm ci
   npm run build
   # Deploy build/ to production
   ```

3. **Investigate failure:**
   - Check production logs
   - Reproduce locally on Node 24
   - Fix issue
   - Re-test P0 checklist
   - Redeploy

### If P1 PR Breaks Staging

1. **Revert specific PR:**
   ```bash
   git revert <pr-merge-commit>
   npm ci
   npm run build
   ```

2. **Isolate and fix:**
   - Identify failing component
   - Add test coverage
   - Fix and redeploy PR individually

---

## Sign-Off

**P0 Completed:**
- [ ] Engineer: _______________________ Date: _______
- [ ] Reviewer: _______________________ Date: _______
- [ ] QA: _______________________ Date: _______

**P1 Completed:**
- [ ] Engineer: _______________________ Date: _______
- [ ] Reviewer: _______________________ Date: _______
- [ ] QA: _______________________ Date: _______

**Production Deployment:**
- [ ] P0 Deployed: _______ Date: _______
- [ ] P1 Deployed: _______ Date: _______
- [ ] Post-deployment monitoring complete: _______

---

**Checklist Version:** 1.0  
**Last Updated:** 2026-03-06
