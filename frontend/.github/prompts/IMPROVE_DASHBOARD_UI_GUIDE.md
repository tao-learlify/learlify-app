# Improve Dashboard UI — Prompt Usage Guide

## Quick Start

**Location:** `.github/prompts/improve-dashboard-ui.prompt.md`

**How to invoke:**
1. Chat: Type `/` → Select "Improve Dashboard UI"
2. Or: `Chat: Run Prompt...` → Search for "Improve Dashboard UI"
3. Provide component file path as argument

---

## Example Invocations

### Example 1: Improve WelcomeHeader Component
```
/Improve Dashboard UI
src/views/dashboard/components/WelcomeHeader.js
```

**What the prompt will deliver:**
- Replace gray backgrounds with vibrant gradient
- Update text colors from #666 to primary/secondary tokens
- Add shadow depth for elevation
- Enhance streak/XP badges with accent colors
- Ensure dark mode compatibility

---

### Example 2: Enhance Entire Dashboard
```
/Improve Dashboard UI
src/views/dashboard/UserView.js
```

**Scope:** Will analyze and improve:
- WelcomeHeader styling
- LearningPath visual design
- Card colors and backgrounds
- Progress bar gradients
- All nested components

---

## What Gets Improved

| Before | After |
|--------|-------|
| Gray (#f5f5f5) backgrounds | Subtle gradient or accent backgrounds |
| Black (#000) text on gray | Semantic color hierarchy with tokens |
| Flat 1px borders | Elevated cards with shadow depth |
| Monochrome icons | Colored icons matching context |
| No visual feedback | Smooth hover/active transitions |

---

## Design System Integration

The prompt uses your existing design tokens from `src/design-system/tokens.css`:

```css
/* Examples of tokens applied */
--color-primary: #2563eb;        /* Blue for primary actions */
--color-success: #10b981;        /* Green for completed states */
--color-warning: #f59e0b;        /* Amber for pending/caution */
--color-surface: #f3f4f6;        /* Light background */
--color-neutral-600: #4b5563;    /* Dark text */

/* Gradients added dynamically */
linear-gradient(135deg, var(--color-primary), var(--color-indigo))
```

---

## Output Includes

1. ✅ **Updated Component** with improved styling
2. ✅ **CSS Module (.module.scss)** with color scheme
3. ✅ **Token Mapping** documentation
4. ✅ **Responsive Design** preserved
5. ✅ **Dark Mode** variants
6. ✅ **Accessibility** (WCAG AA)

---

## When to Use This Prompt

- Dashboard components look too gray/monochrome
- Want to add visual hierarchy with color
- Need to match design system tokens
- Creating professional, modern UI
- Improving user engagement through visual feedback

---

## Related Customizations

Once you use this prompt, consider creating:

### 1. Improve Form UI
Specialized prompt for forms, inputs, and validation states

### 2. Add Dark Mode
Ensure all components work in dark theme

### 3. Component Animation Suite
Add micro-interactions and transitions

---

## Tips

- **Start small**: Test with a single component (e.g., WelcomeHeader)
- **Review tokens**: Check `src/design-system/tokens.css` before running
- **Test dark mode**: Verify colors in `[data-theme="dark"]` context
- **Check contrast**: Use browser DevTools to verify WCAG AA (4.5:1)
- **Iterate**: Run multiple times on different components for consistency

---

## Support

If the Design System Guardian agent needs more context:
- Provide a screenshot of the current component
- Specify which components to prioritize
- Mention any brand color preferences
- Clarify if this is light/dark mode focused
