import FuzzySet from 'fuzzyset.js'


const PROXIMITY_RATIO = 0.8
/**
 * @param {string []} words 
 * @param {string} word 
 */
const like = (words, word) => {
  const fs = FuzzySet(words)

  const data = fs.get(word)

  const match = Array.isArray(data) && data[0][0] >= PROXIMITY_RATIO

  return match
}


export default like