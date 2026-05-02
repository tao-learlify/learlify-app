import * as Scroll from 'react-scroll'

/**
 * @typedef {'animateScroll' | 'Link' | 'Events' | 'scrollSpy' | 'Element'} ScrollEnum
 */


/**
 * @see https://www.npmjs.com/package/react-scroll
 * @param {ScrollEnum} option 
 */
function useScroll (option = 'animateScroll') {
  const scroll = Scroll[option]

  /**
   * @typedef {Object} ScrollOptions
   * @property {number} duration
   * @property {number} delay
   * @property {boolean} smooth
   * @property {number} offset
   * 
   * @param {string} elementName 
   * @param {ScrollOptions} options 
   */
  const scrollFn = (elementName, options) => {
    if (elementName) {
      scroll.scrollTo(elementName, options)
    }

    scroll.scrollToTop(options)
  }


  return scrollFn
}


export default useScroll