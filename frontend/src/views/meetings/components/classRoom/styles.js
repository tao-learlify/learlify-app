import React from 'react'
import clsx from 'clsx'

export function ParticipantContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex-1', className)} {...rest}>{children}</div>
}

export function ClassRoomWrapper({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center tw:justify-center tw:w-full tw:h-full tw:flex-col sm:tw:flex-row', className)} {...rest}>{children}</div>
}

export function UsersContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:items-center tw:justify-center tw:flex-1 tw:h-full tw:w-full', className)} {...rest}>{children}</div>
}

export function WaitingUser({ children, className, ...rest }) {
  return <div className={clsx('tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-full tw:w-full tw:text-gray-400 tw:text-[1.7vw] tw:rounded-[10px] max-[620px]:tw:text-[4vw]', className)} {...rest}>{children}</div>
}

export function ImageContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-[15px]', className)} {...rest}>{children}</div>
}
