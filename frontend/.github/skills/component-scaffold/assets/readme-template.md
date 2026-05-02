# {ComponentName}

{description}

## Usage

```jsx
import {ComponentName} from 'src/components/{ComponentName}';

function Example() {
  return (
    <{ComponentName} variant="primary" size="md">
      Content here
    </{ComponentName}>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual variant of the component |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the component |
| `children` | `ReactNode` | - | Content to render inside the component |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |

## Variants

### Primary
Primary variant with prominent visual treatment.

```jsx
<{ComponentName} variant="primary">Primary</{ComponentName}>
```

### Secondary
Secondary variant with less visual weight.

```jsx
<{ComponentName} variant="secondary">Secondary</{ComponentName}>
```

### Tertiary
Tertiary variant with minimal visual treatment.

```jsx
<{ComponentName} variant="tertiary">Tertiary</{ComponentName}>
```

## Sizes

```jsx
<{ComponentName} size="sm">Small</{ComponentName}>
<{ComponentName} size="md">Medium</{ComponentName}>
<{ComponentName} size="lg">Large</{ComponentName}>
```

## Accessibility

- Uses semantic HTML elements
- Includes proper ARIA attributes where needed
- Supports keyboard navigation
- Maintains sufficient color contrast (WCAG AA)
- Provides visible focus indicators

## Dark Mode

This component uses semantic design tokens and automatically adapts to dark mode.

## Design Tokens Used

- Colors: `--color-bg-surface`, `--color-text-primary`, `--color-border-default`
- Spacing: `--spacing-sm`, `--spacing-md`, `--spacing-lg`
- Border radius: `--radius-md`
- Typography: `--font-size-md`, `--font-weight-normal`

## Notes

- Component uses CSS Modules for scoped styling
- All colors use semantic tokens for theme consistency
- Spacing follows the design system scale
- Fully responsive and mobile-friendly
