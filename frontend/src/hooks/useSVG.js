import { useCallback } from 'react'

/**
 * @typedef {Object} SVGConfig
 * @property {string} classList
 * @property {string [] []} attributes
 */

/**
 * @param {SVGConfig} defaultConfig
 * @returns {() => void} 
 */
function useSVG(defaultConfig = { classList: 'svg-class-name', attributes: [] }) {
  return useCallback((svg) => {
    svg.classList.add(defaultConfig.classList)

    defaultConfig.attributes.forEach(([attribute, property]) => {
      svg.setAttribute(attribute, property)
    })
  }, [defaultConfig])
}

export default useSVG