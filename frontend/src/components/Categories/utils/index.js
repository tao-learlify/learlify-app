const BLUE = 'blue-palette'
const RED = 'red-palette'
const TURQUOISE = 'turquoise-palette'
const YELLOW = 'yellow-palette'

const PALETTE = new Map([
  [0, BLUE],
  [1, RED],
  [2, TURQUOISE],
  [3, YELLOW],
  [4, BLUE],
  [5, TURQUOISE],
  [6, RED],
  [7, YELLOW],
  [8, RED],
  [9, BLUE],
])

/**
 * @param {{ paletteIndex: number }} element
 * @param {number} index
 * @returns {string}
 */
export const getPaletteByColors = (element, index) => {
  if (element && element.hasOwnProperty('paletteIndex')) {
    const item = PALETTE.get(element.paletteIndex)

    return `${item}-${index + 1}`
  }

  const item = PALETTE.get(index)

  return `${item}-${index}`
}
