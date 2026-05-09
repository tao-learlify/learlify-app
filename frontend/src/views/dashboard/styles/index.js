import React from 'react'
import clsx from 'clsx'

export const searchStyles = { position: 'relative', bottom: 3 }
export const prependStyles = { ...searchStyles, height: 30 }

export function BannerContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-center', className)} {...rest}>{children}</div>
}
export function ViewContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-4', className)} {...rest}>{children}</div>
}
export function RowContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-4', className)} {...rest}>{children}</div>
}
export function PaperContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-center tw:mt-2 tw:pt-2', className)} {...rest}>{children}</div>
}
export function TestDetailItemContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-1.5', className)} {...rest}>{children}</div>
}
