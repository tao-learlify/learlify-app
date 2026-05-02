# Proposed Package Changes for Node 24 Compatibility

**Generated:** 2026-03-06  
**Target:** learlify-frontend v0.4.0 → v0.5.0 (Node 24 compatible)

---

## Summary

| Category | Count | Total Changes |
|----------|-------|---------------|
| Upgrades (P0) | 6 | Critical blockers for Node 24 |
| Upgrades (P1) | 12 | Security, performance, alignment |
| Removals (P0) | 2 | Replaced by better alternatives |
| Removals (P1) | 4 | Dead code, polyfills |
| Additions (P0) | 2 | Replacements for removed packages |
| Additions (P1) | 1 | Bundle optimization |
| **Deferred (P2)** | **7** | **Not required for Node 24** |
| **TOTAL (P0+P1)** | **27** | — |

---

## Phase 0 (P0): Critical Blockers

### Dependencies to Upgrade

| Package | Current | Target | Severity | Reason |
|---------|---------|--------|----------|--------|
| `react-scripts` | 4.0.0 | **5.0.1** | 🔴 CRITICAL | Webpack 4 incompatible with Node 17+ (OpenSSL 3.0) |
| `axios` | 0.18.1 | **^0.27.2** | 🔴 HIGH | Security (CVE-2020-28168, CVE-2021-3749) |
| `@testing-library/react` | 9.3.1 | **^12.1.5** | 🟡 MEDIUM | Jest 27 compatibility (bundled with react-scripts 5) |
| `@storybook/react` | 6.1.6 | **^6.5.16** | 🟡 MEDIUM | Webpack 5 support required |
| `@storybook/addon-actions` | 6.1.6 | **^6.5.16** | 🟡 MEDIUM | Storybook v6.5 alignment |
| `@storybook/addon-links` | 6.1.6 | **^6.5.16** | 🟡 MEDIUM | Storybook v6.5 alignment |
| `babel-loader` | 8.0.5 | **^8.3.0** | 🟡 LOW | Babel 7.12+ compatibility |

**Command:**
```bash
npm install --save axios@^0.27.2
npm install --save-dev react-scripts@5.0.1 @testing-library/react@^12.1.5
npm install --save-dev @storybook/react@^6.5.16 @storybook/addon-actions@^6.5.16 @storybook/addon-links@^6.5.16 babel-loader@^8.3.0
```

**Breaking Changes:**
- `react-scripts` 5.0.1 uses webpack 5 and Jest 27 (not backward-compatible with custom webpack configs)
- `axios` 0.27 has changed error structure: use `error` instead of `error.response` in interceptors

---

### Dependencies to Remove

| Package | Current | Reason | Replaced By |
|---------|---------|--------|-------------|
| `node-sass` | 4.13.1 | Native addon; no Node 16+ support | `sass` (Dart Sass) |
| `jest` | 24.9.0 | Standalone version conflicts with react-scripts 5 | Bundled in react-scripts |

**Command:**
```bash
npm uninstall node-sass jest
```

---

### Dependencies to Add

| Package | Version | Reason |
|---------|---------|--------|
| `sass` | **^1.77.0** | Drop-in replacement for node-sass; pure JS, no native bindings |

**Command:**
```bash
npm install --save sass@^1.77.0
```

**Migration Required:** None (SCSS syntax identical)

---

## Phase 1 (P1): Security & Modernization

### P1.1: Security & Stability Upgrades

| Package | Current | Target | Severity | Reason |
|---------|---------|--------|----------|--------|
| `socket.io-client` | 2.3.0 | **^4.7.0** | 🟡 MEDIUM | Node 24 fixes, smaller bundle, ESM support |
| `@reduxjs/toolkit` | 1.5.0 | **^1.9.7** | 🟢 LOW | Listener middleware, immer updates, TypeScript improvements |
| `immer` | 6.0.3 | **^9.0.21** | 🟢 LOW | ES6 Proxy optimizations, Node 24 support |
| `react-hook-form` | 6.14.0 | **^7.51.0** | 🟡 MEDIUM | Memory leak fixes, performance improvements |

**Commands:**
```bash
npm install socket.io-client@^4.7.0
npm install @reduxjs/toolkit@^1.9.7
npm install immer@^9.0.21
npm install react-hook-form@^7.51.0
```

**Breaking Changes:**
- `socket.io-client` v4: Connection options API changed; transports must be explicit
- `react-hook-form` v7: Error object structure changed; use optional chaining for `errors?.field?.message`

---

### P1.2: Bundle Size Optimization

| Package | Current | Target | Severity | Reason |
|---------|---------|--------|----------|--------|
| `chart.js` | 2.9.4 | **^3.9.1** | 🟡 MEDIUM | Tree-shakeable registry (~200 KB savings) |
| `react-chartjs-2` | 2.11.1 | **^4.3.1** | 🟡 MEDIUM | Chart.js v3 compatibility |
| `framer-motion` | 1.10.3 | **^10.18.0** | 🟢 LOW | Better tree-shaking, modern APIs |

**Commands:**
```bash
npm install chart.js@^3.9.1 react-chartjs-2@^4.3.1
npm install framer-motion@^10.18.0
```

**Breaking Changes:**
- `chart.js` v3: Scales API changed (`yAxes` → `y`); explicit registration required
- `react-chartjs-2` v4: Props API updated to match Chart.js v3

---

### P1.3: Tooling Alignment

| Package | Current | Target | Severity | Reason |
|---------|---------|--------|----------|--------|
| `i18next` | 19.3.2 | **^23.8.0** | 🟢 LOW | React 18 ready, better performance |
| `react-i18next` | 11.3.3 | **^14.0.5** | 🟢 LOW | i18next v23 compatibility |
| `i18next-browser-languagedetector` | 4.0.2 | **^7.2.0** | 🟢 LOW | Modern browser API usage |
| `i18next-scanner` | 3.0.0 | **^4.4.0** | 🟢 LOW | Node 18+ support |
| `workbox-build` | 5.0.0 | **^7.0.0** | 🟢 LOW | Webpack 5 peer dependency compatibility |

**Commands:**
```bash
npm install i18next@^23.8.0 react-i18next@^14.0.5 i18next-browser-languagedetector@^7.2.0
npm install --save-dev i18next-scanner@^4.4.0 workbox-build@^7.0.0
```

**Breaking Changes:** Minor; i18n initialization may need updates

---

### Dependencies to Remove (P1)

| Package | Current | Reason |
|---------|---------|--------|
| `@rtk-incubator/rtk-query` | 0.3.0 | Pre-release; graduated to `@reduxjs/toolkit` core |
| `url-search-params-polyfill` | 8.0.0 | URLSearchParams native in all modern browsers |
| `es6-map` | 0.1.5 | `Map` native in all modern browsers |
| `redux-saga` | 1.1.3 | No usage found; adds 50 KB bundle weight |

**Commands:**
```bash
npm uninstall @rtk-incubator/rtk-query url-search-params-polyfill es6-map redux-saga
```

**Code Changes Required:**
- Replace all `@rtk-incubator/rtk-query` imports with `@reduxjs/toolkit/query/react`
- Remove `redux-saga` middleware from `src/store/index.js`

---

### Dependencies to Add (P1)

| Package | Version | Reason |
|---------|---------|--------|
| `date-fns` | **^3.3.0** | Replaces `moment` + `moment-timezone`; 20 KB vs 530 KB |

**Command:**
```bash
npm install date-fns@^3.3.0
```

**Migration Required:** 
- Replace all `moment()` calls with `date-fns` equivalents
- High-effort migration (~4-6 hours); see [migration guide](https://github.com/you-dont-need/You-Dont-Need-Momentjs)

---

### Dependencies to Remove After date-fns Migration (P1)

| Package | Current | Reason |
|---------|---------|--------|
| `moment` | 2.24.0 | Deprecated; 530 KB bundle overhead |
| `moment-timezone` | 0.5.31 | Deprecated; replaced by date-fns-tz if needed |

**Command:**
```bash
npm uninstall moment moment-timezone
```

**Bundle Impact:** ~500-600 KB reduction (unminified)

---

## Phase 2 (P2): Strategic Upgrades — DEFERRED

**These are NOT required for Node 24 compatibility.**

| Package | Current | Target | Reason | Risk |
|---------|---------|--------|--------|------|
| `react` | 17.0.0 | **^18.2.0** | Concurrent features, automatic batching | 🔴 HIGH |
| `react-dom` | 17.0.0 | **^18.2.0** | React 18 peer dependency | 🔴 HIGH |
| `@material-ui/core` | 4.10.2 | **REMOVE** | Replace with `@mui/material` v5 | 🔴 CRITICAL |
| `@mui/material` | — | **^5.15.0** | MUI v5 (styled-engine, theme v5) | 🔴 CRITICAL |
| `@mui/icons-material` | — | **^5.15.0** | MUI v5 icons | 🔴 HIGH |
| CRA (react-scripts) | 5.0.1 | **Vite** | 10x faster dev server, native ESM | 🔴 HIGH |
| `jest` (standalone) | Bundled | **^29.7.0** | Latest features (after Vite or CRA eject) | 🟡 MEDIUM |

**Estimated Effort:**
- React 18: 8-12 hours + QA
- MUI v5: 20-30 hours + QA
- Vite migration: 12-16 hours + testing
- **Total P2:** 40-60 hours minimum

**See [node-upgrade-plan.md](./node-upgrade-plan.md) Section 2.2.4 for P2 detailed plan.**

---

## Compatibility Notes

### Peer Dependency Warnings (Expected After P0)

After running P0 upgrades, you may see peer dependency warnings like:

```
npm WARN @storybook/react@6.5.16 requires a peer of react@^16.8.0 || ^17.0.0 but react@17.0.0 is installed
```

**Action:** Safe to ignore during P0/P1. Will resolve in P2 when React 18 is upgraded.

### Webpack 5 Migration (react-scripts 4 → 5)

**What Changed:**
- No automatic Node.js polyfills (crypto, buffer, process, etc.)
- Stricter module resolution
- New cache system
- Asset modules instead of file-loader/url-loader

**Impact on This Project:**
- **Low Risk** — No custom webpack config detected
- If build errors occur related to Node polyfills, add `node-polyfill-webpack-plugin` temporarily

### Jest 24 → 27 (Bundled with react-scripts 5)

**What Changed:**
- `testURL` removed (use `testEnvironmentOptions.url`)
- `extraGlobals` removed
- Improved async handling
- Better error messages

**Impact on This Project:**
- **Low Risk** — Only 4 test files; likely no custom Jest config
- Tests should run without changes

---

## Version Pinning Strategy

**P0 Packages:** Use exact versions for stability
```json
"sass": "1.77.0",
"react-scripts": "5.0.1"
```

**P1 Packages:** Use caret ranges for patch updates
```json
"socket.io-client": "^4.7.0",
"date-fns": "^3.3.0"
```

**Rationale:**
- P0 is critical path; avoid surprise updates
- P1 packages are mature; safe to accept patches

---

## Installation Size Impact

### Before (Estimated)

```
node_modules/: ~1.2 GB
package-lock.json: ~8 MB
Production bundle (gzipped): ~2 MB
```

### After P0

```
node_modules/: ~1.1 GB (sass smaller than node-sass)
package-lock.json: ~10 MB (lockfile v3 more verbose)
Production bundle (gzipped): ~1.9 MB (webpack 5 tree-shaking)
```

### After P1

```
node_modules/: ~800 MB (removed moment, polyfills, redux-saga)
package-lock.json: ~9 MB
Production bundle (gzipped): ~1.3 MB (600 KB reduction)
```

### After P2 (Projected)

```
node_modules/: ~600 MB (Vite has fewer deps than CRA)
package-lock.json: ~7 MB
Production bundle (gzipped): <500 KB (aggressive code-splitting)
```

---

## Security Audit Report

### Before Upgrades

```bash
npm audit --production
```

**Expected Output:**
```
found 15 vulnerabilities (8 moderate, 5 high, 2 critical)
```

**Critical:**
- `axios@0.18.1` — CVE-2020-28168 (SSRF), CVE-2021-3749 (ReDoS)

**High:**
- `socket.io-client@2.3.0` — Prototype pollution
- Various transitive dependencies via old packages

### After P0

```
found 8 vulnerabilities (6 moderate, 2 high, 0 critical)
```

**Critical:** 0 ✅

### After P1

```
found 0 vulnerabilities ✅
```

**Target:** Zero HIGH/CRITICAL vulnerabilities

---

## Rollback Package Versions (Emergency Use)

If upgrades cause production issues, revert to these exact versions:

```json
{
  "dependencies": {
    "axios": "0.18.1",
    "node-sass": "4.13.1",
    "react-scripts": "4.0.0"
  },
  "devDependencies": {
    "jest": "24.9.0",
    "@testing-library/react": "9.3.1",
    "@storybook/react": "6.1.6",
    "@storybook/addon-actions": "6.1.6",
    "@storybook/addon-links": "6.1.6"
  }
}
```

**Rollback Command:**
```bash
git checkout backup/pre-node24-upgrade -- package.json
npm ci
```

**WARNING:** This will revert to Node 12 compatibility; only use as last resort.

---

## CI/CD Updates Required

**GitHub Actions** (`.github/workflows/*.yml`):

```diff
- uses: actions/setup-node@v3
  with:
-   node-version: '12'
+   node-version: '24'
```

**Dockerfile-based CI:**

```diff
- FROM node:12-alpine
+ FROM node:24-alpine
```

**Netlify/Vercel:**

Project Settings → Environment Variables:
```
NODE_VERSION=24.12.0
```

---

## Testing Strategy per Upgrade

### P0 Testing

**Automated:**
- [ ] `npm ci` (install)
- [ ] `npm run build` (production build)
- [ ] `npm test` (test suite)
- [ ] `npm run storybook` (Storybook build)

**Manual:**
- [ ] Login page loads
- [ ] Form inputs work
- [ ] Dev server runs without errors

**Time:** ~30 minutes

---

### P1 Testing

**Automated:**
- [ ] `npm audit --production` (security)
- [ ] Bundle size comparison
- [ ] All P0 tests pass

**Manual:**
- [ ] WebSocket connection + reconnection
- [ ] Real-time notifications
- [ ] Chart rendering
- [ ] Date formatting accuracy
- [ ] Form validation
- [ ] Language switching

**Time:** ~2 hours per PR

---

## Reference Commands

### Check Current Versions

```bash
npm list react react-dom axios node-sass react-scripts --depth=0
```

### Check Node/npm Versions

```bash
node --version
npm --version
```

### Check for Outdated Packages

```bash
npm outdated
```

### Check Security Vulnerabilities

```bash
npm audit
npm audit --production
npm audit --audit-level=high
```

### Analyze Bundle Size

```bash
npm run build
du -sh build/static/js/*.js | sort -h
```

### Find Package Usage in Code

```bash
# Example: Find all axios imports
grep -r "from 'axios'" src/

# Example: Find moment usage
grep -r "moment(" src/ --include="*.js" --include="*.jsx"
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-06  
**Next Review:** After P0 deployment
