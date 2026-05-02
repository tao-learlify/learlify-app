import React, { memo } from 'react'

export default memo((props) => (
  <li className={`d-flex justify-content-between align-items-center ${props.className}`}>
    {props.children}
  </li>
))