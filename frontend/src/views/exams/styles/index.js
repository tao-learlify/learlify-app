import React from 'react'
import clsx from 'clsx'

export function Container({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-1.5', className)} {...rest}>{children}</div>
}
export function ReportContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:absolute max-[695px]:tw:mt-[0.4rem] max-[695px]:tw:left-0 max-[1099px]:tw:left-[30px] max-[1099px]:tw:mr-8', className)} {...rest}>{children}</div>
}
