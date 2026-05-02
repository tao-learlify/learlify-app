import React, { memo } from 'react'

const ScrollView = ({ children }) => (
  <div className="text-scroll">
    {children}
  </div>
)

export default memo(ScrollView)