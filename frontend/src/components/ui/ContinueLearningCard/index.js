import React, { memo } from 'react'
import diamondSrc from 'assets/svg/diamond.svg'
import styles from './ContinueLearningCard.module.scss'
import clsx from 'clsx'
import { Button } from 'components/ui/Button'
/**
 * ContinueLearningCard — Dashboard hero card.
 *
 * Visual source of truth: code.html "Main Path Card"
 * Layout: flex-row — teal icon container (left, 192px²) + content (right).
 * Uses duo-card style: 2px border + chunky 4px bottom shadow + radius-4xl.
 * Chunky primary CTA button with press animation.
 *
 * @param {string}   title            - Course/unit title ("Mastering React Hooks")
 * @param {string}   [eyebrow]        - Label above title ("CURRENT UNIT")
 * @param {string}   [subtitle]       - Unit description
 * @param {number}   [progress]       - 0-100 progress %
 * @param {string}   [tag]            - Category/model name
 * @param {function} [onContinue]     - Called on CTA click
 * @param {string}   [className]
 *
 * @example
 * <ContinueLearningCard
 *   eyebrow="CURRENT UNIT"
 *   title="B2 First Certificate"
 *   subtitle="Reading & Use of English"
 *   progress={65}
 *   onContinue={() => history.push('/courses')}
 * />
 */
const ContinueLearningCard = memo(function ContinueLearningCard({
  title,
  eyebrow,
  subtitle,
  progress = 0,
  tag,
  onContinue,
  className
}) {
  const progressClamped = Math.min(Math.max(progress, 0), 100)
  const hasProgress = progressClamped > 0
  const ctaLabel = hasProgress ? 'RESUME LEARNING' : 'START NOW'

  return (
    <div className={clsx(styles.card, className)}>
      {/* ── Teal icon container (left) — matches w-full md:w-48 h-48 ─────── */}
      <div className={styles.iconBox} aria-hidden="true">
        <img
          src={diamondSrc}
          className={styles.iconSvg}
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* ── Content (right) ─────────────────────────────────────────────── */}
      <div className={styles.content}>
        {/* Eyebrow — "CURRENT UNIT" in teal, uppercase */}
        <span className={styles.eyebrow}>
          {eyebrow || (tag ? tag : 'CURRENT UNIT')}
        </span>

        {/* Title */}

        {/* Subtitle */}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {/* Progress section */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>UNIT PROGRESS</span>
            <span className={styles.progressValue}>{progressClamped}%</span>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={progressClamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressClamped}% complete`}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressClamped}%` }}
            />
          </div>
        </div>

        {/* CTA button — chunky primary */}
        {onContinue && (
          <Button
            variant="primary"
            size="lg"
            chunky
            onClick={onContinue}
            className={styles.cta}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  )
})

export default ContinueLearningCard
export { ContinueLearningCard }
