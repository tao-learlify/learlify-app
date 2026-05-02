/**
 * SelectionExercise — handles multiple_choice and true_false.
 * Clean, minimal UI: question prompt + option buttons.
 */
import React, { useState } from 'react';
import type { MultipleChoiceExercise, TrueFalseExercise, ExerciseQuestion } from '../../../../schemas/course/exercises';
import type { ExerciseInteraction } from '../../../../schemas/course/exercises';

interface SelectionExerciseProps {
  exercise: MultipleChoiceExercise | TrueFalseExercise;
  interaction: ExerciseInteraction;
  accent: string;
  onComplete: (xpEarned: number) => void;
}

export function SelectionExercise({
  exercise,
  interaction,
  accent,
  onComplete,
}: SelectionExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const total = exercise.questions.length;
  const answered = Object.keys(answers).length;

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const correct = exercise.questions.filter(
      q => q.correctOptionId && answers[q.id] === q.correctOptionId,
    ).length;
    const ratio = total > 0 ? correct / total : 0;
    const xp = Math.round(interaction.xp * ratio);
    setScore(correct);
    setSubmitted(true);
    onComplete(xp);
  };

  return (
    <div>
      {/* Description */}
      {exercise.description && (
        <p className="tw:text-sm tw:text-text-secondary tw:mb-5 tw:leading-relaxed">
          {exercise.description}
        </p>
      )}

      <div className="tw:space-y-6">
        {exercise.questions.map((q, qi) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={qi}
            selectedOptionId={answers[q.id] ?? null}
            submitted={submitted}
            accent={accent}
            onSelect={(optionId) => handleSelect(q.id, optionId)}
          />
        ))}
      </div>

      {/* Score feedback */}
      {submitted && score !== null && (
        <div
          className="tw:mt-5 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-medium"
          style={{
            backgroundColor: score === total ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            color: score === total ? 'var(--color-success-text)' : 'var(--color-warning-text)',
          }}
        >
          {score === total
            ? `Perfect! All ${total} correct. 🎉`
            : `${score} / ${total} correct. ${interaction.retryable ? 'Keep practising!' : ''}`}
        </div>
      )}

      {/* Submit button */}
      {!submitted && (
        <div className="tw:mt-6 tw:flex tw:justify-end">
          <button
            type="button"
            disabled={answered < total}
            className="tw:px-5 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: `0 4px 0 0 ${accent}80` }}
            onClick={handleSubmit}
          >
            Submit answers
          </button>
        </div>
      )}
    </div>
  );
}

// ── Single question + option list ─────────────────────────────

interface QuestionItemProps {
  question: ExerciseQuestion;
  index: number;
  selectedOptionId: string | null;
  submitted: boolean;
  accent: string;
  onSelect: (optionId: string) => void;
}

function QuestionItem({
  question,
  index,
  selectedOptionId,
  submitted,
  accent,
  onSelect,
}: QuestionItemProps) {
  return (
    <div>
      <p className="tw:text-sm tw:font-medium tw:text-text-primary tw:mb-3 tw:leading-relaxed">
        <span
          className="tw:inline-flex tw:items-center tw:justify-center tw:w-5 tw:h-5 tw:rounded-full tw:text-xs tw:font-bold tw:text-white tw:mr-2 tw:shrink-0"
          style={{ backgroundColor: accent }}
        >
          {index + 1}
        </span>
        {question.prompt.replace(/^\d+\.\s*/, '')}
      </p>

      <div className="tw:space-y-2">
        {(question.options ?? []).map(option => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect  = submitted && option.id === question.correctOptionId;
          const isWrong    = submitted && isSelected && option.id !== question.correctOptionId;

          let bg    = 'var(--color-bg-muted)';
          let border = 'var(--color-border-default)';
          let color  = 'var(--color-text-primary)';

          if (isSelected && !submitted) {
            bg = `${accent}15`;
            border = accent;
            color = accent;
          } else if (isCorrect) {
            bg = 'var(--color-success-bg)';
            border = 'var(--color-success)';
            color = 'var(--color-success-text)';
          } else if (isWrong) {
            bg = 'var(--color-danger-bg)';
            border = 'var(--color-danger)';
            color = 'var(--color-danger-text)';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={submitted}
              className="tw:w-full tw:text-left tw:px-4 tw:py-2.5 tw:rounded-xl tw:text-sm tw:font-medium tw:transition-all tw:duration-150 tw:border tw:cursor-pointer tw:disabled:cursor-default"
              style={{ backgroundColor: bg, borderColor: border, color }}
              onClick={() => onSelect(option.id)}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
