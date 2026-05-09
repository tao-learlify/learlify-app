import React from 'react'
import clsx from 'clsx'

export function ChatContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-[10px] tw:pt-[10px]', className)} {...rest}>{children}</div>
}
