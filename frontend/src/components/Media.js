import React from 'react'
import classNames from 'clsx'

/**
 * @typedef {Object} MediaProps
 */

/**
 * @type {React.FunctionComponent<MediaProps>}
 */
const Media = props => (
  <div className={classNames('media', { inline: props.inline && 'd-inline'})}>
    {props.children}
  </div>
)

export default Media
