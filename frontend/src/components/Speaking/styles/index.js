import React from 'react'
import clsx from 'clsx'

export function Content({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-4', className)} {...rest}>{children}</div>
}
export function AudioRecorderContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-6', className)} {...rest}>{children}</div>
}
