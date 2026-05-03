import React, { memo, forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

/**
 * Button — Unified button component for the design system.
 *
 * Replaces:
 * - src/components/Button.js (styled-components, amber color, 3D border)
 * - .btnPrimary / .btnSecondary copy-pasted across settings SCSS modules
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'}                          size
 * @param {boolean}                                 disabled
 * @param {boolean}                                 loading    - Shows spinner
 * @param {boolean}                                 fullWidth
 * @param {'button'|'submit'|'reset'}               type
 * @param {function}                                onClick
 * @param {string}                                  className
 * @param {React.ReactNode}                         children
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleSave}>Save changes</Button>
 * <Button variant="secondary" loading={saving}>Saving...</Button>
 * <Button variant="ghost" size="sm">Cancel</Button>
 */
const Button = memo(forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    chunky = false,
    type = 'button',
    onClick,
    className,
    children,
    /* ── backward compat: styled/index.js Button props ── */
    background,
    color,
    border,
    hoverBackgroundColor,
    block,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading

  /* Build inline overrides for legacy styled-Button colour props */
  const inlineStyle = {}
  if (background) inlineStyle.backgroundColor = background
  if (color) inlineStyle.color = color
  if (border) inlineStyle.borderColor = border
  if (hoverBackgroundColor) {
    inlineStyle['--btn-hover-bg'] = hoverBackgroundColor
  }

  /* Map legacy Bootstrap props */
  const resolvedVariant =
    variant === 'outline-info' ? 'secondary' :
    variant === 'dark' ? 'primary' :
    variant

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
      className={clsx(
        styles.btn,
        styles[resolvedVariant],
        styles[size],
        chunky && styles.chunky,
        loading && styles.loading,
        disabled && styles.disabled,
        (fullWidth || block) && styles.fullWidth,
        className
      )}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.loadingText : undefined}>
        {children}
      </span>
    </button>
  )
}))

export default Button
export { Button }
