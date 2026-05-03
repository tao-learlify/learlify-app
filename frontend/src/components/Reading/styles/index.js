import React from 'react'
import clsx from 'clsx'

export function ContentContainer({ children, className, ...rest }) {
  return <div className={clsx('!tw:mb-[0.3rem] !tw:pb-[0.3rem]', className)} {...rest}>{children}</div>
}
export function SelectionContainer({ children, className, ...rest }) {
  return <span className={clsx('tw:px-[1.5px] tw:pb-[2px] tw:pt-[1.5px]', className)} {...rest}>{children}</span>
}
export function Circle({ children, className, ...rest }) {
  return <span className={clsx('tw:inline-flex tw:items-center tw:justify-center tw:w-[30px] tw:h-[30px] tw:rounded-full tw:text-[18px] tw:text-center tw:bg-[#00ccc6] tw:mb-5 tw:text-white', className)} {...rest}>{children}</span>
}
export function AnswerContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mb-[5px] tw:mt-[2.5px] tw:pt-[2.5px] tw:pb-[5px]', className)} {...rest}>{children}</div>
}
export function TextSmall({ children, className, ...rest }) {
  return <span className={clsx('!tw:text-xs', className)} {...rest}>{children}</span>
}
export function EmojiContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mr-3', className)} {...rest}>{children}</div>
}
export function TextInput({ children, className, ...rest }) {
  return <small className={clsx('!tw:text-[11px]', className)} {...rest}>{children}</small>
}
