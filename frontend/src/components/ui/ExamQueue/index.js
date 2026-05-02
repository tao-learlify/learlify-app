import React, { memo } from 'react'
import clsx from 'clsx'
import {
  Target,
  Ear,
  BookOpen,
  PencilSimple,
  Microphone,
  Lock,
  Crown,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Lightning
} from '@phosphor-icons/react'
import pandaImg from 'assets/img/learning-panda-01.png'
import styles from './ExamQueue.module.scss'

/* ── Skill metadata ─────────────────────────────────────────────────────────── */

const SKILLS = {
  listening: { Icon: Ear, label: 'Listening' },
  reading: { Icon: BookOpen, label: 'Reading' },
  writing: { Icon: PencilSimple, label: 'Writing' },
  speaking: { Icon: Microphone, label: 'Speaking' }
}

const ALL_SKILLS = ['listening', 'reading', 'writing', 'speaking']

/* ── Default exam queue ─────────────────────────────────────────────────────── */
/*
 * status:
 *   'available' — next up, shown as featured card (only ONE at a time)
 *   'locked'    — not yet reachable
 *   'completed' — done, shows level + score
 *
 * type:
 *   'free'    — included in plan
 *   'premium' — requires upgrade
 */
const DEFAULT_EXAMS = [
  {
    id: 1,
    title: 'Kitchen Chat',
    status: 'available',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-01'
  },
  {
    id: 2,
    title: 'Play Together',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-02',
    unlockAt: 'Unit 8'
  },
  {
    id: 3,
    title: 'Make Your Mark',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-03',
    unlockAt: 'Unit 12'
  },
  {
    id: 4,
    title: 'Wild Plans',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-04',
    unlockAt: 'Unit 16'
  },
  {
    id: 5,
    title: 'Word Explorer',
    status: 'locked',
    type: 'premium',
    skills: ALL_SKILLS,
    duration: 30,
    examId: 'exam-05'
  },
  {
    id: 6,
    title: 'Team Talk',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-06',
    unlockAt: 'Unit 22'
  },
  {
    id: 7,
    title: 'Stay Connected',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-07',
    unlockAt: 'Unit 26'
  },
  {
    id: 8,
    title: 'In the Mix',
    status: 'locked',
    type: 'premium',
    skills: ALL_SKILLS,
    duration: 30,
    examId: 'exam-08'
  },
  {
    id: 9,
    title: 'Now Streaming',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-09',
    unlockAt: 'Unit 32'
  },
  {
    id: 10,
    title: 'On Air',
    status: 'locked',
    type: 'free',
    skills: ALL_SKILLS,
    duration: 25,
    examId: 'exam-10',
    unlockAt: 'Unit 36'
  }
]

/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ExamQueue — Challenge checkpoint panel.
 *
 * Shows the next available challenge as a featured "boss level" card,
 * followed by a compact queue of upcoming locked challenges.
 * Sits alongside ProgressGraph in the secondary panel.
 *
 * Terminology rules: NEVER use "Exam", "Test", "Assessment".
 * Always: "Challenge", "Session", "Checkpoint".
 *
 * @param {Array}    [exams]      - Full challenge list (see DEFAULT_EXAMS shape)
 * @param {function} [onStart]    - (exam) => void — called when user starts a challenge
 * @param {function} [onUnlock]   - (exam) => void — called when user clicks a premium node
 * @param {string}   [className]
 */
const ExamQueue = memo(function ExamQueue({
  exams = DEFAULT_EXAMS,
  onStart,
  onUnlock,
  className
}) {
  const nextExam = exams.find(e => e.status === 'available')
  const queueExams = exams.filter(e => e.status !== 'available')
  const doneCount = exams.filter(e => e.status === 'completed').length
  const totalCount = exams.length
  const allComplete = doneCount === totalCount

  return (
    <div className={clsx(styles.card, className)}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerIcon} aria-hidden="true">
          <Target weight="fill" size={18} />
        </div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Your Challenges</h3>
          <p className={styles.subtitle}>Complete all 10 to level up</p>
        </div>
        <div
          className={styles.countBadge}
          aria-label={`${doneCount} of ${totalCount} challenges complete`}
        >
          <span className={styles.countDone}>{doneCount}</span>
          <span className={styles.countSep}>/</span>
          <span className={styles.countTotal}>{totalCount}</span>
        </div>
      </div>

      {/* ── Overall progress bar ────────────────────────────────────────── */}
      <div className={styles.overallTrack} aria-hidden="true">
        <div
          className={styles.overallFill}
          style={{ width: `${(doneCount / totalCount) * 100}%` }}
        />
      </div>

      {/* ── Featured: next available challenge ──────────────────────────── */}
      {nextExam && <FeaturedCard exam={nextExam} onStart={onStart} />}

      {/* ── All done state ───────────────────────────────────────────────── */}
      {allComplete && (
        <div className={styles.allDone}>
          <CheckCircle weight="fill" size={28} className={styles.allDoneIcon} />
          <p className={styles.allDoneText}>All challenges complete!</p>
        </div>
      )}

      {/* ── Queue: upcoming challenges ───────────────────────────────────── */}
      {queueExams.length > 0 && (
        <div className={styles.queue}>
          <span
            className={styles.queueHeading}
            aria-label="Upcoming challenges"
          >
            Coming up
          </span>
          <ul className={styles.queueList} role="list">
            {queueExams.slice(0, 5).map(exam => (
              <QueueItem key={exam.id} exam={exam} onUnlock={onUnlock} />
            ))}
          </ul>
          {queueExams.length > 5 && (
            <span
              className={styles.moreCount}
              aria-label={`${queueExams.length - 5} more challenges`}
            >
              +{queueExams.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  )
})

/* ── FeaturedCard ────────────────────────────────────────────────────────────── */
/*
 * The "boss level" card — next challenge, amber background, full width.
 * Immediately draws the eye. CTA is the primary action on the entire panel.
 */
const FeaturedCard = memo(function FeaturedCard({ exam, onStart }) {
  return (
    <div
      className={styles.featured}
      role="region"
      aria-label={`Next challenge: ${exam.title}`}
    >
      {/* Panda companion — decorative, dissolved into card via mix-blend-mode */}
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        className={styles.pandaDecor}
      />

      {/* Shine sweep — subtle glint that fires every few seconds */}
      <span className={styles.featuredShine} aria-hidden="true" />

      {/* NEXT CHALLENGE label */}
      <div className={styles.featuredLabel} aria-hidden="true">
        <Star weight="fill" size={10} />
        Next Challenge
      </div>

      {/* Title */}
      <h2 className={styles.featuredTitle}>{exam.title}</h2>

      {/* Description */}
      <p className={styles.featuredDesc}>
        Prove your skills across all four areas and unlock your next level.
      </p>

      {/* Skills row + duration */}
      <div className={styles.featuredMeta}>
        <div className={styles.skillsRow}>
          {(exam.skills ?? ALL_SKILLS).map(skill => {
            const { Icon, label } = SKILLS[skill] ?? {}
            if (!Icon) return null
            return (
              <div key={skill} className={styles.skillChip} title={label}>
                <Icon weight="fill" size={12} />
                <span>{label}</span>
              </div>
            )
          })}
        </div>
        {/* {exam.duration && (
          <span className={styles.duration}>
            <Clock weight="fill" size={12} />
            ~{exam.duration} min
          </span>
        )} */}
      </div>

      {/* XP reward hint */}
      {exam.xp && (
        <div className={styles.xpHint}>
          <Lightning weight="fill" size={12} />+{exam.xp} XP
        </div>
      )}

      {/* CTA */}
      <button
        className={styles.startBtn}
        onClick={() => onStart?.(exam)}
        aria-label={`Start ${exam.title} challenge`}
      >
        Start Challenge
        <ArrowRight weight="bold" size={16} aria-hidden="true" />
      </button>
    </div>
  )
})

/* ── QueueItem ───────────────────────────────────────────────────────────────── */
/*
 * Compact row for locked / completed challenges.
 * Premium locked → clickable, shows Crown + "Premium" tag.
 * Regular locked → not clickable, shows Lock + unlock requirement.
 * Completed       → shows CheckCircle + level achieved.
 */
const QueueItem = memo(function QueueItem({ exam, onUnlock }) {
  const isPremium = exam.type === 'premium'
  const isCompleted = exam.status === 'completed'
  const isClickable = isPremium && !isCompleted

  const handleClick = isClickable ? () => onUnlock?.(exam) : undefined

  return (
    <li
      className={clsx(
        styles.queueItem,
        isPremium && !isCompleted && styles.queueItemPremium,
        isCompleted && styles.queueItemDone,
        isClickable && styles.queueItemClickable
      )}
      onClick={handleClick}
      role={isClickable ? 'button' : 'listitem'}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable ? e => e.key === 'Enter' && handleClick() : undefined
      }
      aria-label={
        isCompleted
          ? `${exam.title} — completed`
          : isPremium
            ? `${exam.title} — premium, click to unlock`
            : `${exam.title} — locked, requires ${exam.unlockAt}`
      }
    >
      {/* State icon */}
      <span
        className={clsx(
          styles.queueIcon,
          isPremium && !isCompleted && styles.queueIconPremium,
          isCompleted && styles.queueIconDone
        )}
        aria-hidden="true"
      >
        {isCompleted && <CheckCircle weight="fill" size={15} />}
        {!isCompleted && isPremium && <Crown weight="fill" size={15} />}
        {!isCompleted && !isPremium && <Lock weight="fill" size={13} />}
      </span>

      {/* Title */}
      <span className={styles.queueTitle}>{exam.title}</span>

      {/* Status tag */}
      <span
        className={clsx(
          styles.queueStatus,
          isPremium && !isCompleted && styles.queueStatusPremium,
          isCompleted && styles.queueStatusDone
        )}
      >
        {isCompleted
          ? `${exam.level ?? 'B1'} · ${exam.score ?? 88}%`
          : isPremium
            ? '★ Premium'
            : (exam.unlockAt ?? 'Locked')}
      </span>
    </li>
  )
})

export default ExamQueue
export { ExamQueue }
