import React, { memo } from 'react'

/**
 * @description
 * Displays the content with the padding for view.
 */
const ViewContent = ({ children }) => (<div className="pt-5 mt-5">{children}</div>)

export default memo(ViewContent)