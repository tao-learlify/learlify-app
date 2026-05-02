import React, { memo, forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

/**
 * Input — Unified text input for the design system.
 *
 * Replaces:
 * - assets/css/input.css + .input-first/.input-last classes
 * - Bootstrap .form-control with autofill and focus overrides
 * - Select.js styled-component (for text inputs)
 *
 * @param {string}   label       - Visible label text
 * @param {string}   error       - Error message (shows error state on input)
 * @param {string}   hint        - Helper text shown below input
 * @param {'sm'|'md'} size       - Input height variant
 * @param {boolean}  required    - Adds * marker to label
 * @param {string}   className   - Applied to the wrapper
 * @param {string}   inputClass  - Applied directly to the <input>
 *
 * All standard <input> props (value, onChange, type, placeholder, disabled,
 * readOnly, autoComplete, etc.) are forwarded to the native element.
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={e => setEmail(e.target.value)}
 *   error={errors.email}
 *   hint="We'll never share your email"
 * />
 */
const Input = memo(
  forwardRef(function Input(
    {
      label,
      error,
      hint,
      size = 'md',
      required = false,
      className,
      inputClass,
      id: externalId,
      ...inputProps
    },
    ref
  ) {
    const generatedId = `input-${Math.random().toString(36).substr(2, 9)}`
    const id = externalId || generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const describedBy =
      [error ? errorId : null, hint ? hintId : null]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div className={clsx(styles.wrapper, className)}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={clsx(
            styles.input,
            styles[size],
            error && styles.inputError,
            inputClass
          )}
          {...inputProps}
        />

        {error && (
          <span id={errorId} className={styles.errorMsg} role="alert">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={hintId} className={styles.hint}>
            {hint}
          </span>
        )}
      </div>
    )
  })
)

export default Input
export { Input }
