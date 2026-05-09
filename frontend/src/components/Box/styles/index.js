import React from 'react'
import clsx from 'clsx'

export function Header({ children, className, ...rest }) {
  return (
    <div
      className={clsx('tw:rounded-t-[20px] tw:border-[5px] tw:border-[#d9d9d9] tw:border-b-0 tw:bg-white tw:p-3', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
