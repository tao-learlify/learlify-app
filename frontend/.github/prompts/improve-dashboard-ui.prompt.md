---
description: "Improve dashboard component UI with professional colors, gradients, and visual hierarchy — enhance grays with vibrant accents, improve spacing, and modernize visual design"
name: "Improve Dashboard UI"
argument-hint: "Component file path (e.g., src/views/dashboard/components/WelcomeHeader.js)"
agent: "Design System Guardian"
---

# Improve Dashboard Component UI

## Objective
Transform a dashboard component from functional but visually gray to **professional, modern, and vibrant** — using color theory, design tokens, gradients, and visual hierarchy.

## Input
Provide the **file path** or **component name** to improve (e.g., `src/views/dashboard/components/WelcomeHeader.js`).

## Improvements to Apply

### 1. **Color Palette Enhancement**
- Replace grays (#ccc, #999, #f5f5f5) with **semantic color tokens**:
  - Primary actions: vibrant blue/indigo accents
  - Success states: green gradients  
  - Warnings/pending: amber/orange tones
  - Secondary elements: muted purples/teals
- Use the project's existing design tokens from `src/design-system/tokens.css`
- Apply CSS variables instead of hardcoded hex values

### 2. **Gradients & Visual Interest**
- Add subtle gradients to cards, buttons, and headers
- Use linear gradients for progress bars and CTAs
- Apply radial gradients to badge backgrounds
- Maintain accessibility: ensure 4.5:1 contrast ratio

### 3. **Visual Hierarchy**
- Increase font weight contrast between titles and body text
- Use color saturation to guide attention to key interactions
- Apply depth via shadows (elevation levels)
- Improve spacing consistency (8px grid)

### 4. **Modern Styling Techniques**
- Add hover/active states with smooth transitions
- Use backdrop-filter for frosted glass effects (optional)
- Implement rounded corners (8-12px for cards, 4-6px for inputs)
- Add subtle animations for micro-interactions (0.2s ease-out)

### 5. **Dark Mode Readiness**
- Ensure colors work in both light and dark themes
- Use CSS variables with dark mode variants
- Test contrast in `[data-theme="dark"]` context

## Output Format

Provide:
1. **Updated component file** with improved styling (CSS modules or styled-components)
2. **New or updated CSS module** with professional color scheme
3. **Design token mapping** explaining which tokens were used
4. **Before/After visual guide** showing the transformation

## Design System Context
This project uses:
- **Styling**: CSS Modules (.module.scss), styled-components, Material UI v4
- **Design Tokens**: CSS variables in `src/design-system/tokens.css`
- **Color System**: Semantic tokens (primary, success, warning, error, neutral)
- **Typography**: 14-18px body, 20-32px headings
- **Spacing**: 8px grid (8, 16, 24, 32, 48px)
- **Icons**: Phosphor Icons (@phosphor-icons/react)

## Success Criteria
- ✅ Component is visually modern and professional
- ✅ Colors are vibrant but not overwhelming
- ✅ Typography hierarchy is clear
- ✅ Spacing is consistent
- ✅ Accessibility maintained (WCAG AA)
- ✅ Responsive design preserved
- ✅ Dark mode support included
- ✅ No gray-on-gray or low-contrast areas
