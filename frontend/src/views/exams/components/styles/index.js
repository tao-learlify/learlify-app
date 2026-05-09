import React from 'react'
import clsx from 'clsx'

export function CoreContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-1.5', className)} {...rest}>{children}</div>
}
export function ListeningContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-2.5', className)} {...rest}>{children}</div>
}
export function ReadingContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-2.5 tw:pb-2.5', className)} {...rest}>{children}</div>
}
export function WritingContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-[calc(10px+10vh)] tw:pb-2', className)} {...rest}>{children}</div>
}
