import React, { memo } from 'react'
import clsx from 'clsx'
import { Card } from '../Card'
import { Badge } from '../Badge'
import { Progress } from '../Progress'
import styles from './LearningCard.module.scss'

const DIFFICULTY_VARIANT = {
  beginner:     'active',
  intermediate: 'warning',
  advanced:     'danger',
}

const DIFFICULTY_LABELS = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

/**
 * LearningCard — Product component for displaying a course or learning module.
 *
 * Extends Card with:
 * - Cover image with difficulty badge overlay
 * - Progress bar + lesson count
 * - Tag chip for exam category
 * - Interactive click support
 *
 * @param {string}                           title
 * @param {string}                           [description]
 * @param {string}                           [coverImage]       - URL or import
 * @param {string}                           [coverAlt]
 * @param {number}                           [progress]         - 0–100
 * @param {number}                           [totalLessons]
 * @param {number}                           [completedLessons]
 * @param {'beginner'|'intermediate'|'advanced'} [difficulty]
 * @param {string}                           [tag]              - Category label (e.g. "IELTS")
 * @param {function}                         [onClick]
 * @param {string}                           [className]
 *
 * @example
 * <LearningCard
 *   title="Writing Task 2"
 *   description="Academic essay writing for IELTS"
 *   progress={65}
 *   totalLessons={12}
 *   completedLessons={8}
 *   difficulty="intermediate"
 *   tag="IELTS"
 *   onClick={() => navigate('/course/writing-task-2')}
 * />
 */
const LearningCard = memo(function LearningCard({
  title,
  description,
  coverImage,
  coverAlt = '',
  progress = 0,
  totalLessons,
  completedLessons,
  difficulty,
  tag,
  onClick,
  className,
}) {
  const hasProgress  = progress > 0
  const isComplete   = progress >= 100
  const progressVariant = isComplete ? 'success' : 'default'

  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={clsx(styles.card, className)}
    >
      {/* Cover / thumbnail */}
      <div className={styles.cover}>
        {coverImage
          ? <img src={coverImage} alt={coverAlt} className={styles.coverImg} />
          : <div className={styles.coverPlaceholder} aria-hidden="true" />
        }

        {/* Badges overlaid on top-right of cover */}
        <div className={styles.coverBadges}>
          {difficulty && (
            <Badge variant={DIFFICULTY_VARIANT[difficulty] ?? 'neutral'}>
              {DIFFICULTY_LABELS[difficulty] ?? difficulty}
            </Badge>
          )}
          {isComplete && (
            <Badge variant="success">✓ Done</Badge>
          )}
        </div>

        {tag && (
          <div className={styles.coverTag}>
            <Badge variant="neutral">{tag}</Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        {/* Lesson count */}
        {(totalLessons != null) && (
          <span className={styles.lessonCount}>
            {completedLessons != null
              ? `${completedLessons} / ${totalLessons} lessons`
              : `${totalLessons} lessons`
            }
          </span>
        )}

        {/* Progress bar */}
        {hasProgress && (
          <Progress
            value={progress}
            variant={progressVariant}
            size="sm"
            label={`${title} progress`}
            className={styles.progress}
          />
        )}

        {!hasProgress && totalLessons != null && (
          <Progress
            value={0}
            size="sm"
            label={`${title} progress`}
            className={styles.progress}
          />
        )}
      </div>
    </Card>
  )
})

LearningCard.defaultProps = {
  progress: 0,
}

export default LearningCard
export { LearningCard }
