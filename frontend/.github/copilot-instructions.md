# Copilot Instructions for Learlify Frontend

## Goal

This repository is a large React 17 single-page application built on top of Create React App. Copilot should optimize for consistency with the current architecture, not for introducing a new stack.

Prefer incremental changes that fit the existing project style.

## Current Stack

- React 17 with function components and hooks
- `react-router-dom` v5 (`BrowserRouter`, `Switch`, `Route`, `Redirect`)
- Redux Toolkit for the main global state pattern
- `createAsyncThunk` for async flows
- Custom HTTP wrapper in `src/providers/http`
- JavaScript with JSDoc typing, not TypeScript
- i18next for translations
- Mixed styling system: SCSS modules, global CSS/SCSS, `styled-components`, and Material UI v4

## Architecture Snapshot

Application bootstrap:

- `src/index.js` mounts Redux, i18n, global CSS, polyfills, service worker, and `App`
- `src/App.js` bootstraps authenticated app data and wraps the tree with `Stripe`, `WebSockets`, and `EventSource`
- `src/components/Root.js` owns the router tree
- `src/router/index.js` declares route configuration
- `src/utils/path.js` is the source of truth for route constants

Main architectural style:

- The codebase is layer-based, not feature-sliced
- Route screens live in `src/views`
- Shared UI lives in `src/components`
- Cross-cutting hooks live in `src/hooks`
- Server access lives in `src/api`
- Global Redux state lives mostly in `src/store/@reducers`, `src/store/@thunks`, `src/store/@selectors`, and `src/store/@controllers`
- Local or view-scoped state machines live in `src/state`

## Preferred Data Flow

For new server-backed domains, follow this path:

1. Add HTTP functions in `src/api/<domain>.js`
2. Add async thunks in `src/store/@thunks/<domain>.js`
3. Put fulfilled/pending/rejected mutation logic in `src/store/@controllers/<domain>.js`
4. Register slice state in `src/store/@reducers/<domain>.js`
5. Expose memoized selectors from `src/store/@selectors/<domain>.js`
6. Create a hook facade like `src/hooks/use<Domain>.js` when it improves reuse
7. Consume the hook or selector from `src/views/<feature>` or shared components

Keep side effects out of components when they clearly belong in `api` or `thunk` layers.

## Folder Responsibilities

- `src/views`: route-level screens and feature-specific UI composition
- `src/components`: reusable presentational and container-like UI pieces
- `src/hooks`: reusable React hooks, including Redux consumer hooks
- `src/api`: network calls only; use `providers/http`
- `src/store/@reducers`: Redux Toolkit slices per domain
- `src/store/@thunks`: async actions using `createAsyncThunk`
- `src/store/@controllers`: reusable case reducers for slice transitions
- `src/store/@selectors`: memoized selectors for the active Redux pattern
- `src/state`: local reducers/state machines, often used with `useReducer` or React context
- `src/providers`: global integration layers such as sockets, event streams, and HTTP
- `src/lang`: i18n resources and locale composition
- `src/modules` and `src/utils`: pure helpers and domain logic utilities

## Conventions to Preserve

- Use absolute imports from `src` when crossing modules. `jsconfig.json` sets `baseUrl: "src"`.
- Keep route definitions centralized. If a new page is added, update both `src/utils/path.js` and `src/router/index.js`.
- Prefer function components and hooks.
- Reuse existing HOCs only when the concern already exists there, especially `withVerification` and `withModels`.
- Keep components in PascalCase, hooks in `useX` format, and domain store files named by resource (`courses`, `models`, `plans`, etc.).
- Keep JSDoc annotations where the file already uses them.
- Use translation keys for user-facing copy. Do not hardcode strings if the surrounding feature already uses `useTranslation` or `lang.t(...)`.
- When a view already uses `Template`, keep using `Template` as the page shell instead of inventing a new layout wrapper.

## Styling Rules

This project intentionally mixes styling approaches. Follow the local pattern of the file or feature you are editing.

- If the feature uses `*.module.scss`, continue with CSS modules there
- If the feature uses `styles.js` or `styled-components`, stay with that pattern locally
- If the feature uses Material UI v4 components and `makeStyles`, do not migrate it to a different UI library during a normal change
- Do not introduce a brand new styling system into an existing feature

## Routing Rules

- This app uses React Router v5
- Use `Switch`, `Route`, `Redirect`, `useHistory`, and similar v5 APIs
- Do not generate React Router v6 code such as `Routes` or `useNavigate`
- Private access is handled with `src/components/PrivateRoute.js`

## State Management Rules

- The dominant async pattern is `createAsyncThunk`, not sagas
- `redux-saga` middleware exists in the store, but there are no active sagas in `src`
- Do not introduce saga-based flows unless explicitly requested
- Do not introduce RTK Query by default even though related dependencies exist
- Prefer the active `src/store/@selectors` pattern over legacy selector helpers
- Keep shared async state in Redux only when multiple screens/components need it; otherwise keep local state in hooks or `src/state`

## Legacy Areas and Caution

This repository contains older and newer patterns side by side.

- `src/store/reducers`, `src/store/actions`, and `src/store/selectors/hooks.js` still power some legacy flows like `session`, `http`, and parts of notifications
- Some older helpers reference outdated state shapes; verify the actual reducer shape before copying patterns from legacy files
- When extending an already-legacy flow, stay compatible with that flow instead of half-migrating it
- For new global domains, prefer the `@reducers` + `@thunks` + `@selectors` pattern

## API and Side-Effect Rules

- Prefer `src/api/*` plus `src/providers/http/index.js` for HTTP access
- Reuse the existing `httpClient` options pattern: `endpoint`, `method`, `queries`, `params`, `requiresAuth`, `signal`
- Thread `AbortSignal` through long-running async requests when the surrounding feature already supports cancellation
- Abort outstanding dispatched thunks on unmount when the calling component keeps a handle to the promise
- Avoid raw `fetch` inside views unless the existing feature already uses a direct external resource download pattern

## Forms, Validation, and UX

- Simple forms often use `src/hooks/useForm.js`
- Keep validators close to the feature, for example `src/views/<feature>/validation`
- Surface request errors with the existing toast/error flows instead of inventing a second notification system
- Reuse existing loading states and `FallbackMode`/`Template` loader patterns

## Testing Guidance

- Existing tests are mostly Jest tests under `src/tests`
- Favor tests for pure utilities, selectors, reducers, and isolated domain logic
- Avoid proposing large testing-framework changes unless explicitly requested

## What Copilot Should Avoid

- Do not convert files to TypeScript unless asked
- Do not propose React Router v6 APIs
- Do not replace the store with Zustand, MobX, or a new architecture
- Do not migrate styling libraries during feature work
- Do not bypass i18n for new UI text
- Do not scatter API calls directly inside presentational components
- Do not assume old legacy property names are still correct without checking the active slice

## Default Recipe for New Work

When adding a new feature, prefer this checklist:

1. Add or extend route constants if the feature is routable
2. Add API client functions in `src/api`
3. Add `createAsyncThunk` actions in `src/store/@thunks`
4. Add or extend slice state in `src/store/@reducers`
5. Add selectors in `src/store/@selectors`
6. Add a hook facade in `src/hooks` if the feature will be consumed from multiple components
7. Build or extend the route view in `src/views`
8. Reuse `Template`, existing error/loading patterns, and translations
9. Add targeted tests for any pure logic introduced

## Specialized Agents & Customizations

This project has specialized agents for design system and frontend work. Use them for focused tasks:

### Design System Guardian (`@design-system-guardian`)

Frontend Design System Architect that protects visual consistency, component reusability, and design system governance.

**Use when:**

- Creating or modifying UI components
- Refactoring visual code
- Implementing design tokens
- Ensuring visual consistency across screens
- Dark mode support
- Preventing UI duplication and debt

**Not for:** Backend logic, Redux state, API calls, routing

### Accessibility Auditor (`@accessibility-auditor`)

WCAG 2.1 AA specialist for auditing accessibility compliance.

**Use when:**

- Auditing components for a11y
- Checking ARIA attributes
- Validating keyboard navigation
- Analyzing color contrast
- Reviewing semantic HTML
- Screen reader compatibility

**Read-only:** Does not edit files, only audits and recommends

### Token Manager (`@token-manager`)

Design token specialist for managing color, spacing, typography, and radius tokens.

**Use when:**

- Creating design tokens
- Refactoring hardcoded values
- Defining dark mode token strategy
- Managing color/spacing/typography scales
- Token naming conventions

### Component Scaffold (`/component-scaffold`)

Skill for generating complete component structure with tests, styles, and documentation.

**Use when:**

- Creating new shared components
- Need boilerplate with best practices
- Generating component with tests and docs

**Generates:**

- Component file with JSDoc
- CSS Module with design tokens
- Jest test suite
- README documentation
- Barrel export

### Automatic Instructions

React component guidelines automatically apply when working on files in:

- `src/components/**/*.{js,jsx}`
- `src/views/**/*.{js,jsx}`

No invocation needed. Rules enforce design system, accessibility, and dark mode support.

For details, see `.github/agents/README.md`

## Short Summary

Copilot should treat this codebase as a JavaScript React 17 monolith with a layered architecture, Redux Toolkit domain slices, centralized routing, reusable hooks, and mixed but locally consistent styling. Favor compatibility, small surface-area changes, and the existing `api -> thunk -> controller -> reducer -> selector -> hook -> view` pattern.
