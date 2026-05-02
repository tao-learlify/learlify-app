import React, { memo } from 'react'

import BreaklineText from 'components/BreaklineText'

/**
 * @typedef {Object} RegExpInterceptProps
 * @property {React.Node []} children
 * @property {string} value String as argument
 * @property {RegExp} expression The RegExp expression to match
 * @property {boolean} fragment With fragment only will cut one piece.
 * @property {boolean} splitChars Will split the char condintionally.
 * @property {boolean} breaklineChars will use component rendering of "BreaklineText"
 * @property {import ('components/BreaklineText').BreaklineTextProps} breaklineProps
 */

/**
 * @type {React.FunctionComponent<RegExpInterceptProps>}
 */
const RegExpIntercept = ({
  value,
  children,
  expression,
  fragment,
  splitChars,
  breaklineChars,
  breaklineProps
}) => {
  /**
   * @description
   * String method dynamically..
   */
  const useMethod = fragment ? 'split' : 'match'

  return (
    <>
      {value[useMethod](expression).map((char, index) =>
        char.match(expression) ? (
          children
        ) : splitChars && breaklineChars ? (
          <BreaklineText key={index} value={char} {...breaklineProps} />
        ) : (
          char
        )
      )}
    </>
  )
}

RegExpIntercept.defaultProps = {
  splitChars: true
}

export default memo(RegExpIntercept)
