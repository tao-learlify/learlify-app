import React, { memo, useCallback, useState } from 'react'
import useEventListener from 'hooks/useEventListener'
import ScrollContent from './ScrollContent'

/**
 * @typedef {Object} ScrollProgressProps
 * @property {React.Node} children
 */

/**
 * @type {React.FunctionComponent<ScrollProgressProps>}
 */
const ScrollProgress = ({ children }) => {
  const [scroll, setScroll] = useState(0)

  useEventListener('scroll', () => {
    window.requestAnimationFrame(() => {
      calculateScrollDistance()
    })
  })

  const getDocHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    )
  }

  const calculateScrollDistance = useCallback(() => {
    const scrollTop = window.pageYOffset

    const windowHeight = window.innerHeight

    const docHeight = getDocHeight()

    const totalDocScrollLength = docHeight - windowHeight

    const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100)

    setScroll(scrollPosition)
  }, [])

  return <ScrollContent scroll={scroll}>{children}</ScrollContent>
}

export default memo(ScrollProgress)
