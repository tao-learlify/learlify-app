import React, { memo } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { Badge } from 'components/ui'
import styles from './PracticeModelBadge.module.scss'

/**
 * Centralized visual + semantic mapping for practice model names.
 * Source of truth for badge variant, display label, and model code.
 *
 * Keys match backend `exam_models.name` values exactly:
 *   'Aptis'  (backend: metadata/models.ts → Models.APTIS = 'Aptis')
 *   'IELTS'  (backend: metadata/models.ts → Models.IELTS = 'IELTS')
 *
 * Add new models here — components don't need to change.
 */
export const PRACTICE_MODEL_META = {
  Aptis: {
    code: 'APTIS',
    label: 'APTIS',
    badgeVariant: 'success' // emerald/green — var(--color-success-bg) / var(--color-success-text)
  },
  IELTS: {
    code: 'IELTS',
    label: 'IELTS',
    badgeVariant: 'info' // sky/blue — var(--color-info-bg) / var(--color-info-text)
  }
}

/**
 * PracticeModelBadge — Reusable badge for the user's active practice model.
 *
 * Source: Redux `state.models.models.selected` (set from JWT / API on login).
 * DO NOT infer the model from plan name or subscription data.
 *
 * @param {{
 *   model: { id: number, name: string } | null | undefined,
 *   showPrefix?: boolean,
 *   showChevron?: boolean,
 *   onClick?: () => void,
 *   className?: string
 * }} props
 */
const PracticeModelBadge = memo(function PracticeModelBadge({
  model,
  showPrefix = false,
  showChevron = false,
  onClick,
  className
}) {
  if (!model?.name) return null

  const meta = PRACTICE_MODEL_META[model.name]
  if (!meta) return null

  const label = showPrefix ? `Practicing: ${meta.label}` : meta.label
  const isClickable = Boolean(onClick)

  if (isClickable) {
    return (
      <button
        type="button"
        className={styles.trigger}
        onClick={onClick}
        aria-label={`Current practice model: ${meta.label}. Click to change.`}
      >
        <Badge variant={meta.badgeVariant} dot className={className}>
          {label}
        </Badge>
        {showChevron && (
          <CaretDown
            size={12}
            weight="bold"
            className={styles.chevron}
            aria-hidden="true"
          />
        )}
      </button>
    )
  }

  return (
    <Badge variant={meta.badgeVariant} dot className={className}>
      {label}
    </Badge>
  )
})

export default PracticeModelBadge
export { PracticeModelBadge }
