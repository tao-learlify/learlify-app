import matchOneOf from 'modules/matching'
import labels from 'modules/exercises'
import like from 'modules/words'

/**
 * @typedef {Object} Fill
 * @property {string} title
 *
 * @param {Fill}
 */
export function isFill({ title }) {
  return title
}

/**
 * @typedef {Object} SelectionCorrection
 * @property {string} selection
 * @property {string []} options
 * @property {number} location
 *
 * @param {SelectionCorrection}
 */
export function isSelectionCorrect({
  selection: { title },
  options,
  location
}) {

  if (typeof options[location] === 'object') {
    const index = options.findIndex(option => option.title === title)
  
    return {
      title,
      match: options[location].title,
      isValid: index === location
    }
  }

  const index = options.findIndex(option => option === title)

  return {
    title,
    match: options[location],
    isValid: index === location
  }
}

/**
 * @param {{ message: string }}
 */
export function createSchemaError({ message }) {
  return {
    error: true,
    message
  }
}

/**
 * @param {{ questions?: [ ]}}
 */
export function dragAndDropValidation({ questions, node }) {
  const dragSelection = Array.from(node.children).map(child => {
    const context = child.innerText.trim().replace(/\n/g, '')

    return context.substring(1, context.length)
  })

  const questionsByOrder = [...questions].sort((a, b) =>
    a.orderAs < b.orderAs ? -1 : 1
  )

  const matchByOrder = questionsByOrder.map((question, current) => ({
    isValid: like([dragSelection[current]], question.title),
    match: question.title,
    title: dragSelection[current]
  }))

  return matchByOrder
}

/**
 * This functions get all computed data from validation.
 * @param {{ alias: string }}
 */
export function selectAliasAndValidate(data, inputs) {
  if (data.module) {
    switch (data.module) {
      case labels.MATCHING:
        return data.questions.map((question, index) =>
          matchOneOf(question.answers, inputs[index], true)
        )

      default:
        return data.questions.map((question, index) =>
          isSelectionCorrect({
            selection: { title: inputs[index] },
            options: question.answers,
            location: question.correct
          })
        )
    }
  }
  return data.questions.map((question, index) =>
    isSelectionCorrect({
      selection: { title: inputs[index] },
      options: question.answers,
      location: question.correct
    })
  )
}

export function createAutomaticPendingFeedback() {
  return {
    automatic: true,
    confetti: true
  }
}
