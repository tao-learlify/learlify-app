import { GLOBAL_CONTEXT } from 'constant'
import * as LABELS from 'constant/labels'



/**
 * @typedef {Object} Marking
 * @property {string []} labels
 * @property {number []} points
 * @property {string []} multiple
 */

/**
 * @typedef {Object} BandScore
 * @property {string []} labels
 * @property {number []} scores
 */

/**
 * @param {Marking}
 */
function getMarkingBy({ labels, points: [x, y], multiple }) {
  const range = {
    max: y,
    min: x
  }

  return [labels, range, multiple]
}

const SCORE = {
  [GLOBAL_CONTEXT.APTIS]: {
    marking: [
      getMarkingBy({
        labels: [LABELS.GRAMMAR],
        points: [0, 1],
        multiple: [LABELS.VOCABULARY]
      }),
      getMarkingBy({
        labels: [],
        points: [0, 1],
        multiple: [
          LABELS.READING_PART_1,
          LABELS.READING_PART_2,
          LABELS.READING_PART_3,
          LABELS.READING_PART_4,
          LABELS.READING_PART_5
        ]
      }),
      getMarkingBy({
        labels: [LABELS.LISTENING_PART_1],
        points: [0, 1],
        multiple: [LABELS.LISTENING_PART_2, LABELS.LISTENING_PART_3]
      })
    ]
  }
}

export const ASSERT = 1

/**
 *
 * @param {number} accumulator
 * @param {{}} next
 * @param {number} score
 */
const getTotalOfAsserts = (accumulator, next, score) =>
  next.isValid ? accumulator + score : accumulator

/**
 *
 * @param {[number, number]}
 * @param {number} asserts
 */
export const getBandScore = ([max, min], asserts) =>
  max >= asserts && min <= asserts

/**
 * @typedef {Object} Score
 * @property {string} model
 * @property {boolean} modular
 *
 * @param {Score}
 * @returns {number}
 */
export default function getScore({ model, label, modular, data }) {
  if (label.includes(LABELS.SPEAKING) || label.includes(LABELS.WRITING)) {
    return 0
  }

  switch (model) {
    case GLOBAL_CONTEXT.APTIS: {
      const key = GLOBAL_CONTEXT.APTIS
      /***
       * @description
       * Making undefined to labels, because we don't use it.
       */
      const { 1: range, 2: multiples } = SCORE[key].marking.find(context => {
        const { 0: labels, 2: multiples } = context

        return labels.includes(label) || multiples.includes(label)
      })

      /**
       * @description
       * Multiples work totally different from single feedbacks, so we need to claim all points instead of one.
       */
      if (multiples.includes(label)) {
        /**
         * @description
         * Getting our acumulator of points.
         */
        const asserts = data.selections.reduce(
          (accumulator, next) => getTotalOfAsserts(accumulator, next, ASSERT),
          range.min
        )

        return asserts
      }

      return data.selection.isValid ? range.max : range.min
    }

    case GLOBAL_CONTEXT.IELTS: {
      if (modular) {
        /**
         * Flating will reduce the complexity to map this object and reducing to a single value.
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
         * @type {number}
         */
        const asserts = data.modules
          .flat()
          .reduce(
            (accumulator, next) => getTotalOfAsserts(accumulator, next, ASSERT),
            0
          )

        return asserts
      } else if (data.selections.length > 0) {
        const asserts = data.selections.reduce(
          (accumulator, next) => getTotalOfAsserts(accumulator, next, ASSERT),
          0
        )

        return asserts
      }

      return data.selection.isValid ? 1 : 0
    }

    default:
      throw new Error()
  }
}
