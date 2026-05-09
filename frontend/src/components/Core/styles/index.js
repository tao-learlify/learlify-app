import React from 'react'
import clsx from 'clsx'

export function DisplayContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:inline', className)} {...rest}>{children}</div>
}
