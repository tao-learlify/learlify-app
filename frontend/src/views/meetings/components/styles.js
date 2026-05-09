import React from 'react'
import clsx from 'clsx'

export function MeetingContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:justify-center tw:items-center tw:px-5 tw:py-[10px] tw:w-full tw:h-full md:tw:px-10', className)} {...rest}>{children}</div>
}

export function Container({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:w-full tw:h-full tw:items-center tw:justify-center', className)} {...rest}>{children}</div>
}

export function ChatContainer({ children, className, ...rest }) {
  return (
    <div className={clsx(
      'tw:w-[calc(20%-150px)] tw:max-w-[150px] tw:min-w-[130px] tw:h-full',
      'max-[1520px]:tw:max-w-[310px] max-[1520px]:tw:min-w-[280px]',
      'max-[1160px]:tw:max-w-[320px] max-[1160px]:tw:min-w-[290px]',
      'max-[940px]:tw:max-w-[280px] max-[940px]:tw:min-w-[250px]',
      'max-[840px]:tw:max-w-[210px] max-[840px]:tw:min-w-[205px]',
      'max-[772px]:tw:max-w-full max-[772px]:tw:min-w-full max-[772px]:tw:fixed max-[772px]:tw:bottom-0',
      className
    )} {...rest}>{children}</div>
  )
}
