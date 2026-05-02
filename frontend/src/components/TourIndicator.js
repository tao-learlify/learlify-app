import React, { memo } from 'react'
import Tour from 'reactour'

import useToggler from 'hooks/useToggler'


/**
 * @typedef {{ selector?: string, content?: string }} Indicator
 */

/**
 * @typedef {Object} TourIndicatorProps
 * @property {Array<Indicator>} indications
 */

/**
 * @type {React.FunctionComponent<TourIndicatorProps>}
 */
const TourIndicator = ({ indications }) => {
  const [open, setOpen] = useToggler(true)

  const closeRequest = () => {
    setOpen(false)

    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } catch (err) {
      window.scrollTo({
        top: 0
      })
    }
  }

  return (
    <Tour
      onRequestClose={closeRequest}
      isOpen={open} 
      steps={indications}
      rounded={8}
      accentColor='#ffb300'
    />
  )
}

TourIndicator.defaultProps = {
  indications: [],
}

export default memo(TourIndicator)

