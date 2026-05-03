import React from 'react'
import clsx from 'clsx'

export function TextInitialContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:w-[40%]', className)} {...rest}>{children}</div>
}
export function TextContentContainer({ children, className, ...rest }) {
  return <span className={clsx('tw:ml-1 tw:mt-1', className)} {...rest}>{children}</span>
}
export function IconContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:ml-2', className)} {...rest}>{children}</div>
}
export function Container({ children, className, ...rest }) {
  return <div className={clsx('tw:p-2', className)} {...rest}>{children}</div>
}
