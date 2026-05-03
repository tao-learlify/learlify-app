import React from 'react'
import clsx from 'clsx'

const JUSTIFY_MAP = {
  center: 'tw:justify-center',
  'flex-start': 'tw:justify-start',
  'flex-end': 'tw:justify-end',
  'space-between': 'tw:justify-between',
  'space-around': 'tw:justify-around',
}

export default function FlexContainer({ children, justifyContent = 'center', hiddenMobile = false, className, ...rest }) {
  return (
    <div
      className={clsx(
        'tw:flex',
        JUSTIFY_MAP[justifyContent] || 'tw:justify-center',
        hiddenMobile && 'tw:hidden sm:tw:flex',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
