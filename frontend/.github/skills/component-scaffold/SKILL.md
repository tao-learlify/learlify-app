---
name: component-scaffold
description: 'Scaffold React component with complete folder structure. Use when creating new shared components, generating component boilerplate, setting up component tests, creating component documentation, initializing component with best practices.'
argument-hint: 'Component name to scaffold'
---

# Component Scaffold

Generate complete component folder structure following project conventions and design system principles.

## When to Use

- Creating a new shared component in `src/components/`
- Need complete setup: component + styles + tests + documentation
- Want to start with best practices baked in
- Generating primitive or shared component (not feature-specific)

## What Gets Generated

```
src/components/{ComponentName}/
├── index.js                 # Barrel export
├── {ComponentName}.js       # Main component with JSDoc
├── {ComponentName}.module.scss  # Scoped styles using tokens
├── {ComponentName}.test.js  # Jest test suite
└── README.md               # Component documentation
```

## Configuration

Before scaffolding, ask the user:

1. **Component name** (PascalCase, e.g., "Badge", "AlertCard")
2. **Component type:**
   - `primitive` - Base building blocks (Button, Input, Card)
   - `shared` - Composed reusable components (UserCard, CourseHeader)
3. **Props needed:**
   - Core props (required and optional)
   - Variants (if any)
   - Size options (if any)
4. **Styling approach:**
   - CSS Modules (recommended for new components)
   - Styled Components (if existing pattern in similar components)
   - Material UI (if extending existing MUI components)

## Generation Procedure

### Step 1: Gather Requirements

Ask:

- "What is the component name?" (validate PascalCase)
- "What props will it accept?" (list with types)
- "Does it need variants?" (primary/secondary, etc.)
- "Does it need size options?" (sm/md/lg)
- "Should it support children/composition?"

### Step 2: Create Folder Structure

```bash
mkdir -p src/components/{ComponentName}
```

### Step 3: Generate Files

Use templates from [./assets/](./assets/):

- [component-template.js](./assets/component-template.js) - Main component
- [styles-template.module.scss](./assets/styles-template.module.scss) - CSS Module
- [test-template.js](./assets/test-template.js) - Jest tests
- [readme-template.md](./assets/readme-template.md) - Documentation

### Step 4: Customize Templates

Replace placeholders:

- `{ComponentName}` → Actual component name
- `{props}` → Defined props with JSDoc
- `{variants}` → Variant options (if any)
- `{sizes}` → Size options (if any)

### Step 5: Validate

Check:

- [ ] Uses semantic tokens (no hardcoded colors)
- [ ] Has dark mode support
- [ ] Includes accessibility attributes
- [ ] Props have default values
- [ ] JSDoc comments complete
- [ ] Test file has basic test cases
- [ ] README documents usage

### Step 6: Final Output

Provide:

1. List of files created
2. Usage example
3. Next steps (import in parent component, add to Storybook if used, etc.)

## Template Variables

Templates support these replacements:

- `{ComponentName}` - Component name (PascalCase)
- `{componentName}` - Component name (camelCase)
- `{description}` - Brief component description
- `{props}` - Props list with JSDoc
- `{variants}` - Variant definitions
- `{sizes}` - Size definitions
- `{hasChildren}` - Boolean flag for children support

## Design System Checklist

Every scaffolded component must:

- ✅ Use semantic color tokens
- ✅ Use spacing tokens from system
- ✅ Use radius tokens (no arbitrary border-radius)
- ✅ Support dark mode via CSS variables
- ✅ Include focus-visible styles
- ✅ Have proper semantic HTML
- ✅ Include ARIA attributes where needed
- ✅ Document variants and props
- ✅ Include basic tests
- ✅ Have accessible examples

## Example Usage

**User request:**
"Scaffold a Badge component with variants: success, warning, danger, info. Size options: sm, md."

**Steps:**

1. Create `src/components/Badge/` folder
2. Generate Badge.js with variant and size props
3. Generate Badge.module.scss with token-based styles
4. Generate Badge.test.js with variant tests
5. Generate README.md with usage examples
6. Create index.js barrel export

**Output:**

```jsx
// Usage example
import Badge from 'src/components/Badge';

<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger" size="md">Failed</Badge>
```

## Anti-patterns to Avoid

- ❌ Don't scaffold feature-specific components to `src/components/` (keep in views)
- ❌ Don't include hardcoded colors in templates
- ❌ Don't skip accessibility attributes
- ❌ Don't generate components without tests
- ❌ Don't create components without checking if similar exists

## Post-Scaffold Tasks

After scaffolding, remind the user to:

1. Import component where needed
2. Add to Storybook (if project uses it)
3. Update design system documentation
4. Consider if it should replace any existing similar components
5. Review with team for consistency
6. Add to component library index if exists

## Notes

- Always check if similar component exists before scaffolding
- Prefer extending existing components over creating new ones
- Keep components focused (single responsibility)
- Document edge cases and limitations
- Include dark mode in initial implementation, not as afterthought
