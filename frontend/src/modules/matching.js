import FuzzySet from 'fuzzyset.js'

const MATCH_VALUE = 1

/**
 *
 * @param {Array<[]>} proximity
 */
const getExactValue = proximity => {
  const [hightestValue] = proximity

  return hightestValue >= MATCH_VALUE
}

/**
 * @see http://glench.github.io/fuzzyset.js/
 * @param {string []} words
 * @param {string} input
 * @param {boolean} strict
 */
export default function matchOneOf(words, input, strict) {
  const [match] = words
  
  const invalidInput = {
    title: input,
    isValid: false,
    match
  }

  if (strict) {
    return {
      ...invalidInput,
      isValid: words.includes(input.trim())
    }
  }

  /**
   * @description
   * Setting words for fuzzy set this came from json file.
   */
  const set = FuzzySet(words)

  /**
   * @description
   * We need to get our user input that came from <Form.Control />
   */
  const stats = set.get(input)

  /**
   * @description
   * .get Method can return null is there no coincidence, to workaround this issue need to check with ternary.
   * Usually returns [number, string]
   */
  const output = stats ? stats.find(getExactValue) : invalidInput

  return output
    ? {
        title: input,
        isValid: output[0] === 1,
        match
      }
    : invalidInput
}
