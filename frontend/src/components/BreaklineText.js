import React, { memo } from 'react'

import * as CONSTANT from 'constant'
import Text from './Text'

/**
 * @typedef {Object} BreaklineTextProps
 * @property {string} breaklineClassName
 * @property {boolean} center
 * @property {TextColor} color  
 * @property {React.Node} renderContentOnFirstText
 * @property {boolean} splitWithDiv
 * @property {TextTag} tag
 * @property {string} value
 */

/**
 * @type {React.FunctionComponent<BreaklineTextProps>}
 */
const BreaklineText = ({
  lighter,
  dunkin,
  bold,
  breaklineClassName,
  center,
  color,
  matchTextClassName,
  renderContentOnFirstText,
  splitWithDiv,
  tag,
  children,
  value
}) => {
  return value.split(CONSTANT.breakline).map((expressions, index) =>
    expressions.match(CONSTANT.breakline) ? (
      !splitWithDiv ? (
        <br className={breaklineClassName} key={index} />
      ) : (
        <div className={breaklineClassName} key={index} />
      )
    ) : (
      <React.Fragment key={index}>
        <Text lighter={lighter} dunkin={dunkin} bold={bold} tag={tag} center={center} color={color} className={matchTextClassName}>
          {expressions.replace(CONSTANT.breakline, '')} {index === 0 && renderContentOnFirstText && (
            renderContentOnFirstText
          )}
        </Text>
        
      </React.Fragment>
    )
  )
}

BreaklineText.defaultProps = {
  tag: 'small',
  color: 'muted',
  matchTextClassName: '',
  value: '',
  splitWithDiv: false
}

export default memo(BreaklineText)
