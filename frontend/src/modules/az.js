const initial = 'B'.charCodeAt()

const to = 'Z'.charCodeAt()

const staticValues = Array(Math.abs(initial - (to + 1)))
  .fill(initial)
  .map((num, index) => String.fromCharCode(num + index))

/**
 * @param {number} index
 */
export function getAZIndex(index) {
  return staticValues[index]
}
