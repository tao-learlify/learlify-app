import { setSelection, setSelections } from 'state/exercise'
import * as LABELS from 'constant/labels'

const modules = {
  MATCHING: 'Matching',
  DROPDOWN: 'Dropdown'
}

const dispatcher = [
  { action: setSelection, labels: [LABELS.GRAMMAR, LABELS.LISTENING_PART_1, LABELS.LISTENING] },
  {
    action: setSelections,
    labels: [
      LABELS.LISTENING_PART_2,
      LABELS.LISTENING_PART_3,
      LABELS.READING_PART_1,
      LABELS.READING_PART_3,
      LABELS.READING_PART_4,
      LABELS.READING_PART_5,
      LABELS.VOCABULARY,
      LABELS.WRITING_PART_1,
      LABELS.WRITING_PART_2,
      LABELS.WRITING_PART_3,
      LABELS.WRITING_PART_4
    ]
  }
]

/**
 * @param {string} label
 */
export const handleContextSelection = label => {
  const { action } = dispatcher.find(({ labels }) => labels.includes(label))

  return action
}

export default modules
