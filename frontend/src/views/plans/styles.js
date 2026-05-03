import React from 'react'
import clsx from 'clsx'

export function WrapperTable({ children, className, ...rest }) {
  return (
    <div className={clsx('tw:flex tw:flex-col tw:justify-center tw:items-center tw:px-5 tw:py-2.5 md:tw:px-10 md:tw:py-2.5', className)} {...rest}>
      {children}
    </div>
  )
}
