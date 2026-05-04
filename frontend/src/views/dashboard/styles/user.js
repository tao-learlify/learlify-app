import React from 'react'
import clsx from 'clsx'

export function StyledCol({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-2.5 tw:px-4', className)} {...rest}>{children}</div>
}

export function PlanContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:pt-2.5 tw:pb-8', className)} {...rest}>{children}</div>
}

export function BannerContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:border-2 !tw:border-solid tw:rounded-[50px]', className)} {...rest}>{children}</div>
}

export function DialogName({ children, className, ...rest }) {
  return <small className={clsx('tw:absolute tw:top-[50px] tw:w-[70px] tw:text-center tw:font-bold tw:text-[#1a56db]', className)} {...rest}>{children}</small>
}
