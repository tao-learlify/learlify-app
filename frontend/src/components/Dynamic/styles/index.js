import React from 'react'
import clsx from 'clsx'

export function TextInput({ children, className, ...rest }) {
  return <div className={clsx('tw:text-[11px]', className)} {...rest}>{children}</div>
}
