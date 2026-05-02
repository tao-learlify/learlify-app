---
description: 'Use when creating, modifying, or refactoring React components. Enforces design system consistency, component reusability, dark mode support, accessibility standards, and prevents visual debt.'
applyTo:
  [
    'src/components/**/*.js',
    'src/components/**/*.jsx',
    'src/views/**/*.js',
    'src/views/**/*.jsx'
  ]
---

# React Component Guidelines

## Pre-Flight Checks (MANDATORY)

Before creating or modifying any component:

1. **Search for existing patterns** - Check if a similar component exists
2. **Evaluate reusability** - Can this extend an existing component?
3. **Identify abstraction level** - Primitive / Shared / Feature-specific / Local?
4. **Verify design system alignment** - Uses tokens, spacing, radius, typography?
5. **Dark mode compatibility** - Uses semantic tokens or theme variables?
6. **Accessibility validation** - Contrast, focus, keyboard, ARIA, semantics?

## Design System Rules

### ✅ DO

- Use semantic color tokens: `color-action-primary`, `color-bg-surface`, `color-text-secondary`
- Use spacing from system (multiples of base unit, e.g., 4px, 8px, 16px, 24px, 32px)
- Use defined border radius values (pill for CTAs, generous for cards, soft for inputs)
- Maintain visual personality: clear, friendly, rounded, optimistic, motivating
- Compose from existing primitives when possible
- Keep props semantic and minimal
- Define clear variants (size, variant, state)
- Support both light and dark themes
- Ensure accessible contrast ratios (WCAG AA minimum: 4.5:1 for text, 3:1 for UI components)
- Provide visible focus indicators
- Use proper semantic HTML elements

### ❌ DO NOT

- Hardcode hex/rgb colors directly in components (use tokens)
- Use arbitrary spacing values (3px, 7px, 13px, 21px)
- Create radius values without system justification
- Add custom shadows without defined elevation system
- Use inline styles for theme-dependent values
- Create `ComponentV2`, `NewComponent`, `ComponentAlt` without architectural reason
- Duplicate similar components across features
- Mix too many styling approaches in one component
- Ignore dark mode during implementation
- Skip accessibility attributes (aria-\*, role, alt, labels)
- Create inaccessible touch targets (<44x44px)
- Use color alone to convey state

## Component Structure Pattern

```jsx
/**
 * Brief description of component purpose
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'tertiary'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 */
function ComponentName({ variant = 'primary', size = 'md', ...props }) {
  // Implementation
}
```

## Naming Conventions

- Components: `PascalCase`
- Props: `camelCase`
- Variants: semantic names (`primary`, `secondary`, not `blue`, `big`)
- Boolean props: `is*`, `has*`, `should*` prefixes
- Event handlers: `on*` prefixes

## Accessibility Checklist

- [ ] Proper semantic HTML (`<button>`, `<nav>`, `<main>`, not `<div onClick>`)
- [ ] ARIA attributes where needed (`aria-label`, `aria-describedby`, `role`)
- [ ] Keyboard navigation support (tab order, Enter/Space on interactive elements)
- [ ] Focus visible and clear (`:focus-visible` with outline or ring)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI components)
- [ ] Touch targets ≥ 44x44px for mobile
- [ ] Alt text for images
- [ ] Form labels properly associated
- [ ] State changes announced to screen readers when relevant

## Dark Mode Pattern

Use CSS custom properties or theme context, never hardcoded colors:

```jsx
// ✅ GOOD - Uses semantic token
<div style={{ backgroundColor: 'var(--color-bg-surface)' }} />

// ❌ BAD - Hardcoded color
<div style={{ backgroundColor: '#FFFFFF' }} />
```

## When to Abstract

| Scenario                                | Action                                 |
| --------------------------------------- | -------------------------------------- |
| Used in 1 place only                    | Keep local                             |
| Used in 2-3 places in same feature      | Extract to feature-level component     |
| Used across multiple features           | Extract to `src/components/` as shared |
| Extremely generic (Button, Input, Card) | Consider primitive component           |
| Just a style variation                  | Add variant prop to existing component |

## Red Flags to Raise

If you see any of these patterns, **stop and refactor**:

- Multiple components with `Custom`, `New`, `V2`, `Alt` suffixes
- Copy-pasted component code with minor changes
- Hardcoded colors, spacing, or radius outside of token definitions
- Missing dark mode support
- Inaccessible focus states
- Interactive divs instead of buttons
- Missing keyboard support
- Insufficient color contrast
- Inconsistent spacing or typography across similar components

## Validation Before Committing

Ask yourself:

1. Does this component already exist?
2. Could this be a variant of an existing component?
3. Are all colors using semantic tokens?
4. Does it work in dark mode?
5. Is it keyboard accessible?
6. Does it maintain visual consistency with the rest of the app?
7. Will this scale to other use cases or is it too specific?
