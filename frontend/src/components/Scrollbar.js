import React, { memo } from 'react'

import 'assets/css/Scrollbar.css'

const ScrollBar = ({ children }) => (
  <div className='scrollbar'>
    {children}
  </div>
)

export default memo(ScrollBar)