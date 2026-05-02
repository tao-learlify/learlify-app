import React from 'react'

const AptisFromGroup = ({ children }) => (
  <div className="form-group">{children}</div>
)

export default React.memo(AptisFromGroup)
