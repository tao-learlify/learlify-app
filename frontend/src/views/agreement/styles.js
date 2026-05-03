import React from 'react'
import clsx from 'clsx'

export function ScheduleContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex', className)} {...rest}>{children}</div>
}
export function ProgressBarContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:px-5 tw:py-5 md:tw:px-10 md:tw:py-5', className)} {...rest}>{children}</div>
}
export function StreamingContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:px-5 tw:py-2.5 md:tw:px-10 md:tw:py-2.5', className)} {...rest}>{children}</div>
}
export function ButtonsContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-between tw:px-5 tw:py-5 md:tw:px-10 md:tw:py-5', className)} {...rest}>{children}</div>
}
export function ButtonContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-5 tw:pt-5', className)} {...rest}>{children}</div>
}
export function Button({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:w-fit tw:justify-center tw:items-center tw:cursor-pointer tw:uppercase tw:tracking-[0.8px] tw:font-bold tw:rounded-2xl tw:border-2 tw:border-[#afafaf] tw:bg-[#e5e5e5] tw:text-[#afafaf] tw:px-2.5 tw:py-2.5 tw:text-[2.3vw] md:tw:text-lg hover:tw:bg-[#989898] hover:tw:border-[#989898]', className)} {...rest}>{children}</div>
}
export function Title({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-center tw:items-center tw:text-[#3c3c3c] tw:font-bold tw:text-[4vw] md:tw:text-2xl', className)} {...rest}>{children}</div>
}
