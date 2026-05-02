/**
 * ExerciseRouter — routes an ExerciseBlock to its concrete renderer.
 *
 * Level 1: ExerciseFamily (selection / input / ordering / pairing / speaking / writing)
 * Level 2: specific ExerciseType within each family
 *
 * Speaking → SpeakingBlockWrapper (bridges to legacy Speaking component)
 * Writing  → WritingBlockWrapper  (bridges to legacy Writing component)
 */
import type { ExerciseBlock } from '../../../../schemas/course/blocks';
import { EXERCISE_FAMILY } from '../../../../schemas/course/enums';
import type {
  MultipleChoiceExercise,
  TrueFalseExercise,
  ListeningSelectExercise,
  GapSelectExercise,
  MatchingExercise,
  SpeakingOpenExercise,
  SpeakingImageExercise,
  WritingOpenExercise,
  WritingFormExercise,
} from '../../../../schemas/course/exercises';

import { SelectionExercise }       from './SelectionExercise';
import { GapSelectExercise as GapSelectView } from './GapSelectExercise';
import { ListeningSelectExercise as ListeningSelectView } from './ListeningSelectExercise';
import { MatchingExercise as MatchingView } from './MatchingExercise';
import { SpeakingBlockWrapper }    from './SpeakingBlockWrapper';
import { WritingBlockWrapper }     from './WritingBlockWrapper';

interface ExerciseRouterProps {
  block: ExerciseBlock;
  accent: string;
  onComplete: (xpEarned: number) => void;
}

export function ExerciseRouter({ block, accent, onComplete }: ExerciseRouterProps) {
  const { exercise, interaction } = block;
  const family = EXERCISE_FAMILY[exercise.type];

  switch (family) {
    case 'selection':
      switch (exercise.type) {
        case 'multiple_choice':
        case 'true_false':
          return (
            <SelectionExercise
              exercise={exercise as MultipleChoiceExercise | TrueFalseExercise}
              interaction={interaction}
              accent={accent}
              onComplete={onComplete}
            />
          );
        case 'listening_select':
          return (
            <ListeningSelectView
              exercise={exercise as ListeningSelectExercise}
              interaction={interaction}
              accent={accent}
              onComplete={onComplete}
            />
          );
        default:
          return <ExercisePlaceholder label={exercise.label} type={exercise.type} accent={accent} />;
      }

    case 'input':
      switch (exercise.type) {
        case 'gap_select':
          return (
            <GapSelectView
              exercise={exercise as GapSelectExercise}
              interaction={interaction}
              accent={accent}
              onComplete={onComplete}
            />
          );
        default:
          return <ExercisePlaceholder label={exercise.label} type={exercise.type} accent={accent} />;
      }

    case 'speaking':
      return (
        <SpeakingBlockWrapper
          exercise={exercise as SpeakingOpenExercise | SpeakingImageExercise}
          interaction={interaction}
          review={block.review}
          accent={accent}
          onComplete={onComplete}
        />
      );

    case 'writing':
      return (
        <WritingBlockWrapper
          exercise={exercise as WritingOpenExercise | WritingFormExercise}
          interaction={interaction}
          review={block.review}
          accent={accent}
          onComplete={onComplete}
        />
      );

    case 'pairing':
      return (
        <MatchingView
          exercise={exercise as MatchingExercise}
          interaction={interaction}
          accent={accent}
          onComplete={onComplete}
        />
      );

    case 'ordering':
    default:
      return <ExercisePlaceholder label={exercise.label} type={exercise.type} accent={accent} />;
  }
}

// ── Placeholder for unimplemented exercise types ──────────────

function ExercisePlaceholder({
  label,
  type,
  accent,
}: {
  label: string;
  type: string;
  accent: string;
}) {
  return (
    <div
      className="tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:border"
      style={{
        backgroundColor: `${accent}08`,
        borderColor: `${accent}30`,
        color: 'var(--color-text-secondary)',
      }}
    >
      <span className="tw:font-semibold">{label}</span>
      <span className="tw:ml-2 tw:opacity-50">({type} — renderer coming soon)</span>
    </div>
  );
}
