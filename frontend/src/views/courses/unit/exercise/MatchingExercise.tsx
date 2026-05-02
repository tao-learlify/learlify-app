/**
 * MatchingExercise
 *
 * Generic pairing component for vocabulary, people/opinion, heading-to-paragraph,
 * and label-to-definition matching.
 *
 * Schema contract:
 *   questions[]           → LEFT column items  (question.id, question.prompt)
 *   question.options[]    → pool of RIGHT items (deduplicated across questions)
 *   question.correctOptionId → correct right-side match for that question
 *
 * Pairing state machine (three independent slices):
 *   activeLeftId  — which left item is pending a right selection (or null)
 *   pairs         — confirmed pairings: leftId → rightId
 *   colorMap      — visual color slot: leftId → 0..5
 *
 * Interaction rules:
 *   • Click LEFT (idle)      → activate it
 *   • Click LEFT (active)    → if paired: remove pair + deactivate; else: deactivate
 *   • Click LEFT (paired)    → activate for reassignment
 *   • Click RIGHT (active L) → create pair (removes conflicting pairs), clear active
 *   • Click RIGHT (no active)→ shake right column, show "select a word first" hint
 *
 * Completion: proportional XP (correct/total × interaction.xp), onComplete called once.
 * Retry: available if interaction.retryable and score < total.
 */
import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight } from '@phosphor-icons/react'
import type {
  MatchingExercise as MatchingExerciseType,
  ExerciseInteraction,
  AnswerOption
} from '../../../../schemas/course/exercises'

// ─────────────────────────────────────────────────────────────
// Pair color palette
// 6 distinct, soft colors — accessible across common color deficiencies
// (shapes + text differ enough when color alone is insufficient)
// ─────────────────────────────────────────────────────────────

interface PairColor {
  bg: string
  border: string
  text: string
  badge: string // solid color for the indicator dot
}

const PAIR_COLORS: PairColor[] = [
  { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8', badge: '#3B82F6' }, // blue
  { bg: '#F0FDF4', border: '#86EFAC', text: '#15803D', badge: '#22C55E' }, // green
  { bg: '#FFF7ED', border: '#FDC58A', text: '#C2410C', badge: '#F97316' }, // orange
  { bg: '#FDF4FF', border: '#D8B4FE', text: '#7E22CE', badge: '#A855F7' }, // purple
  { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', badge: '#F59E0B' }, // amber
  { bg: '#F0F9FF', border: '#67E8F9', text: '#0369A1', badge: '#0EA5E9' } // teal
]

function getNextColorIdx(colorMap: Record<string, number>): number {
  const used = new Set(Object.values(colorMap))
  for (let i = 0; i < PAIR_COLORS.length; i++) {
    if (!used.has(i)) return i
  }
  return 0 // cycle if all 6 slots are used
}

// ─────────────────────────────────────────────────────────────
// Derive right items from exercise questions (stable, shuffled once)
// ─────────────────────────────────────────────────────────────

function collectRightItems(
  exercise: MatchingExerciseType,
  shuffle: boolean
): AnswerOption[] {
  const seen = new Set<string>()
  const items: AnswerOption[] = []
  for (const q of exercise.questions) {
    for (const opt of q.options ?? []) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id)
        items.push(opt)
      }
    }
  }
  if (!shuffle) return items
  // Fisher-Yates — called once in useState initializer
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─────────────────────────────────────────────────────────────
// MatchingExercise — main component
// ─────────────────────────────────────────────────────────────

interface MatchingExerciseProps {
  exercise: MatchingExerciseType
  interaction: ExerciseInteraction
  accent: string
  onComplete: (xpEarned: number) => void
}

export function MatchingExercise({
  exercise,
  interaction,
  accent,
  onComplete
}: MatchingExerciseProps) {
  // Compute right column once — stable across renders
  const [rightItems] = useState<AnswerOption[]>(() =>
    collectRightItems(exercise, interaction.shuffleOptions)
  )

  // Core pairing state
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null)
  const [pairs, setPairs] = useState<Record<string, string>>({})
  const [colorMap, setColorMap] = useState<Record<string, number>>({})

  // Hint: shake right column when user clicks right without active left
  const [rightShakeKey, setRightShakeKey] = useState(0)
  const [showSelectLeftHint, setShowSelectLeftHint] = useState(false)

  // Submission
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const questions = exercise.questions
  const total = questions.length
  const paired = Object.keys(pairs).length
  const canCheck = paired === total && !submitted

  // ── Pairing handlers ────────────────────────────────────────

  const handleLeftClick = useCallback(
    (leftId: string) => {
      if (submitted) return

      if (activeLeftId === leftId) {
        // Toggle: if already active
        if (pairs[leftId]) {
          // Remove pair and color on second click of an active+paired item
          setPairs(prev => {
            const next = { ...prev }
            delete next[leftId]
            return next
          })
          setColorMap(prev => {
            const next = { ...prev }
            delete next[leftId]
            return next
          })
        }
        setActiveLeftId(null)
      } else {
        // Activate this left item (even if already paired — for reassignment)
        setActiveLeftId(leftId)
      }
    },
    [submitted, activeLeftId, pairs]
  )

  const handleRightClick = useCallback(
    (rightId: string) => {
      if (submitted) return

      if (!activeLeftId) {
        // No left active: shake and hint
        setRightShakeKey(k => k + 1)
        setShowSelectLeftHint(true)
        window.setTimeout(() => setShowSelectLeftHint(false), 2200)
        return
      }

      setPairs(prev => {
        const next = { ...prev }
        // If this rightId is already used by a different left, free it
        for (const [lid, rid] of Object.entries(next)) {
          if (rid === rightId && lid !== activeLeftId) {
            delete next[lid]
            // Remove color for the displaced left too
            setColorMap(cm => {
              const ncm = { ...cm }
              delete ncm[lid]
              return ncm
            })
            break
          }
        }
        next[activeLeftId] = rightId
        return next
      })

      // Assign a color to this left if it doesn't have one yet
      setColorMap(prev => {
        if (prev[activeLeftId] !== undefined) return prev
        return { ...prev, [activeLeftId]: getNextColorIdx(prev) }
      })

      setActiveLeftId(null)
      setShowSelectLeftHint(false)
    },
    [submitted, activeLeftId]
  )

  // ── Submission ───────────────────────────────────────────────

  const handleSubmit = () => {
    const correct = questions.filter(
      q => q.correctOptionId && pairs[q.id] === q.correctOptionId
    ).length
    const xp = Math.round(interaction.xp * (correct / Math.max(total, 1)))
    setScore(correct)
    setSubmitted(true)
    setActiveLeftId(null)
    onComplete(xp)
  }

  const handleRetry = () => {
    setPairs({})
    setColorMap({})
    setActiveLeftId(null)
    setSubmitted(false)
    setScore(null)
  }

  // Derive result states per pair (post-submission)
  const getPairResult = (
    leftId: string
  ): 'correct' | 'incorrect' | 'missing' | null => {
    if (!submitted) return null
    if (!pairs[leftId]) return 'missing'
    const q = questions.find(q => q.id === leftId)
    return pairs[leftId] === q?.correctOptionId ? 'correct' : 'incorrect'
  }

  const isPerfect = submitted && score === total
  const hasMistakes = submitted && score !== null && score < total

  return (
    <div className="tw:space-y-4">
      {/* ── Instruction hint ────────────────────────────────── */}
      {!submitted && (
        <p className="tw:text-xs tw:text-text-secondary tw:leading-relaxed">
          Select an item on the left, then select its match on the right.
        </p>
      )}

      {/* ── Active selection indicator ──────────────────────── */}
      <AnimatePresence>
        {activeLeftId && !submitted && (
          <motion.div
            key="active-hint"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium"
            style={{ backgroundColor: `${accent}10`, color: accent }}
          >
            <ArrowRight size={13} weight="bold" />
            <span>Now select the matching item on the right →</span>
          </motion.div>
        )}
        {showSelectLeftHint && !activeLeftId && !submitted && (
          <motion.div
            key="select-left-hint"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium"
            style={{
              backgroundColor: 'var(--color-info-bg)',
              color: 'var(--color-info-text)'
            }}
          >
            <span>👈</span>
            <span>Select an item from the left column first.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Matching grid ────────────────────────────────────── */}
      <div className="tw:grid tw:grid-cols-2 tw:gap-x-3">
        {/* LEFT column — questions (stable order) */}
        <div className="tw:space-y-2">
          <p className="tw:text-[10px] tw:font-semibold tw:uppercase tw:tracking-wider tw:text-text-disabled tw:mb-1 tw:px-1">
            Items
          </p>
          {questions.map((q, idx) => {
            const isActive = activeLeftId === q.id
            const pairedRightId = pairs[q.id]
            const colorIdx = colorMap[q.id]
            const pairColor =
              colorIdx !== undefined ? PAIR_COLORS[colorIdx] : null
            const result = getPairResult(q.id)

            return (
              <LeftItem
                key={q.id}
                index={idx}
                prompt={q.prompt}
                isActive={isActive}
                isPaired={!!pairedRightId}
                pairColor={pairColor}
                result={result}
                accent={accent}
                submitted={submitted}
                onClick={() => handleLeftClick(q.id)}
              />
            )
          })}
        </div>

        {/* RIGHT column — shuffled options */}
        <motion.div
          className="tw:space-y-2"
          key={rightShakeKey}
          animate={rightShakeKey > 0 ? { x: [-4, 4, -3, 3, -1, 0] } : {}}
          transition={{ duration: 0.28 }}
        >
          <p className="tw:text-[10px] tw:font-semibold tw:uppercase tw:tracking-wider tw:text-text-disabled tw:mb-1 tw:px-1">
            Matches
          </p>
          {rightItems.map((opt, idx) => {
            // Find which left is paired to this right
            const pairedLeftId = Object.keys(pairs).find(
              lid => pairs[lid] === opt.id
            )
            const colorIdx =
              pairedLeftId !== undefined ? colorMap[pairedLeftId] : undefined
            const pairColor =
              colorIdx !== undefined ? PAIR_COLORS[colorIdx] : null

            // Result state: follow the left item's result
            let result: 'correct' | 'incorrect' | null = null
            if (submitted && pairedLeftId) {
              result =
                getPairResult(pairedLeftId) === 'correct'
                  ? 'correct'
                  : 'incorrect'
            }
            // Also highlight correct option if it was paired to the wrong answer
            const isCorrectAnswer =
              submitted &&
              questions.some(
                q => q.correctOptionId === opt.id && pairs[q.id] !== opt.id
              )

            return (
              <RightItem
                key={opt.id}
                index={idx}
                option={opt}
                isPaired={!!pairedLeftId}
                pairColor={pairColor}
                isActive={false}
                result={result}
                isCorrectAnswer={isCorrectAnswer}
                submitted={submitted}
                hasActiveLeft={!!activeLeftId}
                accent={accent}
                onClick={() => handleRightClick(opt.id)}
              />
            )
          })}
        </motion.div>
      </div>

      {/* ── Pair legend (pairs made so far) ─────────────────── */}
      {!submitted && paired > 0 && (
        <PairLegend
          pairs={pairs}
          colorMap={colorMap}
          questions={questions}
          rightItems={rightItems}
          total={total}
          accent={accent}
        />
      )}

      {/* ── Score banner ─────────────────────────────────────── */}
      {submitted && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-medium"
          style={
            isPerfect
              ? {
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success-text)'
                }
              : {
                  backgroundColor: 'var(--color-warning-bg)',
                  color: 'var(--color-warning-text)'
                }
          }
        >
          {isPerfect ? (
            <CheckCircle size={18} weight="fill" />
          ) : (
            <XCircle size={18} weight="fill" />
          )}
          <span>
            {isPerfect
              ? `All ${total} pairs correct!`
              : `${score} of ${total} correct${interaction.retryable ? ' — try again?' : '.'}`}
          </span>
        </motion.div>
      )}

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="tw:flex tw:justify-end tw:gap-3">
        {hasMistakes && interaction.retryable && (
          <button
            type="button"
            className="tw:px-4 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-semibold tw:cursor-pointer tw:border tw:transition-opacity tw:hover:opacity-80"
            style={{
              color: accent,
              borderColor: `${accent}40`,
              backgroundColor: `${accent}08`
            }}
            onClick={handleRetry}
          >
            Try again
          </button>
        )}

        {!submitted && (
          <button
            type="button"
            disabled={!canCheck}
            className="tw:px-5 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 0 0 ${accent}80`
            }}
            onClick={handleSubmit}
          >
            Check pairs
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LeftItem
// ─────────────────────────────────────────────────────────────

const LETTER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface LeftItemProps {
  index: number
  prompt: string
  isActive: boolean
  isPaired: boolean
  pairColor: PairColor | null
  result: 'correct' | 'incorrect' | 'missing' | null
  accent: string
  submitted: boolean
  onClick: () => void
}

function LeftItem({
  index,
  prompt,
  isActive,
  isPaired,
  pairColor,
  result,
  accent,
  submitted,
  onClick
}: LeftItemProps) {
  // Derive visual style
  let bg = 'var(--color-bg-surface)'
  let border = 'var(--color-border-default)'
  let color = 'var(--color-text-primary)'
  let shadow = ''

  if (result === 'correct') {
    bg = 'var(--color-success-bg)'
    border = 'var(--color-success)'
    color = 'var(--color-success-text)'
  } else if (result === 'incorrect') {
    bg = 'var(--color-warning-bg)'
    border = 'var(--color-warning)'
    color = 'var(--color-warning-text)'
  } else if (result === 'missing') {
    bg = 'var(--color-bg-muted)'
    border = 'var(--color-border-default)'
    color = 'var(--color-text-disabled)'
  } else if (isActive) {
    bg = `${accent}10`
    border = accent
    color = accent
    shadow = `0 0 0 2px ${accent}20`
  } else if (isPaired && pairColor) {
    bg = pairColor.bg
    border = pairColor.border
    color = pairColor.text
  }

  const letter = LETTER[index] ?? String(index + 1)

  return (
    <button
      type="button"
      aria-label={`Left item ${letter}: ${prompt}${isPaired ? ', paired' : ''}${isActive ? ', selected' : ''}`}
      aria-pressed={isActive}
      disabled={submitted && result === null}
      onClick={onClick}
      className={[
        'tw:w-full tw:text-left tw:flex tw:items-start tw:gap-2.5',
        'tw:min-h-[44px] tw:px-3 tw:py-2.5 tw:rounded-xl tw:border',
        'tw:text-sm tw:font-medium tw:leading-snug',
        'tw:transition-all tw:duration-150',
        !submitted
          ? 'tw:cursor-pointer tw:hover:shadow-[var(--shadow-1)]'
          : 'tw:cursor-default'
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: bg,
        borderColor: border,
        color,
        boxShadow: shadow || undefined
      }}
    >
      {/* Letter badge */}
      <span
        className="tw:shrink-0 tw:w-5 tw:h-5 tw:rounded-md tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:mt-px"
        style={
          isActive
            ? { backgroundColor: accent, color: 'white' }
            : isPaired && pairColor
              ? { backgroundColor: pairColor.badge, color: 'white' }
              : result === 'correct'
                ? { backgroundColor: 'var(--color-success)', color: 'white' }
                : result === 'incorrect'
                  ? { backgroundColor: 'var(--color-warning)', color: 'white' }
                  : {
                      backgroundColor: 'var(--color-bg-muted)',
                      color: 'var(--color-text-secondary)'
                    }
        }
      >
        {result === 'correct' ? (
          <CheckCircle size={11} weight="fill" />
        ) : (
          letter
        )}
      </span>

      {/* Prompt text */}
      <span className="tw:flex-1 tw:line-clamp-3">{prompt}</span>

      {/* Active indicator arrow */}
      {isActive && (
        <ArrowRight
          size={13}
          weight="bold"
          className="tw:shrink-0 tw:mt-0.5 tw:self-center"
          style={{ color: accent }}
        />
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// RightItem
// ─────────────────────────────────────────────────────────────

interface RightItemProps {
  index: number
  option: AnswerOption
  isPaired: boolean
  pairColor: PairColor | null
  isActive: boolean
  result: 'correct' | 'incorrect' | null
  isCorrectAnswer: boolean
  submitted: boolean
  hasActiveLeft: boolean
  accent: string
  onClick: () => void
}

function RightItem({
  index,
  option,
  isPaired,
  pairColor,
  isActive,
  result,
  isCorrectAnswer,
  submitted,
  hasActiveLeft,
  accent,
  onClick
}: RightItemProps) {
  let bg = 'var(--color-bg-surface)'
  let border = 'var(--color-border-default)'
  let color = 'var(--color-text-primary)'

  if (result === 'correct') {
    bg = 'var(--color-success-bg)'
    border = 'var(--color-success)'
    color = 'var(--color-success-text)'
  } else if (result === 'incorrect') {
    bg = 'var(--color-warning-bg)'
    border = 'var(--color-warning)'
    color = 'var(--color-warning-text)'
  } else if (isCorrectAnswer) {
    // This was the correct answer but was incorrectly paired (or not paired)
    bg = 'var(--color-success-bg)'
    border = 'var(--color-success)'
    color = 'var(--color-success-text)'
  } else if (isPaired && pairColor) {
    bg = pairColor.bg
    border = pairColor.border
    color = pairColor.text
  } else if (hasActiveLeft && !submitted) {
    // Subtle highlight on all right items when a left is active — invites clicking
    bg = 'var(--color-bg-muted)'
  }

  const numLabel = String(index + 1)

  return (
    <button
      type="button"
      aria-label={`Right item ${numLabel}: ${option.text}${isPaired ? ', already matched' : ''}${isCorrectAnswer ? ', correct answer' : ''}`}
      disabled={submitted}
      onClick={onClick}
      className={[
        'tw:w-full tw:text-left tw:flex tw:items-start tw:gap-2.5',
        'tw:min-h-[44px] tw:px-3 tw:py-2.5 tw:rounded-xl tw:border',
        'tw:text-sm tw:font-medium tw:leading-snug',
        'tw:transition-all tw:duration-150',
        !submitted
          ? 'tw:cursor-pointer tw:hover:shadow-[var(--shadow-1)]'
          : 'tw:cursor-default'
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundColor: bg, borderColor: border, color }}
    >
      {/* Number badge */}
      <span
        className="tw:shrink-0 tw:w-5 tw:h-5 tw:rounded-md tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:mt-px"
        style={
          result === 'correct' || isCorrectAnswer
            ? { backgroundColor: 'var(--color-success)', color: 'white' }
            : result === 'incorrect'
              ? { backgroundColor: 'var(--color-warning)', color: 'white' }
              : isPaired && pairColor
                ? { backgroundColor: pairColor.badge, color: 'white' }
                : {
                    backgroundColor: 'var(--color-bg-muted)',
                    color: 'var(--color-text-secondary)'
                  }
        }
      >
        {result === 'correct' || isCorrectAnswer ? (
          <CheckCircle size={11} weight="fill" />
        ) : (
          numLabel
        )}
      </span>

      {/* Option text */}
      <span className="tw:flex-1 tw:line-clamp-3">{option.text}</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// PairLegend — shows confirmed pairs before submission
// ─────────────────────────────────────────────────────────────

interface PairLegendProps {
  pairs: Record<string, string>
  colorMap: Record<string, number>
  questions: MatchingExerciseType['questions']
  rightItems: AnswerOption[]
  total: number
  accent: string
}

function PairLegend({
  pairs,
  colorMap,
  questions,
  rightItems,
  total,
  accent
}: PairLegendProps) {
  const pairedCount = Object.keys(pairs).length

  return (
    <div
      className="tw:rounded-xl tw:border tw:px-4 tw:py-3"
      style={{ borderColor: `${accent}20`, backgroundColor: `${accent}05` }}
    >
      <p
        className="tw:text-[10px] tw:font-semibold tw:uppercase tw:tracking-wider tw:mb-2.5"
        style={{ color: `${accent}90` }}
      >
        Your pairs · {pairedCount} / {total}
      </p>
      <div className="tw:space-y-1.5">
        {questions.map(q => {
          const rightId = pairs[q.id]
          const rightItem = rightItems.find(r => r.id === rightId)
          const colorIdx = colorMap[q.id]
          const pc = colorIdx !== undefined ? PAIR_COLORS[colorIdx] : null

          if (!rightItem || !pc) return null

          return (
            <div
              key={q.id}
              className="tw:flex tw:items-center tw:gap-2 tw:text-xs"
            >
              <span
                className="tw:w-2 tw:h-2 tw:rounded-full tw:shrink-0"
                style={{ backgroundColor: pc.badge }}
              />
              <span
                className="tw:font-medium tw:truncate tw:max-w-[35%]"
                style={{ color: pc.text }}
              >
                {q.prompt}
              </span>
              <span className="tw:text-text-disabled">→</span>
              <span
                className="tw:truncate tw:max-w-[45%]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {rightItem.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
