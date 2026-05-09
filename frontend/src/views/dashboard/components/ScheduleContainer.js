import React from 'react'
import clsx from 'clsx'

export default function ScheduleContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-1.5 tw:pt-1.5 tw:flex tw:justify-center', className)} {...rest}>{children}</div>
}
