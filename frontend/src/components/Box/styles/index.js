import React from 'react'
import { Card } from 'react-bootstrap'
import clsx from 'clsx'

export function Header({ children, className, ...rest }) {
  return (
    <Card.Header
      className={clsx('tw:rounded-t-[20px] tw:border-[5px] tw:border-[#d9d9d9] tw:border-b-0 tw:bg-white', className)}
      {...rest}
    >
      {children}
    </Card.Header>
  )
}
