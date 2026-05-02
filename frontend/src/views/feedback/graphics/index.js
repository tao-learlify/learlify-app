import * as CONSTANT from 'constant'

/**
 * @param {{ feedback: {}, points: number }} props
 */
export default function reduceData({ feedback }) {
  if (feedback && feedback.answer) {
    return Boolean(feedback.answer.isCorrect)
  }
  return feedback.answers.reduce(
    (previous, next) => previous.concat(Boolean(next.isCorrect)),
    []
  )
}


/**
 *
 * @param {number} value
 * @param {[min: number, max: number, keyword: string]} marking
 */
function range(value, marking) {
  return marking.filter(([min, max]) => {
    return max >= value && min <= value
  })
}

export const C1 = {
  keyword: 'C1',
}

export const B2 = {
  keyword: 'B2',
}

export const B1 = {
  keyword: 'B1',
}
export const A2 = {
  keyword: 'A2',
}

export const A1 = {
  keyword: 'A1'
}

/**
 * @param {number} results
 * @param {'core' | 'reading' | 'listening'} type
 * @description
 * 
 */
export function skillsMarking(results, type) {
  const skills = [
    {
      type: CONSTANT.core,
      skills: {
        /**
         * @type [number, number, string] ranges
         * The first value matches the lowest value to get as marking.
         * The second value is the highest value to get marking.
         * The third value as string, matches only the keyword to get as marking.
         * @example
         * 45 => "C1" on core
         */
        ranges: [
          [45, 55, C1.keyword],
          [35, 44, B2.keyword],
          [25, 34, B1.keyword],
          [10, 24, A2.keyword],
          [0, 9, A1.keyword]
        ]
      }
    },
    {
      type: CONSTANT.reading,
      skills: {
        ranges:[
          [45, 55, C1.keyword],
          [35, 44, B2.keyword],
          [25, 34, B1.keyword],
          [15, 24, A2.keyword],
          [0, 14, A1.keyword]
        ]
      }
    },
    {
      type: CONSTANT.listening,
      skills: {
        ranges: [
          [45, 55, C1.keyword],
          [35, 44, B2.keyword],
          [25, 34, B1.keyword],
          [10, 24, A2.keyword],
          [0, 9, A1.keyword]
        ]
      }
    },
    {
      type: CONSTANT.writing,
      skills: {
        ranges: [
          [45, 55, C1.keyword],
          [35, 44, B2.keyword],
          [25, 34, B1.keyword],
          [15, 24, A2.keyword],
          [0, 14, A1.keyword]
        ]
      }
    },
    {
      type: CONSTANT.speaking,
      skills: {
        ranges: [
          [45, 55, C1.keyword],
          [40, 44, B2.keyword],
          [25, 39, B1.keyword],
          [15, 24, A2.keyword],
          [0, 14, A1.keyword]
        ]
      }
    }
  ]

  const data = skills.find(sk => sk.type === type)


  const dataset = range(results, data.skills.ranges).flat()

  return dataset[2]
}
