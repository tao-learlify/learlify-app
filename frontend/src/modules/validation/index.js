import * as LABELS from 'constant/labels'

import { isEmptyString } from 'utils/functions'

import {
  createAutomaticPendingFeedback,
  createSchemaError,
  dragAndDropValidation,
  isFill,
  isSelectionCorrect,
  selectAliasAndValidate
} from './utils'


import { DRAG_AND_DROP_CONTAINER as DragAndDropRefElement } from 'constant'

import lang from 'lang'


/**
 * @typedef {Object} ValidationSchema
 * @property {{}} exercise
 * @property {{}} state
 */
const selectionsWithOneFill = [LABELS.GRAMMAR, LABELS.LISTENING, LABELS.LISTENING_PART_1]

const selectionsWithDrag = [LABELS.READING_PART_2]

const recordsWithFills = [
  LABELS.SPEAKING_PART_1,
  LABELS.SPEAKING_PART_2,
  LABELS.SPEAKING_PART_3,
  LABELS.SPEAKING_PART_4,
]

const recordsWithForms = [
  LABELS.WRITING_PART_1,
  LABELS.WRITING_PART_2,
  LABELS.WRITING_PART_3,
  LABELS.WRITING_PART_4
]

const recordsWithDropdownAndRadios = [
  LABELS.LISTENING_PART_2,
  LABELS.LISTENING_PART_3,
  LABELS.READING_PART_1,
  LABELS.READING_PART_3,
  LABELS.READING_PART_4,
  LABELS.READING_PART_5,
  LABELS.VOCABULARY
]

const MODES = {
  MODULAR: 'modular',
  MULTIPLE: 'multiple',
  SINGLE: 'single'
}

/**
 * @description
 * This module is for exercise validation only.
 */

/**
 * @param {ValidationSchema}
 * @param {() => {}} callback
 */
export const validationGeneral = ({ exercise, state }, callback) => {
  const { data, selection, selections, recordings } = state

  const { label, questions } = exercise

  /**
   * @description
   * If are simple selection with one simple match, should only return this logic.
   */
  if (selectionsWithOneFill.includes(label)) {
    return isFill(selection)
      ? callback({
          feedback: isSelectionCorrect({
            options: exercise.answers,
            location: exercise.correct,
            selection
          }),
          mode: MODES.SINGLE
        })
      : callback(
          createSchemaError({
            message: lang.t('ALL.FILL')
          })
        )
  }

  /**
   * @description
   * If exercise only needs to be order this is how works.
   */
  if (selectionsWithDrag.includes(label)) {
    const feedback = dragAndDropValidation({
      questions,
      node: document.getElementById(DragAndDropRefElement)
    })

    return callback({
      feedback,
      mode: MODES.MULTIPLE
    })
  }

  /**
   * @description
   * This validation only works for speakings.
   */
  if (recordsWithFills.includes(label)) {
    return recordings.length === questions.length
      ? callback(createAutomaticPendingFeedback())
      : callback(
          createSchemaError({
            message: lang.t('ALL.SPEAKING')
          })
        )
  }

  /**
   * @description
   * This only apply for writings forms.
   */
  if (recordsWithForms.includes(label)) {
    const isUncompleted = selections.some(isEmptyString)

    return isUncompleted
      ? callback(
          createSchemaError({
            message: lang.t('ALL.WRITING')
          })
        )
      : callback(createAutomaticPendingFeedback())
  }

  /**
   * @description
   * This only apply for reading dropdowns and ratios.
   */
  if (recordsWithDropdownAndRadios.includes(label)) {
    if (exercise.modules) {
      const defaultTitleDropdown = lang.t('ALL.PICK')
      /**
       * @description
       * Concatenates all modules together.
       */
      const total = data.context.reduce((notCompleted, next) => {
        const isInvalid = next.selections.some(
          selection =>
            isEmptyString(selection) || selection === defaultTitleDropdown
        )

        return isInvalid ? notCompleted : notCompleted + 1
      }, 0)


      const sizeOfModules = exercise.modules.length

      if (total !== sizeOfModules) {
        return callback(
          createSchemaError({
            message: lang.t('ALL.MODULES')
          })
        )
      }

      const feedback = exercise.modules.map((properties, index) =>
        selectAliasAndValidate(properties, data.context[index].selections)
      )

      return callback({
        feedback,
        mode: MODES.MODULAR
      })
    }

    const isUncompleted = selections.includes('')

    if (isUncompleted) {
      return callback(
        createSchemaError({
          message: lang.t('ALL.MISSING')
        })
      )
    }
    const feedback = selectAliasAndValidate(exercise, selections)


    return callback({
      feedback,
      mode: MODES.MULTIPLE
    })
  }
}
