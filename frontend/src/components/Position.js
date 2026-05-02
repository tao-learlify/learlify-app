import React, { memo } from 'react'

/**
 * @typedef {Object} PositionProps
 * @property {'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'} type
 */

/**
 * @type {React.FunctionComponent<PositionProps>}
 */
const Position = ({ type, children }) => (
	<div className={`position-${type}`}>
		{children}
	</div>
)

export default memo(Position)