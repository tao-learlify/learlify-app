import React from 'react'
import clsx from 'clsx'

export default function TableRow({ children, className, ...rest }) {
  return <tr className={clsx('tw:text-center', className)} {...rest}>{children}</tr>
}
