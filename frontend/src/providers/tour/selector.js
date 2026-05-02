/**
 * @param {string} ref
 * @param {string} content
 * @returns {import("components/TourIndicator").Indicator}
 */
function createSelectorTour(ref, content) {
  return {
    selector: `[tour="${ref}"]`,
    content
  }
}

/**
 * @param {string []} indicator 
 */
export const mapSelector = indicator =>
  indicator.map((indication, index) =>
    createSelectorTour((index + 1).toString(), indication)
  )

export default createSelectorTour
