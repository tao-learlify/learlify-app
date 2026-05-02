/**
 * GapSelectExercise — word bank + gap-fill.
 * Each question has its own options (per MN-004 migration note).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GapSelectExercise as GapSelectExerciseType } from '../../../../schemas/course/exercises';
import type { ExerciseInteraction } from '../../../../schemas/course/exercises';

interface GapSelectExerciseProps {
  exercise: GapSelectExerciseType;
  interaction: ExerciseInteraction;
  accent: string;
  onComplete: (xpEarned: number) => void;
}

export function GapSelectExercise({
  exercise,
  interaction,
  accent,
  onComplete,
}: GapSelectExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const total    = exercise.questions.length;
  const answered = Object.keys(answers).length;

  const handleSelect = (questionId: string, word: string) => {
    if (submitted) return;
    setAnswers(prev => {
      // Toggle off if already selected
      if (prev[questionId] === word) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: word };
    });
  };

  const isAnswerCorrect = (q: typeof exercise.questions[number], chosen: string): boolean => {
    if (q.correctOptionId) {
      const correctOption = q.options?.find(o => o.id === q.correctOptionId);
      return !!correctOption && correctOption.text.toLowerCase() === chosen.toLowerCase();
    }
    return q.acceptedAnswers?.some(a => a.toLowerCase() === chosen.toLowerCase()) ?? false;
  };

  const handleSubmit = () => {
    const correct = exercise.questions.filter(q => {
      const ans = answers[q.id] ?? '';
      return isAnswerCorrect(q, ans);
    }).length;
    const xp = Math.round(interaction.xp * (correct / Math.max(total, 1)));
    setScore(correct);
    setSubmitted(true);
    onComplete(xp);
  };

  return (
    <div>
      {exercise.description && (
        <p className="tw:text-sm tw:text-text-secondary tw:mb-5 tw:leading-relaxed">
          {exercise.description}
        </p>
      )}

      <div className="tw:space-y-5">
        {exercise.questions.map((q, qi) => {
          const chosen = answers[q.id] ?? null;
          const isCorrect = submitted && isAnswerCorrect(q, chosen ?? '');

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: qi * 0.06 }}
            >
              {/* Prompt with gap slot */}
              <p className="tw:text-sm tw:font-medium tw:text-text-primary tw:mb-3 tw:leading-relaxed">
                <span
                  className="tw:inline-flex tw:items-center tw:justify-center tw:w-5 tw:h-5 tw:rounded-full tw:text-xs tw:font-bold tw:text-white tw:mr-2"
                  style={{ backgroundColor: accent }}
                >
                  {qi + 1}
                </span>
                {/* Replace ___ placeholder with an animated gap slot */}
                {q.prompt.split('___').map((part, pi, arr) => (
                  <React.Fragment key={pi}>
                    {pi === 0 ? part.replace(/^\d+\.\s*/, '') : part}
                    {pi < arr.length - 1 && (
                      <motion.span
                        key={chosen ?? 'empty-gap'}
                        className="tw:inline-block tw:min-w-20 tw:px-2.5 tw:py-0.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:mx-1 tw:border tw:text-center"
                        initial={{ opacity: 0, scale: 0.82, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.18, type: 'spring', stiffness: 500, damping: 28 }}
                        style={
                          chosen
                            ? submitted
                              ? isCorrect
                                ? { background: 'var(--color-success-bg)', borderColor: 'var(--color-success)', color: 'var(--color-success-text)' }
                                : { background: 'var(--color-danger-bg)',  borderColor: 'var(--color-danger)',  color: 'var(--color-danger-text)'  }
                              : { background: `${accent}18`, borderColor: accent, color: accent, boxShadow: `0 2px 0 0 ${accent}40` }
                            : { background: 'var(--color-bg-muted)', borderColor: 'var(--color-border-default)', color: 'var(--color-text-disabled)' }
                        }
                      >
                        {chosen ?? '· · ·'}
                      </motion.span>
                    )}
                  </React.Fragment>
                ))}
              </p>

              {/* Word bank for this question */}
              {!submitted && q.options && (
                <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-1">
                  {q.options.map((opt, oi) => {
                    const isChosen = chosen === opt.text;
                    return (
                      <motion.button
                        key={opt.id}
                        type="button"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={!isChosen ? { scale: 1.06, y: -1 } : {}}
                        whileTap={{ scale: 0.92 }}
                        transition={{
                          duration: 0.14,
                          delay: (qi * 3 + oi) * 0.04,
                          type: 'spring',
                          stiffness: 400,
                          damping: 22,
                        }}
                        className="tw:px-3.5 tw:py-1.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:border tw:cursor-pointer tw:select-none"
                        style={
                          isChosen
                            ? {
                                background: `${accent}18`,
                                borderColor: accent,
                                color: accent,
                                boxShadow: `0 2px 0 0 ${accent}50`,
                              }
                            : {
                                background: 'var(--color-bg-muted)',
                                borderColor: 'var(--color-border-default)',
                                color: 'var(--color-text-primary)',
                              }
                        }
                        onClick={() => handleSelect(q.id, opt.text)}
                      >
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Score */}
      {submitted && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="tw:mt-5 tw:px-4 tw:py-3 tw:rounded-xl tw:text-sm tw:font-medium tw:flex tw:items-center tw:gap-2"
          style={{
            backgroundColor: score === total ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            color: score === total ? 'var(--color-success-text)' : 'var(--color-warning-text)',
          }}
        >
          <span>{score === total ? '🎉' : '💡'}</span>
          <span>{score === total ? `All ${total} correct!` : `${score} / ${total} correct.`}</span>
        </motion.div>
      )}

      {!submitted && (
        <div className="tw:mt-6 tw:flex tw:justify-end">
          <button
            type="button"
            disabled={answered < total}
            className="tw:px-5 tw:py-2.5 tw:rounded-pill tw:text-sm tw:font-semibold tw:text-white tw:transition-opacity tw:disabled:opacity-40 tw:cursor-pointer tw:disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: `0 4px 0 0 ${accent}80` }}
            onClick={handleSubmit}
          >
            Check answers
          </button>
        </div>
      )}
    </div>
  );
}
