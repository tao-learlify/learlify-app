/**
 * WritingBlockWrapper
 *
 * Bridges WritingOpenExercise / WritingFormExercise to the legacy Writing
 * component without modifying it.
 *
 * The legacy Writing component depends on useExamConsumer() which reads from
 * ExamContext + ExerciseContext. We cannot easily override ExerciseContext
 * for just this subtree because ExerciseContext is created globally.
 *
 * Strategy: provide a clean, lightweight writing UI that honours the same
 * word-count rules as the legacy component, submits locally, and calls
 * onComplete when done. The legacy Writing component is preserved for the
 * exam flow; this wrapper is used in the unit learning flow.
 *
 * TODO: Once Writing accepts exercise + selections + onSelectionChange as
 * direct props (refactored away from context), replace this with it.
 */
import React, { useState, useCallback } from 'react';
import { CheckCircle, TextT } from '@phosphor-icons/react';
import type {
  WritingOpenExercise,
  WritingFormExercise,
} from '../../../../schemas/course/exercises';
import type { ExerciseInteraction } from '../../../../schemas/course/exercises';
import type { ExerciseReview } from '../../../../schemas/course/review';

interface WritingBlockWrapperProps {
  exercise: WritingOpenExercise | WritingFormExercise;
  interaction: ExerciseInteraction;
  review?: ExerciseReview;
  accent: string;
  onComplete: (xpEarned: number) => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function WritingBlockWrapper({
  exercise,
  interaction,
  review,
  accent,
  onComplete,
}: WritingBlockWrapperProps) {
  const [answers, setAnswers] = useState<Record<number, string>>(
    () => Object.fromEntries(exercise.questions.map((_, i) => [i, ''])),
  );
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((index: number, value: string) => {
    if (submitted) return;

    // Word limit enforcement
    let limit = Infinity;
    if (exercise.type === 'writing_open' && exercise.wordRange) {
      limit = exercise.wordRange.max;
    } else if (exercise.type === 'writing_form' && exercise.wordLimit) {
      // wordLimit is a string like "20–30 words" — extract the max
      const match = exercise.wordLimit.match(/(\d+)\s*(?:words)?$/);
      if (match) limit = Number(match[1]);
    }

    if (countWords(value) > limit) return;

    setAnswers(prev => ({ ...prev, [index]: value }));
  }, [submitted, exercise]);

  const handleSubmit = () => {
    setSubmitted(true);
    // Writing tasks always award full XP on submission
    onComplete(interaction.xp);
  };

  const allAnswered = exercise.questions.every(
    (_, i) => (answers[i] ?? '').trim().length > 0,
  );

  if (submitted) {
    return (
      <div
        className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:py-6 tw:text-center"
        style={{ color: 'var(--color-success)' }}
      >
        <CheckCircle size={40} weight="fill" />
        <div>
          <p className="tw:font-semibold tw:text-text-primary">
            Writing submitted!
          </p>
          {review && review.mode !== 'auto' && (
            <p className="tw:text-sm tw:text-text-secondary tw:mt-1">
              {review.mode === 'human' && 'A teacher will review your writing.'}
              {review.mode === 'ai' && 'AI feedback will be ready shortly.'}
              {review.mode === 'hybrid' && 'Your writing will be reviewed by AI then a teacher.'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tw:space-y-5">
      {exercise.questions.map((q, index) => {
        const text = answers[index] ?? '';
        const wordCount = countWords(text);

        // Determine the word limit for display
        let wordLimitDisplay: string | null = null;
        if (exercise.type === 'writing_open' && exercise.wordRange) {
          wordLimitDisplay = `${exercise.wordRange.min}–${exercise.wordRange.max} words`;
        } else if (exercise.type === 'writing_form' && exercise.wordLimit) {
          wordLimitDisplay = exercise.wordLimit;
        }

        return (
          <div key={q.id}>
            {/* Question prompt */}
            <div className="tw:flex tw:items-start tw:gap-2 tw:mb-2">
              <div
                className="tw:w-6 tw:h-6 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shrink-0 tw:text-xs tw:font-bold tw:text-white tw:mt-0.5"
                style={{ backgroundColor: accent }}
              >
                {index + 1}
              </div>
              <p className="tw:text-sm tw:font-medium tw:text-text-primary tw:leading-relaxed">
                {q.prompt}
              </p>
            </div>

            {/* Textarea */}
            <div className="tw:relative">
              <textarea
                className="tw:w-full tw:min-h-[90px] tw:px-3 tw:py-2.5 tw:text-sm tw:text-text-primary tw:bg-bg-muted tw:rounded-xl tw:border tw:border-border-default tw:resize-y tw:leading-relaxed tw:outline-none tw:transition-all tw:duration-150 tw:focus:border-brand-primary tw:focus:bg-bg-surface"
                placeholder="Write your answer here…"
                value={text}
                onChange={e => handleChange(index, e.target.value)}
                style={{ fontFamily: 'var(--font-family-sans)' }}
              />

              {/* Word count */}
              {wordLimitDisplay && (
                <p className="tw:text-xs tw:text-text-secondary tw:mt-1 tw:text-right">
                  {wordCount} words · {wordLimitDisplay}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div className="tw:flex tw:justify-end">
        <button
          type="button"
          disabled={!allAnswered}
          className="tw:flex tw:items-center tw:gap-2 tw:px-5 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
          style={{ backgroundColor: accent, boxShadow: `0 4px 0 0 ${accent}80` }}
          onClick={handleSubmit}
        >
          <TextT size={15} weight="bold" />
          Submit writing
        </button>
      </div>
    </div>
  );
}
